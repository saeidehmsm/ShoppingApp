import React from "react";
import { StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

const HeaderButton = (props) => {
  return (
    <Icon
      containerStyle={styles.icon}
      type="ionicon"
      name={props.name}
      color={props.color}
      onPress={props.onPress}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    paddingHorizontal: 10,
  },
});
export default HeaderButton;
