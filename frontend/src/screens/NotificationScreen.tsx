import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 🧠 Definição da interface (mantém tipagem limpa)
interface Aviso {
  id: number;
  temp_min: number;
  temp_max: number;
  id_usuario: number;
  created_at?: string; // caso exista no banco
}

export default function NotificationScreen() {
  const [input, setInput] = useState("");
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [filteredAvisos, setFilteredAvisos] = useState<Aviso[]>([]);

  // 🛰️ IP local da sua máquina (substitua localhost se for emulador/celular físico)
  const API_URL = "https://projeto-abp.onrender.com/avisos"; // altere para seu IP real

  // 🔹 Buscar todos os avisos do backend
  const fetchAvisos = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Erro ao buscar avisos");
      }
      const data = await response.json();
      setAvisos(data);
      setFilteredAvisos(data);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Falha ao buscar avisos do servidor.");
    }
  };

  // 🔄 Atualiza os avisos a cada vez que a tela é aberta
  useEffect(() => {
    fetchAvisos();
  }, []);

  // 🔍 Filtrar resultados conforme o usuário digita
  useEffect(() => {
    if (input.trim() === "") {
      setFilteredAvisos(avisos);
    } else {
      const lower = input.toLowerCase();
      const filtered = avisos.filter(
        (item) =>
          item.temp_min.toString().includes(lower) ||
          item.temp_max.toString().includes(lower) ||
          item.id_usuario.toString().includes(lower)
      );
      setFilteredAvisos(filtered);
    }
  }, [input, avisos]);

  // 🧹 Limpar filtro
  const handleClear = () => {
    setInput("");
    setFilteredAvisos(avisos);
  };

  return (
    <View style={styles.container}>
      {/* 🔎 Campo de busca */}
      <View style={styles.inputContainer}>
        <Ionicons name="search-outline" size={20} color="#DBD7DF" />
        <TextInput
          style={styles.input}
          placeholder="Buscar Notificações..."
          placeholderTextColor="#DBD7DF"
          value={input}
          onChangeText={setInput}
        />
      </View>

      {/* 📜 Lista de avisos */}
      <FlatList
        data={filteredAvisos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.box}>
            <Text style={styles.label}>⚠️ Alerta de Temperatura</Text>
            <Text style={styles.text}>Temp. Mínima: {item.temp_min}°C</Text>
            <Text style={styles.text}>Temp. Máxima: {item.temp_max}°C</Text>
            <Text style={styles.text}>Usuário ID: {item.id_usuario}</Text>
            {item.created_at && (
              <Text style={styles.time}>
                Data/Hora: {new Date(item.created_at).toLocaleString()}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum aviso encontrado.</Text>
        }
      />

      {/* 🧹 Botão limpar */}
      <TouchableOpacity onPress={handleClear}>
        <Text style={styles.clearText}>Limpar Busca</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202123",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#343541",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: "#DBD7DF",
    marginLeft: 8,
  },
  box: {
    backgroundColor: "#343541",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  label: {
    color: "#2CB67D",
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    color: "#DBD7DF",
    marginBottom: 2,
  },
  time: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
  clearText: {
    color: "#00EBC7",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
});