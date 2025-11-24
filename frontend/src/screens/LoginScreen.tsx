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
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../theme/colors";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import messaging from "@react-native-firebase/messaging";


type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, "Login">;

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
    setMensagem(" Preencha usuário e senha!");
    return;
  }

  try {
    const loggedUser = await signIn(usuario, senha);

    console.log("🔍 Retorno do signIn:", loggedUser);

    const userId = loggedUser?.user?.id;
    console.log("🔍 ID do usuário recebido:", userId);

    if (!userId) {
      console.error("❌ userId está undefined. Não é possível salvar FCM token.");
      return;
    }

    // 🔥 Gera o FCM Token
    const fcmToken = await getFcmToken();
    console.log("🔍 FCM Token gerado:", fcmToken);

    if (!fcmToken) {
      console.error("❌ fcmToken está undefined. Não enviando para o backend.");
      return;
    }

    // 📡 Enviar token push para o backend
    await api.post("/api/usuario/token", {
      id_usuario: userId,
      fcm_token: fcmToken,
    });

    console.log("✅ Token salvo com sucesso no backend:", fcmToken);

    setMensagem("✅ Login realizado com sucesso!");

  } catch (error: any) {
    console.error("❌ Erro no login ou envio do token:", error);
    setMensagem("❌ " + (error.message || "Erro ao fazer login"));
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require("../assets/Logo_LabConnectSF.png")} style={styles.logo} />
        <Text style={styles.title}>LabConnect</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={colors.text}
          value={usuario}
          onChangeText={setUsuario}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          placeholderTextColor={colors.text}
          value={senha}
          onChangeText={setSenha}
          returnKeyType="done"
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
  },
  input: {
    width: "90%",
    backgroundColor: colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: colors.text,
  },
  button: {
    width: "90%",
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "bold",
  },
  mensagem: {
    color: "red",
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  link: {
    color: colors.primary,
    fontSize: 16,
    paddingTop: 10,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 16,
    paddingTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  registerHighlight: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
