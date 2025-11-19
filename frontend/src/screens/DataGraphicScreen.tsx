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
import api from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

type DataPoint = {
  x: number; 
  y: number;
  data: string;
};

const DataGraphicScreen: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
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

      // Mapeia os dados usando timestamp real
      const formatado: DataPoint[] = data.map((item: any) => {
        const timestamp = new Date(item.data_hora).getTime();
        return {
          x: timestamp,
          y: Number(item.temperatura),
          data: item.data_hora,
        };
      });

      // Ordena por timestamp (mais antigo para mais recente)
      formatado.sort((a: DataPoint, b: DataPoint) => a.x - b.x);

      setDados(formatado);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
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

  // Última temperatura
  const lastTemp = dados.length > 0 ? dados[dados.length - 1].y : "--";

   return (
    <Provider>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header com temperatura atual e lápis */}
          <View style={styles.headerContainer}>
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperatureValue}>{lastTemp}°C</Text>
              <Text style={styles.temperatureLabel}>Temperatura</Text>
            </View>
            
            <View style={styles.menuContainer}>
              <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                  <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
                    <Ionicons name="pencil" size={22} color={colors.white} />
                  </TouchableOpacity>
                }
                style={styles.menu}
                contentStyle={styles.menuContent}
              >
                <Menu.Item
                  onPress={() => {
                    setChartType("line");
                    closeMenu();
                  }}
                  title="Linha"
                  style={styles.menuItem}
                />
                <Menu.Item
                  onPress={() => {
                    setChartType("bar");
                    closeMenu();
                  }}
                  title="Barra"
                  style={styles.menuItem}
                />
              </Menu>
            </View>
          </View>

          {/* Filtros DIA/SEMANA/MÊS */}
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

          {/* Gráficos */}
          <View style={styles.chartContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <ChartCard
                title="Temperatura (°C)"
                data={dados.length > 0 ? dados : []}
                chartType={chartType}
              />
            )}
          </View>
        </ScrollView>

        {/* Navegação por datas */}
        <View style={styles.navRow}>
          <Text style={styles.dateText}>
            {currentDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
            })}
          </Text>
        </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  temperatureContainer: {
    alignItems: "center",
    flex: 1,
  },
  temperatureValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.highlight,
    textAlign: "center",
  },
  temperatureLabel: {
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    marginTop: 4,
  },
  menuContainer: {
    position: "absolute",
    right: 0,
    top: 10,
    zIndex: 1000,
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
  },
  menu: {
    marginTop: 40,
    zIndex: 1001, 
  },
  menuContent: {
    backgroundColor: colors.cardBackground,
    zIndex: 1002,
  },
  menuItem: {
    zIndex: 1003,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    backgroundColor: colors.cardBackground,
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 2,
    flex: 1,
    alignItems: "center",
  },
  filterActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  filterTextActive: {
    fontWeight: "bold",
    color: colors.white,
  },
  chartContainer: {
    marginBottom: 20,
    zIndex: 1, 
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 16,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  dateText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "500",
  },
});

export default DataGraphicScreen;