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
import { useNavigation } from "@react-navigation/native";
import api from "../services/api";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  const [tempMax, setTempMax] = useState("");
  const [tempMin, setTempMin] = useState("");
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [idUsuario, setIdUsuario] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSave = async () => {
  if (!medicao.trim() || !laboratorio.trim()) {
    Alert.alert("Erro", "Preencha todos os campos obrigatórios");
    return;
  }

  if (!tempMin || !tempMax) {
    Alert.alert("Erro", "Preencha as temperaturas mínima e máxima");
    return;
  }

  if (dataFim < dataInicio) {
    Alert.alert("Erro", "A data fim não pode ser anterior à data início");
    return;
  }

  const tempMinNum = parseFloat(tempMin);
  const tempMaxNum = parseFloat(tempMax);
  
  if (tempMinNum >= tempMaxNum) {
    Alert.alert("Erro", "A temperatura mínima deve ser menor que a temperatura máxima");
    return;
  }

  try {
    const body = {
      nome: medicao.trim(),
      laboratorio: laboratorio.trim(),
      data_inicio: dataInicio.toISOString(), 
      data_fim: dataFim.toISOString(),    
      temp_min: tempMinNum,
      temp_max: tempMaxNum,
      unidade: "C", 
      id_usuario: idUsuario ? parseInt(idUsuario) : 0,
    };
    console.log("Payload amostra:", body);

    const response = await api.post("/amostras", body);
    console.log(response.data);

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

  const adjustTemperature = (current: string, increment: number) => {
    const value = current ? parseFloat(current) : 0;
    const newValue = value + increment;
    return newValue >= 0 ? newValue.toString() : "0";
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="flask-outline" size={32} color="#00EBC7" />
          <Text style={styles.headerText}>Nova Amostra</Text>
        </View>

        {/* Nome Medição */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>Nome da Medição</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Amostra Bac-16/09/25"
            placeholderTextColor="#8B8D9B"
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
            placeholderTextColor="#8B8D9B"
            value={laboratorio}
            onChangeText={setLaboratorio}
          />
        </View>

        {/* ID Usuário */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>ID Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1"
            placeholderTextColor="#8B8D9B"
            keyboardType="numeric"
            value={idUsuario}
            onChangeText={setIdUsuario}
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
            <Ionicons name="calendar-outline" size={20} color="#00EBC7" />
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
            <Ionicons name="calendar-outline" size={20} color="#00EBC7" />
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

        {/* Temperaturas em linha */}
        <View style={styles.temperaturesRow}>
          {/* Temperatura Mínima */}
          <View style={styles.tempBox}>
            <Text style={styles.label}>Temp. Mínima</Text>
            <View style={styles.tempControl}>
              <TouchableOpacity 
                style={styles.tempButton}
                onPress={() => setTempMin(adjustTemperature(tempMin, 1))}
              >
                <Ionicons name="add" size={20} color="#00EBC7" />
              </TouchableOpacity>

              <TextInput
                style={styles.tempInput}
                placeholder="0"
                placeholderTextColor="#8B8D9B"
                keyboardType="numeric"
                value={tempMin}
                onChangeText={setTempMin}
              />

              <TouchableOpacity 
                style={styles.tempButton}
                onPress={() => setTempMin(adjustTemperature(tempMin, -1))}
              >
                <Ionicons name="remove" size={20} color="#00EBC7" />
              </TouchableOpacity>
            </View>
            <Text style={styles.tempUnit}>°C</Text>
          </View>

          {/* Temperatura Máxima */}
          <View style={styles.tempBox}>
            <Text style={styles.label}>Temp. Máxima</Text>
            <View style={styles.tempControl}>
              <TouchableOpacity 
                style={styles.tempButton}
                onPress={() => setTempMax(adjustTemperature(tempMax, 1))}
              >
                <Ionicons name="add" size={20} color="#00EBC7" />
              </TouchableOpacity>

              <TextInput
                style={styles.tempInput}
                placeholder="0"
                placeholderTextColor="#8B8D9B"
                keyboardType="numeric"
                value={tempMax}
                onChangeText={setTempMax}
              />

              <TouchableOpacity 
                style={styles.tempButton}
                onPress={() => setTempMax(adjustTemperature(tempMax, -1))}
              >
                <Ionicons name="remove" size={20} color="#00EBC7" />
              </TouchableOpacity>
            </View>
            <Text style={styles.tempUnit}>°C</Text>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Salvar Amostra</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#202123",
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  headerText: {
    fontSize: 24,
    marginLeft: 12,
    fontWeight: "bold",
    color: "#00EBC7",
  },
  inputBox: {
    backgroundColor: "#2A2B32",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#343541",
  },
  label: {
    color: "#DBD7DF",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#343541",
    color: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#40414F",
  },
  dateTouchable: {
    flexDirection: 'row',
    backgroundColor: '#343541',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#40414F',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  temperaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  tempBox: {
    flex: 1,
    backgroundColor: "#2A2B32",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#343541",
    alignItems: 'center',
  },
  tempControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '100%',
    marginBottom: 8,
  },
  tempButton: {
    backgroundColor: "#343541",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#40414F',
  },
  tempInput: {
    backgroundColor: "#343541",
    color: "#00EBC7",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    width: 60,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#40414F',
  },
  tempUnit: {
    color: "#8B8D9B",
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#00EBC7",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#00EBC7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveText: {
    marginLeft: 8,
    fontWeight: "bold",
    color: "#202123",
    fontSize: 18,
  },
});