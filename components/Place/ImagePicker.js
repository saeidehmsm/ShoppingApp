import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

const ImgPicker = (props) => {
  const [imageUrl, setImageUrl] = useState(null);
  const getPermission = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient Permissions!, you need to need grant camera permissions to make this work!",
        [{ Text: "Okay" }]
      );
      return false;
    }
    return true;
  };
  const takeImageHandler = async () => {
    const hasPermission = await getPermission();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.6,
    });
    // console.log(image);
    if (image) {
      setImageUrl(image.uri);
      props.OnImageTaken(image.uri);
    }
  };

  return (
    <View style={styles.imagePicker}>
      <TouchableOpacity style={styles.imagePreview} onPress={takeImageHandler}>
        {!imageUrl ? (
          <Text>Plaese click to choose an image!</Text>
        ) : (
          <Image style={styles.image} source={{ uri: imageUrl }} />
        )}
      </TouchableOpacity>
      {/* <View style={styles.ButtonContainer}>
        <Button
          title="take image"
          color={Colors.accent}
          onPress={takeImageHandler}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  imagepicker: {
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  ButtonContainer: {
    marginTop: 10,
  },
});

export default ImgPicker;
