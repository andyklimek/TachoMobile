import React from "react";
import { Alert, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Button } from "react-native";
import TachoParser from "../tachoparser/TachoParser";

export default function Index() {
  const uploadFile = async () => {
    let result = await DocumentPicker.getDocumentAsync();

    if (result.canceled) {
      return;
    }

    try {
      const fileUri = result.assets[0].uri;
      const parser = new TachoParser(fileUri);
      await parser.readTachoFiles();
      // TODO: Reszta parsowania w projekcie
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Niewłaściwy plik .ddd",
        "Wybrałeś niewłaściwy albo uszkodzony plik DDD",
        [{ text: "Zamknij" }]
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Wybierz z którego miejsca pobrać plik .ddd</Text>
      <Button title="Web" onPress={uploadFile} />
      <Button title="Urządzenie" onPress={uploadFile} />
    </View>
  );
}
