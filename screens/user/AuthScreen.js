import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import Input from "../../components/UI/input";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/action/auth";

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

const AuthScreen = (props) => {
  const [isLoading, setIsloading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

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

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
      // console.log("signup");
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
      //console.log("login");
    }
    setError(null);
    setIsloading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Shop");
    } catch (error) {
      setError(error.message);
      Alert.alert("Error", error.message, [{ text: "Okay" }]);
      setIsloading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardoffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <View style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="Email"
              keyboardType="email-address"
              required
              email
              errorText="please enter a valid email!"
              autoCapitalize="none"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              errorText="please enter a valid password!"
              autoCapitalize="none"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
              ) : (
                <View style={styles.button}>
                  <Button
                    title={isSignup ? "Login" : "Sign Up"}
                    color={Colors.primary}
                    onPress={authHandler}
                  />
                </View>
              )}

              <View style={styles.button}>
                <Button
                  title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
                  color={Colors.accent}
                  onPress={() => setIsSignup((prevState) => !prevState)}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: "Authenticate ",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  button: {
    marginTop: 10,
    width: "80%",
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    height: 300,
    margin: 20,
    width: "80%",
    maxWidth: 400,
  },
});
export default AuthScreen;
