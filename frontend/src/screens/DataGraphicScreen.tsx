import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import ChartCard from "../components/ChartCard";
import colors from "../theme/colors";

const DataGraphicScreen: React.FC = () => {
  const tempData = [
    { x: 1, y: 22 },
    { x: 2, y: 24 },
    { x: 3, y: 23 },
    { x: 4, y: 25 },
    { x: 5, y: 26 },
  ];

  const humidityData = [
    { x: 1, y: 50 },
    { x: 2, y: 55 },
    { x: 3, y: 52 },
    { x: 4, y: 58 },
    { x: 5, y: 60 },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gráficos da Estufa</Text>
      <ChartCard title="Temperatura (°C)" data={tempData} />
      <ChartCard title="Umidade (%)" data={humidityData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 12,
  },
});

export default DataGraphicScreen;