import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Menu, Provider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
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

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Estados
  const [period, setPeriod] = useState<"dia" | "semana" | "mês">("dia");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Últimos valores
  const lastTemp = tempData[tempData.length - 1].y;
  const lastHum = humidityData[humidityData.length - 1].y;

  // Trocar tipo de gráfico
  const toggleChartType = () => {
    setChartType(chartType === "line" ? "bar" : "line");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header com filtros */}
      <Provider>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Ionicons name="pencil" size={22} color={colors.white} />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => {
                setChartType("line");
                closeMenu();
              }}
              title="Linha"
            />
            <Menu.Item
              onPress={() => {
                setChartType("bar");
                closeMenu();
              }}
              title="Barra"
            />
          </Menu>
        </View>
      </Provider>

      {/* Filtros */}
      <View style={styles.filterRow}>
        {["dia", "semana", "mês"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              period === item && styles.filterActive,
            ]}
            onPress={() => setPeriod(item as any)}
          >
            <Text
              style={[
                styles.filterText,
                period === item && styles.filterTextActive,
              ]}
            >
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Últimos valores */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{lastTemp}°C</Text>
          <Text style={styles.statLabel}>Temperatura</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{lastHum}%</Text>
          <Text style={styles.statLabel}>Umidade</Text>
        </View>
      </View>

      {/* Gráficos */}
      <ChartCard
        title="Temperatura (°C)"
        data={tempData}
        chartType={chartType}
      />
      <ChartCard
        title="Umidade (%)"
        data={humidityData}
        chartType={chartType}
      />

      {/* Navegação por datas */}
      <View style={styles.navRow}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {currentDate.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
          })}
        </Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: colors.cardBackground,
  },
  filterActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.white,
    fontSize: 14,
  },
  filterTextActive: {
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.highlight,
  },
  statLabel: {
    fontSize: 12,
    color: colors.white,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    color: colors.white,
  },
});

export default DataGraphicScreen;
