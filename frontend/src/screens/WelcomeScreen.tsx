import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../theme/colors";

type WelcomeScreenProp = NativeStackNavigationProp<RootStackParamList, "Welcome">;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenProp>();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/Logo_LabConnect_Alternativo.png")} style={styles.logo} />

      <Text style={styles.title}>LabTemp IoT</Text>

      <Text style={styles.subtitle}>
        Monitoramento seguro para {"\n"}
        <Text style={styles.highlight}>experimentos confiáveis.</Text>
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Cadastrar</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={() => navigation.navigate("MyAccount")}>
        <Text style={styles.link}>Minha Conta</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: colors.text,
    marginBottom: 30,
  },
  highlight: {
    color: colors.highlight,
    fontWeight: "600",
  },
  button: {
    width: "80%",
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
  },
});
