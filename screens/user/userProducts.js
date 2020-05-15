import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FlatList,
  Platform,
  Button,
  View,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import ProductItems from "../../components/shop/productItems";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import * as productAction from "../../store/action/products";

const UserProductScreen = (props) => {
  const userProducts = useSelector(
    (state) => state.productsReducer.userProducts
  );

  const editProductHandler = (id) => {
    props.navigation.navigate("EditProduct", { productId: id });
  };

  const deleteHandler = (id) => {
    Alert.alert("Are you sure?", "Do you really want to delete the product?", [
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(productAction.deleteProduct(id));
        },
      },
      { text: "No", style: "default" },
    ]);
  };

  const dispatch = useDispatch();

  if (userProducts.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No product found,maybe start creating some!</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={userProducts}
      keyExtractor={(prod) => prod.id}
      renderItem={(itemData) => (
        <ProductItems
          imageUrl={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={() => {
              deleteHandler(itemData.item.id);
            }}
          />
        </ProductItems>
      )}
    />
  );
};

UserProductScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Products",
    headerLeft: () => (
      <HeaderButton
        name={Platform.OS === "ios" ? "ios-menu" : "md-menu"}
        color={Platform.OS === "ios" ? Colors.primary : "#ccc"}
        onPress={() => {
          navData.navigation.toggleDrawer();
        }}
      />
    ),
    headerRight: () => (
      <HeaderButton
        name={Platform.OS === "android" ? "md-add" : "ios-add"}
        color={Platform.OS === "ios" ? Colors.primary : "white"}
        onPress={() => {
          navData.navigation.navigate("EditProduct");
        }}
      />
    ),
  };
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default UserProductScreen;
