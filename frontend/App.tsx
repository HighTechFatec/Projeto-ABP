import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import NewSampleScreen from "./src/screens/NewSampleScreen";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#202123" />
      <NewSampleScreen />
    </SafeAreaView>
  );
}
