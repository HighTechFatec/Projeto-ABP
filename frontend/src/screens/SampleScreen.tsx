import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import api from "../services/api";
import { useFocusEffect } from "@react-navigation/native";


interface Amostra {
  id?: number;
  nome: string;
  laboratorio: string;
  data_inicio: string;
  data_fim: string;
  temp_min: number;
  temp_max: number;
  unidade: string;
  id_usuario: number;
}

export default function AmostrasScreen({ navigation }: any) {
  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAmostra, setSelectedAmostra] = useState<Amostra | null>(null);
  const [showModal, setShowModal] = useState(false);


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


  useFocusEffect(
    React.useCallback(() => {
      fetchAmostras();
    }, [])
  );

  const filteredAmostras = amostras.filter((a) =>
    a.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#DBD7DF" />
        <TextInput
          placeholder="Buscar amostras..."
          placeholderTextColor="#DBD7DF"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00EBC7" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredAmostras.map((amostra) => (
            <View key={amostra.id} style={styles.cardAmostra}>
              <TouchableOpacity
                style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
                onPress={() => {
                  setSelectedAmostra(amostra);
                  setShowModal(true);
                }}
              >
                <Ionicons name="thermometer-outline" size={40} color="#00EBC7" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.cardTitle}>{amostra.nome}</Text>
                  <Text style={styles.cardSubtitle}>
                    Última leitura: {amostra.temp_max}°C
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 🔴 Botão de exclusão */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteAmostra(amostra.id!)}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ✅ Modal dentro do return */}
      {showModal && selectedAmostra && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedAmostra.nome}</Text>

            <Text style={styles.modalItem}>Laboratório: {selectedAmostra.laboratorio}</Text>
            <Text style={styles.modalItem}>Temp Min: {selectedAmostra.temp_min}°{selectedAmostra.unidade}</Text>
            <Text style={styles.modalItem}>Temp Max: {selectedAmostra.temp_max}°{selectedAmostra.unidade}</Text>
            <Text style={styles.modalItem}>Início: {new Date(selectedAmostra.data_inicio).toLocaleString()}</Text>
            <Text style={styles.modalItem}>Fim: {new Date(selectedAmostra.data_fim).toLocaleString()}</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={{ color: "#202123", fontWeight: "bold" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Botão Nova Amostra */}
      <TouchableOpacity
        style={styles.newSampleButton}
        onPress={() => navigation.navigate("NewSample")}
      >
        <Ionicons name="add-circle-outline" size={20} color="#202123" />
        <Text style={styles.newSampleText}>Nova amostra</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202123",
    padding: 15,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#343541",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    color: "#DBD7DF",
  },
  cardAmostra: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#343541",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: {
    color: "#2CB67D",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#DBD7DF",
    fontSize: 14,
  },
  newSampleButton: {
    flexDirection: "row",
    backgroundColor: "#00EBC7",
    padding: 12,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  newSampleText: {
    marginLeft: 6,
    color: "#202123",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  modalCard: {
    width: "85%",
    backgroundColor: "#343541",
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2CB67D",
    marginBottom: 10,
    textAlign: "center",
  },
  modalItem: {
    color: "#DBD7DF",
    fontSize: 14,
    marginBottom: 6,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#00EBC7",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButton: {
  backgroundColor: "#FF4C4C",
  padding: 8,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  marginLeft: 10,
},
});