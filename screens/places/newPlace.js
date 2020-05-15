import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import * as placeActions from "../../store/action/places";
import ImgPicker from "./../../components/Place/ImagePicker";
import LocationPicker from "../../components/Place/LocationPicker";

const NewPlaceScreen = (props) => {
  const [titleValue, setTitleValue] = useState("");
  const [image, setImage] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const dispatch = useDispatch();

  const titleChangeHandler = (text) => {
    setTitleValue(text);
  };

  const imageTakenHandler = (image) => {
    setImage(image);
  };

  const pickedLocationHandler = useCallback((pickedLocation) => {
    //console.log("newPlace :: ", pickedLocation);
    setSelectedLocation(pickedLocation);
  }, []);

  const savePlaceHandler = () => {
    dispatch(placeActions.addPlace(titleValue, image, selectedLocation));
    props.navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={titleChangeHandler}
          value={titleValue}
        />
        <ImgPicker OnImageTaken={imageTakenHandler} />
        <LocationPicker
          navigation={props.navigation}
          onPickedLocation={pickedLocationHandler}
        />
        <View style={styles.ButtonContainer}>
          <Button
            title="Save Place"
            color={Colors.primary}
            onPress={savePlaceHandler}
          />
        </View>
      </View>
    </ScrollView>
  );
};

NewPlaceScreen.navigationOptions = {
  headerTitle: "New Place",
};

const styles = StyleSheet.create({
  form: {
    margin: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
  },
  textInput: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 30,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  ButtonContainer: {
    marginTop: 10,
  },
});

export default NewPlaceScreen;
