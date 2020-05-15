import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Colors from "../../constants/Colors";
import MapPreview from "./MapPreview";

const LocationPicker = (props) => {
  const [isFetching, setFetching] = useState(false);
  const [pickedLocation, setLocation] = useState(null);

  const mapPickedLocation = props.navigation.getParam("pickedLocation");

  useEffect(() => {
    if (mapPickedLocation) {
      //console.log("mapPickedLocation", mapPickedLocation);
      setLocation(mapPickedLocation);
      props.onPickedLocation(mapPickedLocation);
    }
  }, [mapPickedLocation]);

  const getPermission = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient Permissions!, you need to need grant location permissions to make this work!",
        [{ Text: "Okay" }]
      );
      return false;
    }
    return true;
  };
  const getLocationHandler = async () => {
    const hasPermission = await getPermission();
    if (!hasPermission) return;
    try {
      setFetching(true);
      const location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      //console.log(location);
      const currentLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      setLocation(currentLocation);
      props.onPickedLocation(currentLocation);
    } catch (error) {
      Alert.alert(
        "Could not fetch location!",
        "Please try again or pick location on the map!",
        [{ text: "Okay" }]
      );
      console.log(error);
    }
    setFetching(false);
    // console.log(pickedLocation);
  };

  const pickOnMapHandler = () => {
    props.navigation.navigate("Map");
  };

  return (
    <TouchableOpacity
      style={styles.locationContainer}
      onPress={getLocationHandler}
    >
      <MapPreview
        style={styles.mapPreview}
        location={pickedLocation}
        onPress={pickOnMapHandler}
      >
        {isFetching ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <Text>Plaese click to choose a location!</Text>
        )}
      </MapPreview>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  locationContainer: {
    marginVertical: 15,
  },
  mapPreview: {
    marginBottom: 10,
    width: "100%",
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
  },
});

export default LocationPicker;
