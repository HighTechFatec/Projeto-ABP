import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
  const [dados, setDados] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [todasAsDatas, setTodasAsDatas] = useState<string[]>([]);

  // Buscar dados do backend
  const fetchDados = async (dataFiltro?: Date) => {
    try {
      setLoading(true);
      let url = "/dados";

      // Se tiver uma data específica, filtra por ela
      if (dataFiltro) {
        const dataFormatada = dataFiltro.toISOString().split("T")[0];
        url = `/dados?data=${dataFormatada}`;
      }

      const response = await api.get(url);
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
      Alert.alert("Erro", "Não foi possível carregar os dados");
    } finally {
      setLoading(false);
    }
  };

  // Buscar todas as datas disponíveis
  const fetchDatasDisponiveis = async () => {
    try {
      const response = await api.get<string[]>("/dados/datas/disponiveis");
      setTodasAsDatas(response.data);
    } catch (error) {
      console.error("Erro ao buscar datas disponíveis:", error);
      try {
        interface DadoItem {
          data_hora: string;
        }
        const response = await api.get<DadoItem[]>("/dados");
        const datasUnicas: string[] = [
          ...new Set(
            response.data.map(
              (item: DadoItem) =>
                new Date(item.data_hora).toISOString().split("T")[0]
            )
          ),
        ];

        setTodasAsDatas(datasUnicas);
      } catch (fallbackError) {
        console.error("Erro no fallback de datas:", fallbackError);
      }
    }
  };

  // Atualiza quando a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      fetchDados();
      fetchDatasDisponiveis();
    }, [])
  );

  // Funções para navegar entre dias
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
    fetchDados(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);

    // Não permite navegar para datas futuras
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (newDate <= today) {
      setCurrentDate(newDate);
      fetchDados(newDate);
    } else {
      Alert.alert("Aviso", "Não é possível navegar para datas futuras");
    }
  };

  // Verifica se existem dados para o dia anterior
  const hasPreviousDay = () => {
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    const previousDateString = previousDate.toISOString().split("T")[0];

    // Se temos a lista de datas disponíveis, verifica nela
    if (todasAsDatas.length > 0) {
      return todasAsDatas.includes(previousDateString);
    }

    // Caso contrário, assume que pode voltar até uma data razoável
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 30); // Limite de 30 dias para trás
    return previousDate >= minDate;
  };

  // Verifica se existem dados para o próximo dia
  const hasNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const today = new Date();

    // Não permite navegar para datas futuras
    if (nextDate > today) {
      return false;
    }

    const nextDateString = nextDate.toISOString().split("T")[0];

    // Se temos a lista de datas disponíveis, verifica nela
    if (todasAsDatas.length > 0) {
      return todasAsDatas.includes(nextDateString);
    }

    return nextDate <= today;
  };

  // Função para aplicar filtros de período
  const aplicarFiltroPeriodo = async (
    novoPeriodo: "dia" | "semana" | "mês"
  ) => {
    setPeriod(novoPeriodo);

    try {
      let periodoParam = "";
      switch (novoPeriodo) {
        case "dia":
          periodoParam = "dia";
          break;
        case "semana":
          periodoParam = "semana";
          break;
        case "mês":
          periodoParam = "mes";
          break;
      }

      const response = await api.get(`/dados?periodo=${periodoParam}`);
      const data = response.data;

      const formatado: DataPoint[] = data.map((item: any) => {
        const timestamp = new Date(item.data_hora).getTime();
        return {
          x: timestamp,
          y: Number(item.temperatura),
          data: item.data_hora,
        };
      });

      formatado.sort((a: DataPoint, b: DataPoint) => a.x - b.x);
      setDados(formatado);
    } catch (error) {
      console.error("Erro ao aplicar filtro:", error);
      Alert.alert("Erro", "Não foi possível aplicar o filtro");

      // Fallback: busca dados normais se o filtro falhar
      try {
        const response = await api.get("/dados");
        const data = response.data;
        const formatado: DataPoint[] = data.map((item: any) => {
          const timestamp = new Date(item.data_hora).getTime();
          return {
            x: timestamp,
            y: Number(item.temperatura),
            data: item.data_hora,
          };
        });
        formatado.sort((a: DataPoint, b: DataPoint) => a.x - b.x);
        setDados(formatado);
      } catch (fallbackError) {
        console.error("Erro no fallback:", fallbackError);
      }
    }
  };

  // Última temperatura
  const lastTemp = dados.length > 0 ? dados[dados.length - 1].y : "--";

  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
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
                  <TouchableOpacity
                    onPress={openMenu}
                    style={styles.menuButton}
                  >
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
                onPress={() =>
                  aplicarFiltroPeriodo(item as "dia" | "semana" | "mês")
                }
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
          <TouchableOpacity
            style={[
              styles.navButton,
              !hasPreviousDay() && styles.navButtonDisabled,
            ]}
            onPress={goToPreviousDay}
            disabled={!hasPreviousDay()}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={!hasPreviousDay() ? colors.gray : colors.white}
            />
          </TouchableOpacity>

          <Text style={styles.dateText}>
            {currentDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          </Text>

          <TouchableOpacity
            style={[
              styles.navButton,
              !hasNextDay() && styles.navButtonDisabled,
            ]}
            onPress={goToNextDay}
            disabled={!hasNextDay()}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color={!hasNextDay() ? colors.gray : colors.white}
            />
          </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 16,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  navButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  dateText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default DataGraphicScreen;
