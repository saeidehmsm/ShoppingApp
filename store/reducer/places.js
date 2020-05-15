import { ADD_PLACE, SET_PLACE } from "../action/places";
import Place from "./../../models/place";
const initialState = {
  places: [],
};

const PlacesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLACE:
      const newPlace = new Place(
        action.placeData.id.toString(),
        action.placeData.title,
        action.placeData.image,
        action.placeData.address,
        action.placeData.coords.lat,
        action.placeData.coords.lng
      );
      return {
        places: state.places.concat(newPlace),
      };
    case SET_PLACE:
      return {
        places: action.places.map(
          (pl) =>
            new Place(pl.id, pl.title, pl.imageUri, pl.address, pl.lat, pl.lng)
        ),
      };
    default:
      return state;
  }
};

export default PlacesReducer;
