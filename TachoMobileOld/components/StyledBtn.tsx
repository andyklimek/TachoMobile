import React from "react";
import { Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";

interface StyledBtnProps {
  text: string;
  onClick: () => void;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  icon: React.ReactNode;
}

export default function StyledBtn(props: StyledBtnProps) {
  const containerStyles = StyleSheet.create({
    container: {
      backgroundColor: props.bgColor,
      borderColor: props.borderColor ? props.borderColor : props.bgColor, // If borderColor is provided then use it if not then use standard color
      borderWidth: 3,
      padding: 10,
      borderRadius: 5,
      marginVertical: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    buttonText: {
      fontSize: 20,
      color: props.textColor,
      textAlign: "center",
      flex: 1,
    },
    iconContainer: {
      textAlign: "left",
    },
  });

  return (
    <Pressable>
      <TouchableOpacity
        onPress={props.onClick}
        style={containerStyles.container}
      >
        <Text style={containerStyles.iconContainer}>{props.icon}</Text>
        <Text style={containerStyles.buttonText}>{props.text}</Text>
      </TouchableOpacity>
    </Pressable>
  );
}
