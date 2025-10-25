<<<<<<< HEAD
import React, {useState} from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, BackHandler, Alert, useWindowDimensions, ActivityIndicator } from "react-native";
=======
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
} from "react-native";
>>>>>>> 933a491996e4bc20a5d56b67da39935b11480934
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../theme/colors";
import { useAuth } from "../contexts/AuthContext";

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, "Login">;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenProp>();
<<<<<<< HEAD
  const { signIn, loading: authLoading } = useAuth();
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
     try {
      setLoading(true);
      await signIn(email, senha);
      Alert.alert("Sucesso", "Login realizado com sucesso!");
      navigation.replace("App");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao realizar login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };
=======
  const { width } = useWindowDimensions();
>>>>>>> 933a491996e4bc20a5d56b67da39935b11480934

  // Estados para login e mensagens
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);

  const handleLogin = () => {
    // Simulação de verificação simples
    if (usuario === "admin" && senha === "123") {
      setMensagem("✅ Usuário logado!");
      // Aqui você pode navegar para outra tela:
      setTimeout(() => navigation.navigate("App"), 1000);
    } else {
      setMensagem("❌ Erro ao fazer login. Verifique suas credenciais.");
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
      <Image source={require("../assets/favicon.png")} style={styles.logo} />
      <Text style={styles.title}>LabTemp IoT</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.text}
<<<<<<< HEAD
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
=======
        value={usuario}
        onChangeText={setUsuario}
>>>>>>> 933a491996e4bc20a5d56b67da39935b11480934
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor={colors.text}
<<<<<<< HEAD
        value="{senha}"
        onChangeText={setSenha}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={styles.button}
        activeOpacity={0.8}
        disabled={loading || authLoading}>
        {loading || authLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>
      {/* USAR ESSE CÓDIGO QUANDO TIVER O LOGIN DE TESTE PRONTO */}


      <TouchableOpacity onPress={() => navigation.navigate("App")} style={styles.button} activeOpacity={0.8}>
=======
        value={senha}
        onChangeText={setSenha}
      />

      {/* Mensagem de login */}
      {mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}

      <TouchableOpacity onPress={handleLogin} style={styles.button} activeOpacity={0.8}>
>>>>>>> 933a491996e4bc20a5d56b67da39935b11480934
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
