import Order from "./../../models/order";
export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    const response = await fetch(
      `https://rn-products-83f68.firebaseio.com/orders/${userId}.json`
    );

    if (!response.ok) {
      throw new Error("Something wrong happen!");
    }
    const result = await response.json();
    const loadedOrders = [];

    for (const key in result) {
      loadedOrders.push(
        new Order(
          key,
          result[key].cardItems,
          result[key].totalAmount,
          result[key].date
        )
      );
    }

    dispatch({ type: SET_ORDERS, orders: loadedOrders });
  };
};

export const addOrder = (cardItems, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;
    const userId = getState().authReducer.userId;
    const date = new Date().toISOString();
    const response = await fetch(
      `https://rn-products-83f68.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardItems,
          totalAmount,
          date: date,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("something went wrong!");
    }

    const result = await response.json();
    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: result.name,
        items: cardItems,
        amount: totalAmount,
        date: date,
      },
    });
  };
  // return {
  //   type: ADD_ORDER,
  //   orderData: { items: cardItems, amount: totalAmount },
  // };
};
