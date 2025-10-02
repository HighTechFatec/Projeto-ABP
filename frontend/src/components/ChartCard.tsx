import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import colors from "../theme/colors";

type ChartCardProps = {
  title: string;
  data: { x: string | number; y: number }[];
  chartType?: "line" | "bar";
};

const ChartCard: React.FC<ChartCardProps> = ({ title, data, chartType = "line" }) => {
  const screenWidth = Dimensions.get("window").width;
  const chartData = {
    labels: data.map((point) => String(point.x)),
    datasets: [
      {
        data: data.map((point) => point.y),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.cardBackground,
    backgroundGradientFrom: colors.cardBackground,
    backgroundGradientTo: colors.cardBackground,
    decimalPlaces: 1,
    color: (opacity = 1) => colors.highlight,
    labelColor: (opacity = 1) => colors.white,
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {chartType === "line" ? (
      <LineChart
          data={chartData}
          width={screenWidth * 0.85}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 12 }}
        />
      ) : (
        <BarChart
          data={chartData}
          width={screenWidth * 0.85}
          height={200}
          chartConfig={chartConfig}
          yAxisLabel=""
          yAxisSuffix=""
          style={{ borderRadius: 12 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
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