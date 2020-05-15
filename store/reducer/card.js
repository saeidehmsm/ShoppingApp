import { ADD_TO_CARD, REMOVE_FROM_CARD } from "../action/card";
import { ADD_ORDER } from "./../action/order";
import { DELETE_PRODUCT } from "./../action/products";

import CardItem from "../../models/card-item";

const initialState = {
  items: {},
  totalAmount: 0,
};

const cardReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CARD:
      const addedProduct = action.product;
      const productPrice = addedProduct.price;
      const productTitle = addedProduct.title;

      let updatedOrNewCardItem;

      if (state.items[addedProduct.id]) {
        //already have the item
        updatedOrNewCardItem = new CardItem(
          state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[addedProduct.id].sum + addedProduct.price
        );
      } else {
        updatedOrNewCardItem = new CardItem(
          1,
          productPrice,
          productTitle,
          productPrice
        );
      }
      return {
        // ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCardItem },
        totalAmount: state.totalAmount + productPrice,
      };

    case REMOVE_FROM_CARD:
      const selectedCardItem = state.items[action.pid];
      const currentQty = selectedCardItem.quantity;
      let updatedCardItems;
      if (currentQty > 1) {
        //should reduce qty of item, not remove
        const updatedCardItem = new CardItem(
          selectedCardItem.quantity - 1,
          selectedCardItem.productPrice,
          selectedCardItem.title,
          selectedCardItem.sum - selectedCardItem.productPrice
        );
        updatedCardItems = { ...state.items, [action.pid]: updatedCardItem };
      } else {
        updatedCardItems = { ...state.items };
        delete updatedCardItems[action.pid];
      }
      return {
        ...state,
        items: updatedCardItems,
        totalAmount: state.totalAmount - selectedCardItem.productPrice,
      };
    case ADD_ORDER:
      return initialState;
    case DELETE_PRODUCT:
      if (!state.items[action.pid]) return state;
      const updatedItems = { ...state.items };
      const itemTotal = state.items[action.pid].sum;
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal,
      };
    default:
      return state;
  }
};

export default cardReducer;
