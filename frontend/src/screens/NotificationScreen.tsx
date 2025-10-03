import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationScreen() {
  const [input, setInput] = useState("");
  const [dateTime, setDateTime] = useState<string | null>(null);

  const handleClear = () => {
    setInput("");
    setDateTime(null);
  };

  return (
    <View style={styles.container}>
      {/* Campo de Input */}
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

      {/* Data Hora */}
      <View style={styles.box}>
        <Text style={styles.label}>
          Data Hora: {dateTime ? dateTime : ""}
        </Text>
      </View>

      {/* Botão limpar */}
      <TouchableOpacity onPress={handleClear}>
        <Text style={styles.clearText}>Limpar</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DBD7DF",
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
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    color: "#2CB67D",
    fontWeight: "bold",
  },
  clearText: {
    color: "#00EBC7",
    fontWeight: "bold",
    marginTop: 5,
  },
});
