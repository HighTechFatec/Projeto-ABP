import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../theme/colors";
import api from "../services/api";

type RegisterScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenProp>();

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [laboratorio, setLaboratorio] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Função para validar senha
  const validarSenha = () => {
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return false;
    }
    return true;
  };

  // Função para enviar requisição ao backend
  const handleRegister = async () => {
    if (!nome || !laboratorio || !email || !senha) {
      Alert.alert("Erro", "Todos os campos obrigatórios devem ser preenchidos");
      return;
    }

    if (!validarSenha()) return;

    try {
      const response = await api.post("/api/usuario", {
        nome,
        email,
        senha,
        telefone,
        sigla_laboratorio: laboratorio,
      });

      console.log("Usuário cadastrado com sucesso:", response.data);

      Alert.alert("Sucesso", "Usuário criado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Alert.alert("Erro", error.response.data.message);
      } else {
        Alert.alert("Erro", "Não foi possível conectar ao servidor");
      }
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
          placeholder="Nome usuário"
          placeholderTextColor={colors.text}
          value={nome}
          onChangeText={setNome}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="Sigla do Laboratório"
          placeholderTextColor={colors.text}
          value={laboratorio}
          onChangeText={setLaboratorio}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="Celular"
          placeholderTextColor={colors.text}
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={colors.text}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={colors.text}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor={colors.text}
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          returnKeyType="done"
        />

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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
  link: {
    color: colors.primary,
    fontSize: 16,
    paddingTop: 10,
  },
});
