import React, { useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import CardItem from "./cardIrem";
import Colors from "./../../constants/Colors";

const OrderItem = (props) => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <View style={styles.OrderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>${props.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={Colors.primary}
          title={showDetail ? "Hide Details" : "Show Details"}
          onPress={() => setShowDetail((prevShowDetail) => !prevShowDetail)}
        />
      </View>
      {showDetail && (
        <View style={styles.itemDetail}>
          {props.items.map((item) => (
            <CardItem
              key={item.productId}
              quantity={item.quantity}
              title={item.title}
              amount={item.sum}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  OrderItem: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    margin: 20,
    padding: 10,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalAmount: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    fontFamily: "open-sans",
    color: "#888",
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  itemDetail: {
    width: "100%",
  },
});
export default OrderItem;
