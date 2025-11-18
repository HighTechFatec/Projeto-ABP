import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../theme/colors";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, "Login">;

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
    const projectId = "0d1b4e17-8af1-4772-a82c-1b496f5b81a8";
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

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenProp>();
  const { width } = useWindowDimensions();

  const { signIn } = useAuth();

  // Estados para login e mensagens
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);

  const handleLogin = async () => {
  if (!usuario || !senha) {
    setMensagem("❌ Preencha usuário e senha!");
    return;
  }

  try {
    // Agora loggedUser tem { user, token }
    const loggedUser = await signIn(usuario, senha);

    console.log("🔍 Retorno do signIn:", loggedUser);

    const userId = loggedUser?.user?.id;
    console.log("🔍 ID do usuário recebido:", userId);

    if (!userId) {
      console.error("❌ userId está undefined. Não é possível salvar expo token.");
      return;
    }

    // Gera o Expo Push Token
    const token = await registerForPushNotificationsAsync();
    console.log("🔍 Expo push token gerado:", token);

    // ⛔ Se o token for undefined, NÃO manda para o backend
    if (!token) {
      console.error("❌ expo_push_token está undefined. Não enviando para o backend.");
      return;
    }

    // Enviar token push para o backend
    await api.post("/api/usuario/token", {
      id_usuario: userId,
      expo_push_token: token,
    });

    console.log("✅ Token salvo com sucesso no backend:", token);

    setMensagem("✅ Login realizado com sucesso!");

  } catch (error: any) {
    console.error("❌ Erro no login ou envio do token:", error);
    setMensagem("❌ " + (error.message || "Erro ao fazer login"));
  }
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: width < 400 ? 10 : 20,
    },
    logo: {
      width: width < 400 ? 80 : 100,
      height: width < 400 ? 80 : 100,
      marginBottom: width < 400 ? 15 : 20,
      resizeMode: "contain",
    },
    title: {
      fontSize: width < 400 ? 20 : 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: width < 400 ? 15 : 20,
    },
    input: {
      width: width < 400 ? "95%" : "90%",
      backgroundColor: colors.cardBackground,
      padding: width < 400 ? 10 : 12,
      borderRadius: 8,
      marginBottom: width < 400 ? 10 : 12,
      color: colors.text,
    },
    button: {
      width: width < 400 ? "95%" : "90%",
      backgroundColor: colors.primary,
      padding: width < 400 ? 12 : 15,
      borderRadius: 30,
      alignItems: "center",
      marginBottom: width < 400 ? 8 : 10,
    },
    buttonText: {
      color: colors.background,
      fontSize: width < 400 ? 16 : 18,
      fontWeight: "bold",
    },
    mensagem: {
      color: mensagem?.includes("Erro") ? "red" : "green",
      marginBottom: 10,
      fontSize: 16,
      fontWeight: "500",
      textAlign: "center",
    },
    link: {
      color: colors.primary,
      fontSize: width < 400 ? 14 : 16,
      paddingTop: width < 400 ? 8 : 10,
    },
    registerLink: {
      color: colors.primary,
      fontSize: width < 400 ? 14 : 16,
      paddingTop: width < 400 ? 10 : 15,
      marginBottom: width < 400 ? 8 : 10,
      textAlign: "center",
    },
    registerHighlight: {
      color: colors.primary,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <Image source={require("../assets/Logo_LabConnectSF.png")} style={styles.logo} />
      <Text style={styles.title}>LabConnect</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.text}
        value={usuario}
        onChangeText={setUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor={colors.text}
        value={senha}
        onChangeText={setSenha}
      />

      {/* Mensagem de login */}
      {mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}

      <TouchableOpacity onPress={handleLogin} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        activeOpacity={0.8}
      >
        <Text style={styles.registerLink}>
          Ainda não possui conta?{" "}
          <Text style={styles.registerHighlight}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            Alert.alert(
              "Sair do aplicativo",
              "Tem certeza que deseja sair?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Sair",
                  style: "destructive",
                  onPress: () => BackHandler.exitApp(),
                },
              ],
              { cancelable: true }
            );
          }
        }}
      >
        <Text style={styles.link}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
