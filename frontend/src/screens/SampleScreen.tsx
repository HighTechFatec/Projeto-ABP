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
          {amostras.length > 0 ? (
            (() => {
              const ultimaAmostra = amostras[amostras.length - 1];
              return (
                <View key={ultimaAmostra.id} style={styles.cardAmostraGrande}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="flask-outline" size={50} color="#00EBC7" />
                    <View style={{ marginLeft: 15 }}>
                      <Text style={styles.cardTitleGrande}>{ultimaAmostra.nome}</Text>
                      <Text style={styles.cardSubtitleGrande}>
                        Laboratório: {ultimaAmostra.laboratorio}
                      </Text>
                      <Text style={styles.cardSubtitleGrande}>
                        Temp. Máx: {ultimaAmostra.temp_max}°{ultimaAmostra.unidade}
                      </Text>
                    </View>
                  </View>

                  {/* Botões de ação */}
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={styles.detailButton}
                      onPress={() => {
                        setSelectedAmostra(ultimaAmostra);
                        setShowModal(true);
                      }}
                    >
                      <Ionicons name="information-circle-outline" size={22} color="#202123" />
                      <Text style={styles.detailButtonText}>Exibir detalhes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButtonGrande}
                      onPress={() => handleDeleteAmostra(ultimaAmostra.id!)}
                    >
                      <Ionicons name="trash-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })()
          ) : (
            <Text style={{ color: "#DBD7DF", textAlign: "center", marginTop: 20 }}>
              Nenhuma amostra registrada.
            </Text>
          )}
        </ScrollView>
      )}

      {/* ✅ Modal mais bonito */}
      {showModal && selectedAmostra && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="flask-outline" size={50} color="#00EBC7" style={{ alignSelf: "center", marginBottom: 10 }} />
            <Text style={styles.modalTitle}>{selectedAmostra.nome}</Text>

            <View style={styles.infoBlock}>
              <Ionicons name="business-outline" size={18} color="#00EBC7" />
              <Text style={styles.modalItem}> {selectedAmostra.laboratorio}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Ionicons name="thermometer-outline" size={18} color="#00EBC7" />
              <Text style={styles.modalItem}> Temp. Min: {selectedAmostra.temp_min}°{selectedAmostra.unidade}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Ionicons name="thermometer" size={18} color="#00EBC7" />
              <Text style={styles.modalItem}> Temp. Máx: {selectedAmostra.temp_max}°{selectedAmostra.unidade}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Ionicons name="time-outline" size={18} color="#00EBC7" />
              <Text style={styles.modalItem}> Início: {new Date(selectedAmostra.data_inicio).toLocaleString()}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Ionicons name="hourglass-outline" size={18} color="#00EBC7" />
              <Text style={styles.modalItem}> Fim: {new Date(selectedAmostra.data_fim).toLocaleString()}</Text>
            </View>

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
        onPress={() => {
          if (amostras.length > 0) {
            const ultimaAmostra = amostras[amostras.length - 1];

            Alert.alert(
              "Nova amostra",
              "Deseja substituir a amostra atual ou criar uma nova?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Substituir atual",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await api.delete(`/amostras/${ultimaAmostra.id}`);
                      await fetchAmostras();
                      navigation.navigate("NewSample");
                    } catch (error) {
                      console.log("Erro ao substituir amostra:", error);
                    }
                  },
                },
                {
                  text: "Criar nova",
                  onPress: () => navigation.navigate("NewSample"),
                },
              ]
            );
          } else {
            navigation.navigate("NewSample");
          }
        }}
      >
        <Ionicons name="add-circle-outline" size={22} color="#202123" />
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
    fontSize: 17,
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
  cardAmostraGrande: {
    backgroundColor: "#2A2B32",
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },

  cardTitleGrande: {
    color: "#00EBC7",
    fontSize: 20,
    fontWeight: "bold",
  },

  cardSubtitleGrande: {
    color: "#DBD7DF",
    fontSize: 15,
  },

  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    alignItems: "center",
  },

  detailButton: {
    flexDirection: "row",
    backgroundColor: "#00EBC7",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
  },

  detailButtonText: {
    color: "#202123",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 6,
  },

  deleteButtonGrande: {
    backgroundColor: "#FF4C4C",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  infoBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },

});