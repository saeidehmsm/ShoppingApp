import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import ReduxThunk from "redux-thunk";

import productReducer from "./store/reducer/products";
import cardReducer from "./store/reducer/card";
import orderReducer from "./store/reducer/order";
import authReducer from "./store/reducer/auth";
import PlacesReducer from "./store/reducer/places";
import { composeWithDevTools } from "redux-devtools-extension";
import NavigationContainer from "./navigation/navigationContainer";
import { init } from "./helper/db";

init().then(
  () => {
    console.log("initialize DB");
  },
  (error) => {
    console.log("initialize DB failed", error);
  }
);
export default function App() {
  const rootReducer = combineReducers({
    productsReducer: productReducer,
    cardReducer: cardReducer,
    orderReducer: orderReducer,
    authReducer: authReducer,
    placesReducer: PlacesReducer,
  });
  // in product you should remove composeWithDevTools()
  //const store = createStore(rootReducer, composeWithDevTools());
  const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
  const [isFontLoade, setFontLoaded] = useState(false);

  const fetchFonts = () => {
    return Font.loadAsync({
      "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
      "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    });
  };

  if (!isFontLoade) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
