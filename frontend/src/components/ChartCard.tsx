import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import colors from "../theme/colors";

type ChartCardProps = {
  title: string;
  data: { x: string | number; y: number }[];
};

const ChartCard: React.FC<ChartCardProps> = ({ title, data }) => {
  const screenWidth = Dimensions.get("window").width;

  // Converter [{x, y}] -> chart-kit format
  const chartData = {
    labels: data.map((point) => String(point.x)),
    datasets: [
      {
        data: data.map((point) => point.y),
        color: (opacity = 1) => colors.primary, // cor da linha
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={chartData}
        width={screenWidth * 0.85}
        height={200}
        chartConfig={{
          backgroundColor: colors.cardBackground,
          backgroundGradientFrom: colors.cardBackground,
          backgroundGradientTo: colors.cardBackground,
          decimalPlaces: 1,
          color: (opacity = 1) => colors.highlight,
          labelColor: (opacity = 1) => colors.white,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: colors.primary,
          },
        }}
        bezier
        style={{
          borderRadius: 12,
          marginVertical: 8,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    color: colors.highlight,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ChartCard;