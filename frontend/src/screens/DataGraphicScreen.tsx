import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Menu, Provider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import ChartCard from "../components/ChartCard";
import colors from "../theme/colors";
import api from "../services/api"; // <- seu axios configurado
import { useFocusEffect } from "@react-navigation/native";

const DataGraphicScreen: React.FC = () => {
  const tempData = [
    { x: 1, y: 22 },
    { x: 2, y: 24 },
    { x: 3, y: 23 },
    { x: 4, y: 25 },
    { x: 5, y: 26 },
  ];

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Estados
  const [period, setPeriod] = useState<"dia" | "semana" | "mês">("dia");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar dados do backend
  const fetchDados = async () => {
  try {
    const response = await api.get("/dados");
    const data = response.data;

    // Mapeia os dados para o formato esperado pelo gráfico
    const formatado = data.map((item: any, index: number) => ({
      x: index + 1,
      y: Number(item.temperatura),
      data: item.data_hora,
    }));

    setDados(formatado);
  } catch (error) {
    console.error("❌ Erro ao buscar dados:", error);
  } finally {
    setLoading(false);
  }
};

// Atualiza quando a tela ganha foco
useFocusEffect(
  React.useCallback(() => {
    fetchDados();
  }, [])
);

  // Últimos valores
const dadosInvertidos = [...dados].reverse();
const lastTemp = dadosInvertidos.length > 0 ? dadosInvertidos[dadosInvertidos.length - 1].y : "--";
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

        {/* Gráficos */}
        {loading ? (
  <ActivityIndicator size="large" color={colors.primary} />
) : (
  <ChartCard
    title="Temperatura (°C)"
    data={dados.length > 0 ? dados : [{ x: 0, y: 0 }]}
    chartType={chartType}
  />
)}
        
      </View>

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
