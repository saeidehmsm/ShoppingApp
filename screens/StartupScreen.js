import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import Colors from "../constants/Colors";
import { useDispatch } from "react-redux";
import * as authActions from "../store/action/auth";

const StartupScreen = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLoging = async () => {
      const userDate = await AsyncStorage.getItem("userData");
      if (!userDate) {
        props.navigation.navigate("Auth");
        return;
      }
      const transformedData = JSON.parse(userDate);
      const { token, userId, expiaryDate } = transformedData;
      const expirationDate = new Date(expiaryDate);
      if (expirationDate <= new Date() || !userId || !token) {
        props.navigation.navigate("Auth");
        return;
      }
      props.navigation.navigate("Shop");

      const expirationTime = expirationDate.getTime() - new Date().getTime();
      dispatch(authActions.authenticate(userId, token, +expirationDate));
    };
    tryLoging();
  }, [dispatch]);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default StartupScreen;
