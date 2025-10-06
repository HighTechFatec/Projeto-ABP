import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, BackHandler, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../theme/colors";

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, "Login">;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenProp>();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/favicon.png")} style={styles.logo} />
      <Text style={styles.title}>LabTemp IoT</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome usuário"
        placeholderTextColor={colors.text}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor={colors.text}
      />

      <TouchableOpacity onPress={() => navigation.navigate("App")} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Entrar</Text>
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
    paddingTop: 10
  },
});
