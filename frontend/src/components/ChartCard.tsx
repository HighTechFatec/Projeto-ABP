import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import colors from "../theme/colors";

type DataPoint = {
  x: number; 
  y: number;
};

type ChartCardProps = {
  title: string;
  data: DataPoint[];
  chartType?: "line" | "bar";
};

const ChartCard: React.FC<ChartCardProps> = ({ title, data, chartType = "line" }) => {
  const screenWidth = Dimensions.get("window").width;

  // Função para formatar timestamp para label legível
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    
    // Formata como "HH:MM" para horas e minutos
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };

  // Para evitar muitos labels, mostra apenas alguns pontos
  const getLabels = () => {
    if (data.length === 0) return [""];
    
    // Se tiver muitos dados, mostra apenas alguns labels
    const step = Math.max(1, Math.floor(data.length / 5));
    
    return data.map((point, index) => {
      // Mostra label apenas em alguns pontos para não ficar poluído
      if (index % step === 0 || index === data.length - 1) {
        return formatTimestamp(point.x);
      }
      return "";
    });
  };

  const chartData = {
    labels: getLabels(),
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
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {data.length > 0 ? (
        chartType === "line" ? (
          <LineChart
            data={chartData}
            width={screenWidth * 0.85}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 12 }}
            fromZero={false}
          />
        ) : (
          <BarChart
            data={chartData}
            width={screenWidth * 0.85}
            height={220}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix="°C"
            style={{ borderRadius: 12 }}
            fromZero={false}
          />
        )
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Sem dados para exibir</Text>
        </View>
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
    alignItems: 'center',
  },
  title: {
    color: colors.highlight,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'center',
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.7,
  },
});

export default ChartCard;