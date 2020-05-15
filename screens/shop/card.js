import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import CardItem from "../../components/shop/cardIrem";
import * as cardActions from "../../store/action/card";
import * as orderActions from "../../store/action/order";

const CardScreen = () => {
  const [isloading, setIsloading] = useState(false);
  const totalAmount = useSelector((state) => state.cardReducer.totalAmount);
  const cardItems = useSelector((state) => {
    const transformedCardItems = [];
    for (const key in state.cardReducer.items) {
      transformedCardItems.push({
        productId: key,
        title: state.cardReducer.items[key].title,
        productPrice: state.cardReducer.items[key].productPrice,
        quantity: state.cardReducer.items[key].quantity,
        sum: state.cardReducer.items[key].sum,
      });
    }
    return transformedCardItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  const dispatch = useDispatch();

  const sendOrderHandler = async () => {
    setIsloading(true);
    await dispatch(orderActions.addOrder(cardItems, totalAmount));
    setIsloading(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total: <Text style={styles.amount}>${totalAmount.toFixed(2)}</Text>
        </Text>
        {isloading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cardItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </View>
      <FlatList
        data={cardItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CardItem
            quantity={itemData.item.quantity}
            title={itemData.item.title}
            amount={itemData.item.sum}
            deletable
            onRemove={() =>
              dispatch(cardActions.removeFromCard(itemData.item.productId))
            }
          />
        )}
      />
    </View>
  );
};
CardScreen.navigationOptions = {
  headerTitle: "Your Card",
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
  },
  amount: {
    color: Colors.primary,
  },
});

export default CardScreen;
