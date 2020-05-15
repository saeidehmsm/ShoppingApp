import Product from "./../../models/Poduct";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = (abortController) => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        "https://rn-products-83f68.firebaseio.com/products.json",
        { signal: abortController.signal }
      );

      if (!response.ok) {
        throw new Error("Something wrong happen!");
      }
      const result = await response.json();
      //console.log("response from DB :", result);
      const loadedProducts = [];

      for (const key in result) {
        loadedProducts.push(
          new Product(
            key,
            result[key].ownerId,
            result[key].title,
            result[key].imageUrl,
            result[key].description,
            result[key].price
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
      });
    } catch (error) {
      if (abortController.signal.aborted) {
        // cancelled
        console.log("aborted", JSON.stringify(error));
      } else throw error;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;
    await fetch(
      `https://rn-products-83f68.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
  //return { type: DELETE_PRODUCT, pid: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;
    const userId = getState().authReducer.userId;
    const response = await fetch(
      `https://rn-products-83f68.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
        }),
      }
    );

    const result = await response.json();
    //console.log("response from DB :", result);
    dispatch({
      id: result.name,
      type: CREATE_PRODUCT,
      ProductData: {
        title,
        description,
        imageUrl,
        price,
        ownerId: userId,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    //console.log("getState()  :: ", getState());
    const token = getState().authReducer.token;
    await fetch(
      `https://rn-products-83f68.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, imageUrl }),
      }
    );

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      ProductData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
