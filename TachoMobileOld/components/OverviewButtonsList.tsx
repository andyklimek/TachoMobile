import React from "react";
import { View, StyleSheet } from "react-native";
import StyledBtn from "./StyledBtn";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const iconSize = 20;

export default function OverwievButtonList() {
  const navigation = useNavigation();

  const goToRest = () => {
    navigation.navigate("Rest");
  };

  const goToJob = () => {
    navigation.navigate("Job");
  };

  const goToSettings = () => {
    navigation.navigate("settings/index");
  };

  return (
    <>
      <View style={styles.btnContainer}>
        <View style={styles.btnColumn}>
          <StyledBtn
            text="Dokumenty"
            onClick={() => {}}
            icon={
              <FontAwesome
                name="drivers-license"
                size={iconSize}
                color="white"
              />
            }
            bgColor={Colors.buttonBackgroundPurple}
            textColor={Colors.white}
          />
          <StyledBtn
            text="Pojazdy"
            onClick={() => {}}
            icon={
              <FontAwesome
                name="car"
                size={iconSize}
                color={Colors.greyButtonText}
              />
            }
            bgColor={Colors.buttonBackgroundGrey}
            textColor={Colors.greyButtonText}
          />
          <StyledBtn
            text="Ustawienia"
            onClick={goToSettings}
            icon={<Ionicons name="settings" size={iconSize} color="white" />}
            bgColor={Colors.buttonBackgroundPurple}
            textColor={Colors.white}
          />
        </View>
        <View style={styles.btnColumn}>
          <StyledBtn
            text="Praca"
            onClick={goToJob}
            icon={
              <MaterialCommunityIcons
                name="road-variant"
                size={iconSize}
                color={Colors.greyButtonText}
              />
            }
            bgColor={Colors.buttonBackgroundGrey}
            textColor={Colors.greyButtonText}
          />
          <StyledBtn
            text="Wydarzenia"
            onClick={() => {}}
            icon={<FontAwesome name="warning" size={iconSize} color="white" />}
            bgColor={Colors.buttonBackgroundPurple}
            textColor={Colors.white}
          />
          <StyledBtn
            text="Odpoczynek"
            onClick={goToRest}
            icon={
              <FontAwesome5
                name="bed"
                size={20}
                color={Colors.greyButtonText}
              />
            }
            bgColor={Colors.buttonBackgroundGrey}
            textColor={Colors.greyButtonText}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
  },
  btnColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },
});
