import { ADD_ORDER, SET_ORDERS } from "./../action/order";
import Order from "./../../models/order";

const initialState = {
  orders: [],
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return {
        orders: action.orders,
      };
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date
      );
      return { ...state, orders: state.orders.concat(newOrder) };

    default:
      return state;
  }
};

export default orderReducer;
