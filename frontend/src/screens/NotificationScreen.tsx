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

// Interface dos avisos
interface Aviso {
  id: number;
  temp_min: number;
  temp_max: number;
  id_usuario: number;
  created_at?: string;
}

// Função para registrar e obter o token
async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permissão negada", "Ative as notificações para receber alertas.");
      return;
    }

    // ⚠️ Altere para o seu ID do projeto Expo (veja no app.json)
    const projectId = "seu-project-id-no-expo";
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log("Expo Push Token:", token);
  } else {
    Alert.alert("Aviso", "Notificações só funcionam em dispositivos físicos.");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

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

  // 🔹 Registrar notificações push e salvar token no backend
  const setupPushNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);

        // Aqui você envia o token para o backend
        await fetch("https://projeto-abp.onrender.com/api/usuario/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: 1, // ⚠️ Substitua pelo ID real do usuário logado
            expo_push_token: token,
          }),
        });
        console.log("Token enviado para o servidor com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao registrar notificações:", error);
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