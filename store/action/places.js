import * as FileSystem from "expo-file-system";
import { insertPlace, fetchPlaces } from "../../helper/db";
import Env from "../../env";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACE = "SET_PLACE";

export const addPlace = (title, image, location) => {
  return async (dispatch) => {
    //if you have google map API KEY use the commented code below
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${Env.googleApiKey}`;
    // const response = await fetch(url);

    // if (!response.ok) {
    //   throw new Error("sth went wrong!");
    // }

    // const resData = await response.json();
    // if (!resData.results) return;
    // const address = resData.results.formatted_address;
    // console.log("formatted address ::", address);
    const address = "";
    const fileName = image.split("/").pop();
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.moveAsync({ from: image, to: newPath });
      const dbResult = await insertPlace(
        title,
        newPath,
        address || "Dummy address",
        location ? location.latitude : 165.32,
        location ? location.longitude : -2548.36
      );
      //console.log(dbResult);
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath || "",
          address: address || "Dummy address",
          coords: {
            lat: location ? location.latitude : 165.32,
            lng: location ? location.longitude : -2548.36,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const loadPlace = () => {
  return async (dispatch) => {
    try {
      const dbResult = await fetchPlaces();
      //console.log(dbResult);
      dispatch({ type: SET_PLACE, places: dbResult.rows._array });
    } catch (error) {
      throw error;
    }
  };
};
