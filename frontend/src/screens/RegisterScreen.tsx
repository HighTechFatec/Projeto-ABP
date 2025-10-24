import React, { useState } from "react";
import {View,Text,TextInput,StyleSheet,TouchableOpacity,Image,Alert,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../theme/colors";

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
    const response = await fetch("http://localhost:3000/api/usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        email,
        senha,
        telefone,
        sigla_laboratorio: laboratorio, // envia a sigla
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Erro", data.message || "Erro ao criar usuário");
      return;
    }

    Alert.alert("Sucesso", "Usuário criado com sucesso!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Não foi possível conectar ao servidor");
  }
};


  return (
    <View style={styles.container}>
      <Image source={require("../assets/favicon.png")} style={styles.logo} />
      <Text style={styles.title}>LabTemp IoT</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome usuário"
        placeholderTextColor={colors.text}
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Laboratório"
        placeholderTextColor={colors.text}
        keyboardType="numeric"
        value={laboratorio}
        onChangeText={setLaboratorio}
      />
      <TextInput
        style={styles.input}
        placeholder="Celular"
        placeholderTextColor={colors.text}
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.text}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={colors.text}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        placeholderTextColor={colors.text}
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
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
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
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
