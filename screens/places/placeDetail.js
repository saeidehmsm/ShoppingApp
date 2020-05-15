import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { useSelector } from "react-redux";

import Colors from "../../constants/Colors";
import MapPreview from "./../../components/Place/MapPreview";

const PlaceDetailScreen = (props) => {
  const placeId = props.navigation.getParam("placeId");

  const selectedPlace = useSelector((state) =>
    state.placesReducer.places.find((pl) => pl.id === placeId)
  );

  const selectedLocation = { lat: selectedPlace.lat, lng: selectedPlace.lng };

  const showMapHandler = () => {
    props.navigation.navigate("Map", {
      readOnly: true,
      initialLocation: selectedLocation,
    });
  };
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedPlace.image }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{selectedPlace.address}</Text>
        </View>
        <MapPreview
          onPress={showMapHandler}
          style={styles.mapPreview}
          location={selectedLocation}
        />
      </View>
    </ScrollView>
  );
};
PlaceDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("placeTitle"),
  };
};

const styles = StyleSheet.create({
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
    backgroundColor: "#ccc",
  },
  locationContainer: {
    marginVertical: 20,
    marginLeft: 5,
    width: "100%",
    maxWidth: 350,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 10,
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary,
    textAlign: "center",
  },
  mapPreview: {
    width: "100%",
    maxWidth: 350,
    height: 300,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default PlaceDetailScreen;
