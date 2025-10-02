import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Amostra {
  id: string;
  nome: string;
  ultimaLeitura: string;
}

export default function HistoricoScreen() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Mock de dados
  const amostras: Amostra[] = [
    { id: "1", nome: "Amostra Bac-16/09/25", ultimaLeitura: "26ºC" },
    { id: "2", nome: "Amostra Bac-15/09/25", ultimaLeitura: "28ºC" },
    { id: "3", nome: "Amostra Bac-14/09/25", ultimaLeitura: "27ºC" },
  ];

  // Filtrar pelo texto de busca
  const filtered = amostras.filter((item) =>
    item.nome.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Barra de pesquisa */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#DBD7DF" />
        <TextInput
          style={styles.input}
          placeholder="Buscar Histórico..."
          placeholderTextColor="#DBD7DF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Lista de Amostras */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text style={styles.cardSubtitle}>
              Última leitura: {item.ultimaLeitura}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#DBD7DF", textAlign: "center", marginTop: 20 }}>
            Nenhuma amostra encontrada
          </Text>
        }
      />

      {/* Paginação */}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setPage(page > 1 ? page - 1 : 1)}
          style={styles.pageButton}
        >
          <Ionicons name="caret-up" size={24} color="#2CB67D" />
        </TouchableOpacity>

        <Text style={styles.pageText}>{page}</Text>

        <TouchableOpacity
          onPress={() => setPage(page + 1)}
          style={styles.pageButton}
        >
          <Ionicons name="caret-down" size={24} color="#2CB67D" />
        </TouchableOpacity>
      </View>
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#343541",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: "#DBD7DF",
    padding: 8,
    marginLeft: 6,
  },
  card: {
    backgroundColor: "#343541",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  cardTitle: {
    color: "#2CB67D",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardSubtitle: {
    color: "#DBD7DF",
    marginTop: 5,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  pageButton: {
    marginHorizontal: 10,
  },
  pageText: {
    color: "#DBD7DF",
    fontSize: 16,
  },
});
