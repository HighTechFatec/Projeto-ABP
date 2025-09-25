import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AmostrasScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Ionicons name="flask-outline" size={28} color="#DBD7DF" />
        <Text style={styles.headerText}>
          Olá <Text style={{ color: "#2CB67D" }}>user01</Text>
        </Text>
        <Ionicons name="person-circle-outline" size={28} color="#DBD7DF" />
      </View> 

      {/* Barra de busca */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#DBD7DF" />
        <TextInput
          placeholder="Buscar amostras..."
          placeholderTextColor="#DBD7DF"
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card de amostra */}
        <View style={styles.cardAmostra}>
          <Ionicons name="thermometer-outline" size={40} color="#00EBC7" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.cardTitle}>Amostra Bac-16/09/25</Text>
            <Text style={styles.cardSubtitle}>Última leitura: 26°C</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão Nova Amostra */}
      <TouchableOpacity
        style={styles.newSampleButton}
        onPress={() => navigation.navigate("NewSample")}
      >
        <Ionicons name="add-circle-outline" size={20} color="#202123" />
        <Text style={styles.newSampleText}>Nova amostra</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202123",
    padding: 15,
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#343541",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    color: "#DBD7DF",
  },
  cardAmostra: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#343541",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: {
    color: "#2CB67D",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#DBD7DF",
    fontSize: 14,
  },
  cardNotificacao: {
    backgroundColor: "#343541",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    backgroundColor: "#202123",
  },
  cardNotificacaoTitle: {
    color: "#2CB67D",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardNotificacaoSubtitle: {
    color: "#DBD7DF",
    fontSize: 14,
    marginBottom: 5,
  },
  cardNotificacaoText: {
    color: "#DBD7DF",
    fontSize: 13,
  },
  newSampleButton: {
    flexDirection: "row",
    backgroundColor: "#00EBC7",
    padding: 12,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  newSampleText: {
    marginLeft: 6,
    color: "#202123",
    fontWeight: "bold",
    fontSize: 16,
  },
});
