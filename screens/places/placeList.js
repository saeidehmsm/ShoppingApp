import React, { useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import PlaceItem from "../../components/Place/PlaceItem";
import * as placesActions from "../../store/action/places";

const PlaceListScreen = (props) => {
  const places = useSelector((state) => state.placesReducer.places);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(placesActions.loadPlace());
  }, [dispatch]);

  return (
    <FlatList
      data={places}
      keyExtractor={(item) => item.id.toString()}
      renderItem={(itemData) => (
        <PlaceItem
          title={itemData.item.title}
          image={itemData.item.image}
          address={itemData.item.address}
          onSelect={() => {
            props.navigation.navigate("PlaceDetail", {
              placeId: itemData.item.id,
              placeTitle: itemData.item.title,
            });
          }}
        />
      )}
    />
  );
};

PlaceListScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Places",
    headerRight: () => (
      <HeaderButton
        name={Platform.OS === "android" ? "md-add" : "ios-add"}
        color={Platform.OS === "ios" ? Colors.primary : "white"}
        onPress={() => {
          navData.navigation.navigate("NewPlace");
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

const styles = StyleSheet.create({});

export default PlaceListScreen;
