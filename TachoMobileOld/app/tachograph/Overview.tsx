import React from "react";
import { View, StyleSheet, Text } from "react-native";
import OverwievButtonList from "@/components/OverviewButtonsList";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Colors } from "@/constants/Colors";
import { ProgressBar } from "react-native-paper";

export default function Overview() {
  return (
    <View style={styles.mainContainer}>
      {/* Content */}
      <View>
        <View>
          <Text style={styles.driverData}>Michał Turek</Text>
        </View>

        {/* <ProgressBar progress={0.7} color={"blue"} style={styles.progressBar} /> */}

        <View style={styles.circularProgressContainer}>
          <AnimatedCircularProgress
            size={350}
            width={10}
            fill={100}
            tintColor={Colors.purple}
            backgroundColor="#3d5875"
            rotation={225}
            lineCap="round"
            style={styles.circularProgress}
            arcSweepAngle={270}
          >
            {(fill) => (
              <View>
                <Text style={styles.progressText}>Informacja</Text>
                <Text style={styles.progressText}>Informacja</Text>
                <Text style={styles.progressText}>Informacja</Text>
              </View>
            )}
          </AnimatedCircularProgress>
          <Text>Informacja</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <OverwievButtonList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    margin: 20,
    justifyContent: "space-between",
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  driverData: {
    fontSize: 24,
    textAlign: "center",
  },

  circularProgressContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  circularProgress: {
    marginTop: 20,
  },

  progressBar: {
    width: "100%", // Szerokość paska postępu
    height: 10, // Wysokość paska postępu
    marginTop: 20,
    borderRadius: 10,
  },

  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  buttonContainer: {
    alignSelf: "stretch", // Take full width of the parent container
  },
});
