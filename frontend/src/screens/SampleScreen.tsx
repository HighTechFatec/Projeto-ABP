import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import api from "../services/api";

interface Amostra {
  id: number;
  nome: string;
  temp_max: number;
  temp_min: number;
  data_inicio: string;
  data_fim: string;
}

export default function AmostrasScreen({ navigation }: any) {
  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    fetchAmostras();
  }, []);

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
              <Ionicons name="thermometer-outline" size={40} color="#00EBC7" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.cardTitle}>{amostra.nome}</Text>
                <Text style={styles.cardSubtitle}>
                  Última leitura: {amostra.temp_max}°C
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
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
});