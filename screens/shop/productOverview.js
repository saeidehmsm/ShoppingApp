import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Button,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import ProductItems from "../../components/shop/productItems";
import * as cardAction from "../../store/action/card";
import * as productActions from "../../store/action/products";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

const productOverview = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const products = useSelector(
    (state) => state.productsReducer.availableProducts
  );

  const selecthandler = (id, title) => {
    props.navigation.navigate("ProductDetails", {
      productId: id,
      productTitle: title,
    });
  };
  const dispatch = useDispatch();

  const loadProducts = useCallback(
    async (abortController) => {
      //console.log("LOAD PRODUCTS!!");
      setError(null);
      setIsLoading(true);
      try {
        await dispatch(productActions.fetchProducts(abortController));
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    },
    [dispatch, setIsLoading, setError]
  );

  useEffect(() => {
    const abortController = new AbortController();
    loadProducts(abortController);
    return () => {
      abortController.abort();
    };
  }, [loadProducts]);

  //refresh the product list , when navigate via left drawer navigation
  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", () =>
      loadProducts()
    );
    return () => {
      // Remove EventListener,when component is unMounted
      // props.navigation.removeListener("willFocus", () => loadProducts());
      willFocusSub.remove();
    };
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text>An error occured!</Text>
        <Button
          title="Try Again"
          color={Colors.primary}
          onPress={loadProducts}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (!isLoading && products && products.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }
  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isLoading}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItems
          imageUrl={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selecthandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selecthandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(cardAction.addToCard(itemData.item));
            }}
          />
        </ProductItems>
      )}
    />
  );
};

productOverview.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
    headerRight: () => (
      <HeaderButton
        name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
        color={Platform.OS === "ios" ? Colors.primary : "white"}
        onPress={() => {
          navData.navigation.navigate("Card");
        }}
      />
    ),
    headerLeft: () => (
      <HeaderButton
        name={Platform.OS === "ios" ? "ios-menu" : "md-menu"}
        color={Platform.OS === "ios" ? Colors.primary : "#ccc"}
        onPress={() => {
          navData.navigation.toggleDrawer();
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

export default productOverview;
