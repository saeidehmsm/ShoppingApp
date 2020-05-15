import React, { useEffect, useRef } from "react";
import { YellowBox } from "react-native";
import { useSelector } from "react-redux";
import { NavigationActions } from "react-navigation";

import ShopNavigator from "../navigation/shopNavigator";

const NavigationContainer = (props) => {
  const isAuth = useSelector((state) => !!state.authReducer.token);
  const navRef = useRef();

  useEffect(() => {
    //remove timer warning
    YellowBox.ignoreWarnings(["Setting a timer"]);
    if (!isAuth) {
      navRef.current?.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);
  return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;
