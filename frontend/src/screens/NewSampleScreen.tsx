import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import api from "../services/api";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";

function formatDate(date: Date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function AmostraCreateScreen() {
  const [medicao, setMedicao] = useState("");
  const [laboratorio, setLaboratorio] = useState("");
  const [tempMax, setTempMax] = useState(0);
  const [tempMin, setTempMin] = useState(0);
  const [unit, setUnit] = useState<"C" | "F" | "K">("C");
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [idUsuario, setIdUsuario] = useState(0);

  const api = axios.create({
  baseURL: "http://192.168.0.10:3011", // seu backend
});


  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSave = async () => {
  if (!medicao || !laboratorio) {
    Alert.alert("Erro", "Preencha todos os campos obrigatórios");
    return;
  }

  try {
    const body = {
      nome: medicao,
      laboratorio: laboratorio,
      data_inicio: new Date().toISOString(),
      data_fim: new Date().toISOString(),
      temp_min: tempMin,
      temp_max: tempMax,
      unidade: unit,
      id_usuario: idUsuario,
    };

    console.log("Payload amostra:", body);

const response = await api.post("/amostras", body);
    console.log("Resposta backend:", response.data);
    
    Alert.alert("Sucesso", "Amostra criada com sucesso!");
    navigation.goBack();

  } catch (error: any) {
    console.log("Erro completo:", error);
    console.log("Erro response.data:", error.response?.data);
    Alert.alert(
      "Erro",
      error.response?.data?.message || error.message || "Falha ao criar amostra"
    );
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="flask-outline" size={28} color="#DBD7DF" />
          <Text style={styles.headerText}>Nova Amostra</Text>
        </View>

        {/* Nome Medição */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>Nome da Medição</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Amostra Bac-16/09/25"
            placeholderTextColor="#DBD7DF"
            value={medicao}
            onChangeText={setMedicao}
          />
        </View>

        {/* Laboratório */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>Laboratório</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: LAB01"
            placeholderTextColor="#DBD7DF"
            value={laboratorio}
            onChangeText={setLaboratorio}
          />
        </View>

         {/* ID Usuário (campo editável) */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>ID Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1"
            placeholderTextColor="#DBD7DF"
            keyboardType="numeric"
            value={String(idUsuario)}
            onChangeText={(t) => setIdUsuario(Number(t) || 0)}
          />
        </View>

        {/* Data Início */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>Data Início</Text>
          <TouchableOpacity
            style={styles.dateTouchable}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(dataInicio)}</Text>
            <Ionicons name="calendar-outline" size={20} color="#DBD7DF" />
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={dataInicio}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              onChange={(_, selectedDate) => {
                setShowStartPicker(Platform.OS === "ios");
                if (selectedDate) setDataInicio(selectedDate);
              }}
            />
          )}
        </View>

        {/* Data Fim */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>Data Fim</Text>
          <TouchableOpacity
            style={styles.dateTouchable}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(dataFim)}</Text>
            <Ionicons name="calendar-outline" size={20} color="#DBD7DF" />
          </TouchableOpacity>

          {showEndPicker && (
            <DateTimePicker
              value={dataFim}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              onChange={(_event: any, selectedDate?: Date) => {
                setShowEndPicker(Platform.OS === "ios");
                if (selectedDate) setDataFim(selectedDate);
              }}
            />
          )}
        </View>

        {/* Temperatura Máxima */}
        <View style={styles.tempBox}>
          <Text style={styles.label}>Temp. Máx</Text>
          <View style={styles.tempControl}>
            <TouchableOpacity onPress={() => setTempMax(tempMax + 1)}>
              <Ionicons name="caret-up" size={28} color="#00EBC7" />
            </TouchableOpacity>

            <TextInput
              style={styles.tempInput}
              keyboardType="numeric"
              value={String(tempMax)}
              onChangeText={(t) => setTempMax(Number(t) || 0)}
            />

            <TouchableOpacity
              onPress={() => setTempMax(tempMax > 1 ? tempMax - 1 : 0)}
            >
              <Ionicons name="caret-down" size={28} color="#00EBC7" />
            </TouchableOpacity>

            <Picker
              selectedValue={unit}
              onValueChange={setUnit}
              style={styles.picker}
              dropdownIconColor="#00EBC7"
            >
              <Picker.Item label="°C" value="C" />
              <Picker.Item label="°F" value="F" />
              <Picker.Item label="K" value="K" />
            </Picker>
          </View>
        </View>

        {/* Temperatura Mínima */}
        <View style={styles.tempBox}>
          <Text style={styles.label}>Temp. Mín</Text>
          <View style={styles.tempControl}>
            <TouchableOpacity onPress={() => setTempMin(tempMin + 1)}>
              <Ionicons name="caret-up" size={28} color="#00EBC7" />
            </TouchableOpacity>

            <TextInput
              style={styles.tempInput}
              keyboardType="numeric"
              value={String(tempMin)}
              onChangeText={(t) => setTempMin(Number(t) || 0)}
            />

            <TouchableOpacity
              onPress={() => setTempMin(tempMin > 1 ? tempMin - 1 : 0)}
            >
              <Ionicons name="caret-down" size={28} color="#00EBC7" />
            </TouchableOpacity>

            <Picker
              selectedValue={unit}
              onValueChange={setUnit}
              style={styles.picker}
              dropdownIconColor="#00EBC7"
            >
              <Picker.Item label="°C" value="C" />
              <Picker.Item label="°F" value="F" />
              <Picker.Item label="K" value="K" />
            </Picker>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="save-outline" size={20} color="#202123" />
          <Text style={styles.saveText}>Salvar Amostra</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ----------------- Styles ------------------ */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#202123",
    padding: 20,
    paddingBottom: 40,
  },
  dateText: {
    color: "#DBD7DF",
    fontSize: 14,
  },
  dateTouchable: {
    flexDirection: 'row',
    backgroundColor: '#202123',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    marginLeft: 10,
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
    color: "#DBD7DF",
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#202123",
    color: "#DBD7DF",
    padding: 8,
    borderRadius: 4,
  },
  tempBox: {
    backgroundColor: "#343541",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  tempControl: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tempInput: {
    backgroundColor: "#202123",
    color: "#2CB67D",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    width: 60,
    padding: 5,
    borderRadius: 6,
  },
  picker: {
    width: 90,
    color: "#DBD7DF",
    backgroundColor: "#202123",
    borderRadius: 8,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#00EBC7",
    padding: 12,
    borderRadius: 30,
    justifyContent: "center",
    marginTop: 20,
  },
  saveText: {
    marginLeft: 6,
    fontWeight: "bold",
    color: "#202123",
    fontSize: 16,
  },
});