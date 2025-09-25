import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { VictoryLine } from "victory-native";
import colors from "../theme/colors";

type ChartCardProps = {
  title: string;
  data: { x: string | number; y: number }[];
};

const ChartCard: React.FC<ChartCardProps> = ({ title, data }) => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <VictoryLine
        data={data}
        width={screenWidth * 0.85}
        height={200}
        style={{
          data: { stroke: colors.primary, strokeWidth: 3 },
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