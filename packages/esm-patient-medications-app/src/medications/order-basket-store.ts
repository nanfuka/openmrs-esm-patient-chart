import { createGlobalStore } from '@openmrs/esm-framework';
import { OrderBasketItem } from '../types/order-basket-item';

function getPatientUuidFromUrl(): string {
  const match = /\/patient\/([a-zA-Z0-9\-]+)\/?/.exec(location.pathname);
  return match && match[1];
}
export interface OrderBasketStore {
  items: {
    [patientUuid: string]: {
      orders: Array<OrderBasketItem>;
      pendingOrders: boolean;
    };
  };
}

export interface OrderBasketStoreActions {
  setItems: (value: Array<OrderBasketItem> | (() => Array<OrderBasketItem>)) => void;
  isPending: (status: boolean) => void;
}

export const orderBasketStore = createGlobalStore<OrderBasketStore>('drug-order-basket', {
  items: {},
});

export const orderBasketStoreActions = {
  setItems(store: OrderBasketStore, value: Array<OrderBasketItem> | (() => Array<OrderBasketItem>)) {
    const patientUuid = getPatientUuidFromUrl();
    return {
      items: {
        ...store.items,
        [patientUuid]: {
          pendingOrders: store.items?.[patientUuid]?.pendingOrders,
          orders: typeof value === 'function' ? value() : value,
        },
      },
    };
  },
  
  isPending(store: OrderBasketStore, status: boolean) {
    const patientUuid = getPatientUuidFromUrl();
    console.log("whaaats the staaaa", status, {...store.items,
    [patientUuid]: {
      orders: store.items?.[patientUuid]?.orders,
      pendingOrders: status,
    }},)
    // const patientUuid = getPatientUuidFromUrl();
    return {
      ...store.items,
      [patientUuid]: {
        orders: store.items?.[patientUuid]?.orders,
        pendingOrders: status,
      },
    };
  },

  
};


export function getOrderItems(items: OrderBasketStore['items'], patientUuid: string): Array<OrderBasketItem> {
  return items?.[patientUuid]?.orders ?? [];
}

export function getOrderStatus(items: OrderBasketStore['items'], patientUuid) {
  console.log("kjjjjjjjjjjjjj", patientUuid, items?.[patientUuid]?.pendingOrders, items)
  return items?.[patientUuid]?.pendingOrders;
}