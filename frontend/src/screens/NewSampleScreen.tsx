import React, { useState } from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "../theme/colors";

export default function NewSampleScreen() {
  const [medicao, setMedicao] = useState("");
  const [laboratorio, setLaboratorio] = useState("");
  const [tempMax, setTempMax] = useState(0);
  const [tempMin, setTempMin] = useState(0);
  const [unit, setUnit] = useState<"C" | "F" | "K">("C");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Ionicons name="flask-outline" size={28} color="#DBD7DF" />
        <Text style={styles.headerText}>
          Nova amostra
        </Text>
      </View>

      {/* Campo Nome Medição */}
      <View style={styles.inputBox}>
        <Text style={styles.label}>Nome Medição:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome"
          placeholderTextColor="#DBD7DF"
          value={medicao}
          onChangeText={setMedicao}
        />
      </View>

      {/* Campo Laboratório */}
      <View style={styles.inputBox}>
        <Text style={styles.label}>Laboratório:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o laboratório"
          placeholderTextColor="#DBD7DF"
          value={laboratorio}
          onChangeText={setLaboratorio}
        />
      </View>

      {/* Temperatura Máxima */}
      <View style={styles.tempBox}>
        <Text style={styles.label}>Temp. Max</Text>
        <View style={styles.tempControl}>
          <TouchableOpacity onPress={() => setTempMax(tempMax + 10)}>
            <Ionicons name="caret-up" size={28} color="#00EBC7" />
          </TouchableOpacity>

          <TextInput
            style={styles.tempInput}
            keyboardType="numeric"
            value={String(tempMax)}
            onChangeText={(text) => setTempMax(Number(text) || 0)}
          />

          <TouchableOpacity
            onPress={() => setTempMax(tempMax > 10 ? tempMax - 10 : 0)}
          >
            <Ionicons name="caret-down" size={28} color="#00EBC7" />
          </TouchableOpacity>

          {/* Seletor de unidade */}
          <Picker
            selectedValue={unit}
            onValueChange={(itemValue) => setUnit(itemValue)}
            style={styles.picker}
            dropdownIconColor="#00EBC7"
          >
            <Picker.Item label="Celsius" value="C" />
            <Picker.Item label="Fahrenheit" value="F" />
            <Picker.Item label="Kelvin" value="K" />
          </Picker>
        </View>
      </View>

      {/* Temperatura Mínima */}
      <View style={styles.tempBox}>
        <Text style={styles.label}>Temp. Min</Text>
        <View style={styles.tempControl}>
          <TouchableOpacity onPress={() => setTempMin(tempMin + 10)}>
            <Ionicons name="caret-up" size={28} color="#00EBC7" />
          </TouchableOpacity>

          <TextInput
            style={styles.tempInput}
            keyboardType="numeric"
            value={String(tempMin)}
            onChangeText={(text) => setTempMin(Number(text) || 0)}
          />

          <TouchableOpacity
            onPress={() => setTempMin(tempMin > 10 ? tempMin - 10 : 0)}
          >
            <Ionicons name="caret-down" size={28} color="#00EBC7" />
          </TouchableOpacity>

          {/* mesmo seletor de unidade */}
          <Picker
            selectedValue={unit}
            onValueChange={(itemValue) => setUnit(itemValue)}
            style={styles.picker}
            dropdownIconColor="#00EBC7"
          >
            <Picker.Item label="Celsius" value="C" />
            <Picker.Item label="Fahrenheit" value="F" />
            <Picker.Item label="Kelvin" value="K" />
          </Picker>
        </View>
      </View>

      {/* Botão Salvar Amostra */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          console.log("Amostra salva:", {medicao, laboratorio, tempMax, tempMin, unit,});
        }}
      >
        <Ionicons name="save-outline" size={20} color="#202123" />
        <Text style={styles.saveText}>Salvar amostra</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>Voltar</Text>
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
    position: "absolute",
    left: "35%",
    fontWeight: "bold",
    color: "#DBD7DF",
  },
  inputBox: {
    backgroundColor: "#343541",
    borderRadius: 6,
    marginBottom: 15,
    padding: 10,
  },
  label: {
    fontSize: 14,
    color: "#DBD7DF",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#202123",
    color: "#DBD7DF",
    padding: 8,
    borderRadius: 4,
  },
  tempInput: {
    backgroundColor: "#202123",
    color: "#2CB67D",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    width: 60,
    borderRadius: 6,
    padding: 5,
  },
  tempBox: {
    backgroundColor: "#343541",
    borderRadius: 6,
    marginBottom: 15,
    padding: 10,
  },
  tempControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tempValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2CB67D",
  },
  picker: {
    width: 90,
    color: "#DBD7DF",
    backgroundColor: "#202123",
    marginLeft: 10,
    borderColor: "transparent",
    borderRadius: 9,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#00EBC7",
    padding: 12,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    marginLeft: 6,
    color: "#202123",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    paddingTop: 20,
    color: colors.primary,
    alignSelf: "center"
  }
});
