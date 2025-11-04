import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import colors from "../theme/colors";
import { useAuth } from "../contexts/AuthContext";

const MyAccountScreen: React.FC = () => {
  const { updateUser, user } = useAuth();

  const [editable, setEditable] = useState(false);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lab, setLab] = useState("");

  // Carrega no início os dados do usuário logado
  useEffect(() => {
    if (user) {
      setUsername(user.nome || "");
      setPhone(user.telefone || "");
      setEmail(user.email || "");
      setLab(user.id_laboratorio?.toString() || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const data = {
        nome: username,
        email,
        telefone: phone,
        id_laboratorio: parseInt(lab),
      };

      await updateUser(data);

      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      setEditable(false);
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Não foi possível salvar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minha Conta</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={[styles.input, !editable && styles.disable]}
        value={username}
        onChangeText={setUsername}
        editable={editable}
      />

      <Text style={styles.label}>Celular</Text>
      <TextInput
        style={[styles.input, !editable && styles.disable]}
        value={phone}
        onChangeText={setPhone}
        editable={editable}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={[styles.input, !editable && styles.disable]}
        value={email}
        onChangeText={setEmail}
        editable={editable}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Laboratório</Text>
      <TextInput
        style={[styles.input, !editable && styles.disable]}
        value={lab}
        onChangeText={setLab}
        editable={editable}
        keyboardType="numeric"
      />

      {!editable ? (
        <TouchableOpacity onPress={() => setEditable(true)}>
          <Text style={styles.editLink}>Editar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      )}
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
    fontSize: 22,
    fontWeight: "bold",
    color: colors.highlight,
    marginBottom: 20,
  },
  label: {
    color: colors.highlight,
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#343541",
    color: "#fff",
  },
  disable: {
    opacity: 0.6
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  editLink: {
    color: colors.highlight,
    alignSelf: "flex-end",
    marginTop: 10,
    fontSize: 16
  },
});