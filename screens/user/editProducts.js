import React, { useEffect, useCallback, useReducer } from "react";
import {
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import * as productAction from "../../store/action/products";
import Input from "./../../components/UI/input";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updateInputValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updateInputValidities = {
      ...state.inputValidities,
      [action.input]: action.isValide,
    };
    let updatedformIsValid = true;

    for (const key in updateInputValidities) {
      updatedformIsValid = updatedformIsValid && updateInputValidities[key];
    }
    return {
      formIsValid: updatedformIsValid,
      inputValues: updateInputValues,
      inputValidities: updateInputValidities,
    };
  }
  return state;
};

const EditProduct = (props) => {
  const productId = props.navigation.getParam("productId");
  const editedProduct = useSelector((state) =>
    state.productsReducer.userProducts.find((prod) => prod.id === productId)
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  //   const [formState.inputValues, setTitle] = useState(editedProduct ? editedProduct.title : "");
  //   const [titleIsValid, setTitleIsValid] = useState(true);
  //   const [imageUrl, setImageUrl] = useState(
  //     editedProduct ? editedProduct.imageUrl : ""
  //   );
  //   const [price, setPrice] = useState("");
  //   const [description, setDescription] = useState(
  //     editedProduct ? editedProduct.description : ""
  //   );

  const inputChangeHandler = useCallback(
    (inputId, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValide: inputValidity,
        input: inputId,
      });
    },
    [dispatchFormState]
  );

  const dispatch = useDispatch();

  const Submit = useCallback(() => {
    if (!formState.formIsValid)
      return Alert.alert("wrong Input!", "Please check error in the form!", [
        { text: "Ok" },
      ]);

    if (editedProduct) {
      dispatch(
        productAction.updateProduct(
          productId,
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl
        )
      );
    } else {
      dispatch(
        productAction.createProduct(
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl,
          +formState.inputValues.price
        )
      );
    }
    props.navigation.goBack();
  }, [dispatch, productId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: Submit });
  }, [Submit]);

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
      <ScrollView>
        <View style={styles.form}>
          {/*
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.title}
            onChange={(e) => textChangeHandler("title", e.nativeEvent.text)}
            keyboardType="default"
            autoCorrect
            autoCapitalize="sentences"
            returnKeyType="next"
            onEndEditing={() => console.log("onEndEditing!!")}
            onSubmitEditing={() => console.log("onSubmitEditing!")}
          />
          {!formState.inputValidities.title && (
            <Text style={styles.error}>Please enter a valid title </Text>
          )}
        </View> */}
          <Input
            id="title"
            label="title"
            errorText="please enter a valid title!"
            keyboardType="default"
            autoCorrect
            autoCapitalize="sentences"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ""}
            initialValidity={!!editedProduct}
            required
          />
          <Input
            id="imageUrl"
            label="imageUrl"
            errorText="please enter a valid imageUrl!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ""}
            initialValidity={!!editedProduct}
            required
          />
          {editedProduct ? null : (
            <Input
              id="price"
              label="price"
              errorText="please enter a valid price!"
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={editedProduct ? editedProduct.price : ""}
              initialValidity={!!editedProduct}
              required
              min={0}
            />
          )}
          <Input
            id="description"
            label="description"
            errorText="please enter a valid description!"
            keyboardType="default"
            autoCorrect
            returnKeyType="next"
            multiLine
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ""}
            initialValidity={!!editedProduct}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProduct.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  const headerTitle = navData.navigation.getParam("productId")
    ? "Edit Product"
    : "Add Product";
  //console.log("header title", headerTitle);
  return {
    headerTitle: headerTitle,
    headerRight: () => (
      <HeaderButton
        name={Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"}
        color={Platform.OS === "ios" ? Colors.primary : "white"}
        onPress={submitFn}
      />
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
});
export default EditProduct;
