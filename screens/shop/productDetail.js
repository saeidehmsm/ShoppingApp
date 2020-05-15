import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import * as cardAction from "../../store/action/card";

const ProductDetail = (props) => {
  const productId = props.navigation.getParam("productId");
  const currentProduct = useSelector((state) =>
    state.productsReducer.availableProducts.find(
      (prod) => prod.id === productId
    )
  );
  const dispatch = useDispatch();
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: currentProduct.imageUrl }} />
      <View style={styles.action}>
        <Button
          color={Colors.primary}
          title="Add to Card"
          onPress={() => {
            dispatch(cardAction.addToCard(currentProduct));
          }}
        />
      </View>
      <Text style={styles.price}>${currentProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{currentProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetail.navigationOptions = (navData) => {
  return {
    headerTitle: () => (
      <Text style={styles.title}>
        {navData.navigation.getParam("productTitle")}
      </Text>
    ),
  };
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Platform.OS === "android" ? "white" : Colors.primary,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "open-sans-bold",
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
  },
  action: {
    marginVertical: 10,
    alignItems: "center",
  },
});

export default ProductDetail;
