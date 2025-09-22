import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../theme/colors";

type MyAccountScreenProp = NativeStackNavigationProp<RootStackParamList, "MyAccount">;

const MyAccountScreen: React.FC = () => {
  const navigation = useNavigation<MyAccountScreenProp>();

  const [editable, setEditable] = useState(false);
  const [username, setUsername] = useState("User001");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lab, setLab] = useState("");

  const handleSave = () => {
    // Aqui você conecta ao backend para salvar no banco (Node + Postgres)
    console.log({ username, phone, email, lab });
    setEditable(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Olá {username}</Text>

      <TextInput
        style={styles.input}
        value={username}
        editable={editable}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Celular"
        placeholderTextColor={colors.text}
        value={phone}
        onChangeText={setPhone}
        editable={editable}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.text}
        value={email}
        onChangeText={setEmail}
        editable={editable}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Laboratório"
        placeholderTextColor={colors.text}
        value={lab}
        onChangeText={setLab}
        editable={editable}
      />

      <TouchableOpacity onPress={() => setEditable(true)}>
        <Text style={styles.editLink}>Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "limegreen",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#fff",
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: colors.background    ,
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: colors.primary,
    marginTop: 15,
    textAlign: "center",
  },
  editLink: {
    color: colors.highlight,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
});