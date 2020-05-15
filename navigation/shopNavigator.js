import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { SafeAreaView, View, Button } from "react-native";
import { useDispatch } from "react-redux";

import productOverview from "./../screens/shop/productOverview";
import ProductDetail from "./../screens/shop/productDetail";
import CardScreen from "./../screens/shop/card";
import OrderScreen from "./../screens/shop/order";
import UserProductScreen from "./../screens/user/userProducts";
import EditProduct from "./../screens/user/editProducts";
import PlaceListScreen from "./../screens/places/placeList";
import PlaceDetailScreen from "./../screens/places/placeDetail";
import NewPlaceScreen from "./../screens/places/newPlace";
import MapScreen from "./../screens/places/map";
import Colors from "../constants/Colors";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AuthScreen from "./../screens/user/AuthScreen";
import StartupScreen from "./../screens/StartupScreen";
import * as authActions from "../store/action/auth";

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const ProductsNavigator = createStackNavigator(
  {
    productsOverview: productOverview,
    ProductDetails: ProductDetail,
    Card: CardScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavigationOptions,
  }
);
const orderNavigator = createStackNavigator(
  {
    Order: OrderScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavigationOptions,
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProduct: UserProductScreen,
    EditProduct: EditProduct,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-create" : "ios-create"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavigationOptions,
  }
);

const PlacesNavigators = createStackNavigator(
  {
    PlaceList: PlaceListScreen,
    PlaceDetail: PlaceDetailScreen,
    NewPlace: NewPlaceScreen,
    Map: MapScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <MaterialIcons name="place" size={23} color={drawerConfig.tintColor} />
      ),
    },
    defaultNavigationOptions: defaultNavigationOptions,
  }
);
const shopNavigator = createDrawerNavigator(
  {
    products: ProductsNavigator,
    orders: orderNavigator,
    admin: AdminNavigator,
    place: PlacesNavigators,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const dispathc = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={() => {
                authActions.logout(authActions.logout());
                props.navigation.navigate("Auth");
              }}
            />
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
  }
);

const mainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: shopNavigator,
});

export default createAppContainer(mainNavigator);
