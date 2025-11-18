import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface Amostra {
  id: number;
  nome: string;
  laboratorio: string;
  data_inicio: string;
  data_fim: string;
  temp_min: number;
  temp_max: number;
  unidade: string;
  id_usuario: number;
}

export default function HistoricoScreen() {
  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
   const { user } = useAuth(); 

  const fetchAmostras = async () => {
    try {
      setLoading(true);
      const response = await api.get("/amostras");
      setAmostras(response.data);
    } catch (error) {
      console.log("Erro ao buscar amostras:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAmostra = async (id: number) => {
    Alert.alert(
      "Excluir amostra",
      "Tem certeza que deseja excluir esta amostra?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/amostras/${id}`);
              await fetchAmostras();
            } catch (error) {
              console.log("Erro ao excluir amostra:", error);
            }
          },
        },
      ]
    );
  };

  // 🔹 Função para limpar todo o histórico
  const handleClearHistory = async () => {
    Alert.alert(
      "Limpar histórico",
      "Deseja realmente excluir todo o histórico de amostras?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, excluir tudo",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete("/amostras"); // Rota que deleta todas
              setAmostras([]);
              Alert.alert("Histórico excluído com sucesso!");
            } catch (error) {
              console.log("Erro ao limpar histórico:", error);
              Alert.alert("Erro", "Não foi possível limpar o histórico.");
            }
          },
        },
      ]
    );
  };

  // Recarrega quando a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      fetchAmostras();
    }, [])
  );

  // Filtrar amostras pelo texto de busca
  const filtered = amostras.filter((item) =>
    item.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
       {/* Cabeçalho com botão limpar */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="flask-outline" size={28} color="#DBD7DF" />
        </View>

        {/* 🧹 Botão limpar histórico */}
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearHistory}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.clearButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de pesquisa */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#DBD7DF" />
        <TextInput
          style={styles.input}
          placeholder="Buscar Histórico..."
          placeholderTextColor="#DBD7DF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Indicador de carregamento */}
      {loading ? (
        <ActivityIndicator size="large" color="#00EBC7" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardSubtitle}>
                Laboratório: {item.laboratorio}
              </Text>
              <Text style={styles.cardSubtitle}>
                Temp Min: {item.temp_min}°{item.unidade}
              </Text>
              <Text style={styles.cardSubtitle}>
                Temp Max: {item.temp_max}°{item.unidade}
              </Text>
              <Text style={styles.cardSubtitle}>
                Início: {new Date(item.data_inicio).toLocaleString()}
              </Text>
              <Text style={styles.cardSubtitle}>
                Fim: {new Date(item.data_fim).toLocaleString()}
              </Text>
              <TouchableOpacity
                                  style={styles.deleteButton}
                                  onPress={() => handleDeleteAmostra(item.id)}
                                >
                                  <Ionicons name="trash-outline" size={20} color="#fff" />
                                </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: "#DBD7DF", textAlign: "center", marginTop: 20 }}>
              Nenhuma amostra encontrada
            </Text>
          }
        />
      )}

      {/* Paginação */}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setPage(page > 1 ? page - 1 : 1)}
          style={styles.pageButton}
        >
          <Ionicons name="caret-up" size={24} color="#2CB67D" />
        </TouchableOpacity>

        <Text style={styles.pageText}>{page}</Text>

        <TouchableOpacity
          onPress={() => setPage(page + 1)}
          style={styles.pageButton}
        >
          <Ionicons name="caret-down" size={24} color="#2CB67D" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202123",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DBD7DF",
  },
   clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4C4C",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#343541",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: "#DBD7DF",
    padding: 8,
    marginLeft: 6,
  },
  card: {
    backgroundColor: "#343541",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  cardTitle: {
    color: "#2CB67D",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardSubtitle: {
    color: "#DBD7DF",
    marginTop: 5,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  pageButton: {
    marginHorizontal: 10,
  },
  pageText: {
    color: "#DBD7DF",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF4C4C",
    padding:4,
    borderRadius: 4,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});