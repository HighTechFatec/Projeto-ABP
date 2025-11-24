import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import messaging from "@react-native-firebase/messaging";
import userId from "./LoginScreen"; // ⚠️ precisa criar esse contexto para pegar o ID do usuário logado


// Interface dos avisos
interface Aviso {
  id: number;
  temp_min: number;
  temp_max: number;
  id_usuario: number;
  created_at?: string;
}

// Função para registrar e obter o token
async function getFcmToken() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.log("🔒 Permissão negada.");
    return null;
  }

  const token = await messaging().getToken();
  console.log("🔥 FCM Token:", token);
  return token;
}

export default function NotificationScreen() {
  const [input, setInput] = useState("");
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [filteredAvisos, setFilteredAvisos] = useState<Aviso[]>([]);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false); // 🆕 estado para reload


  const API_URL = "https://projeto-abp.onrender.com/avisos";

  // 🔹 Buscar todos os avisos
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

const setupPushNotifications = async () => {
  try {
    const token = await getFcmToken(); // Agora FCM token real

    if (token) {
      console.log("🔥 FCM Token obtido:", token);

      // Enviar token para o backend
      await fetch("https://projeto-abp.onrender.com/api/usuario/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,   // ⚠️ precisa vir do contexto do usuário logado
          fcm_token: token,     // 🔥 substituindo expo_push_token
        }),
      });

      console.log("✅ Token FCM enviado ao servidor com sucesso!");
    }
  } catch (error) {
    console.error("❌ Erro ao registrar notificações:", error);
  }
};

// 🔄 Executa ao abrir a tela
useEffect(() => {
  setupPushNotifications();
  fetchAvisos();
}, []);

  // 🔍 Filtra conforme o usuário digita
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

  // 🧹 Limpa filtro
  const handleClear = () => {
    setInput("");
    setFilteredAvisos(avisos);
  };

  // 🆕 Função que recarrega ao puxar para baixo
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAvisos();
    setRefreshing(false);
  };
  
  return (
    <View style={styles.container}>
      {/* Campo de busca */}
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

      {/* Lista de avisos com pull-to-refresh */}
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
        refreshing={refreshing}      // 🆕 indica o estado de atualização
        onRefresh={handleRefresh}    // 🆕 função chamada ao puxar para baixo
      />

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