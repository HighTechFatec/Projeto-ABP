import React from "react";
import MenuOptions from "../components/MenuOptions";
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "../theme/colors";
import { useAuth } from "../contexts/AuthContext";

import thermometerIcon from "../assets/thermometer.png";
import graphIcon from "../assets/graph.png";
import historyIcon from "../assets/history.png";
import notificationIcon from "../assets/notification.png";
import userIcon from "../assets/user.png";
import cardIcon from "../assets/card.png";

const Home: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
   const { user } = useAuth(); 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flask-outline" size={28} color="#fff" /> 
<Text style={styles.headerText}>
            Olá <Text style={{ color: "#2CB67D" }}>{user?.nome || "Usuário"}</Text>
          </Text>        <TouchableOpacity onPress={() => navigation.navigate("MyAccount")}>
          <Ionicons name="person-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>  
      
      <View style={styles.search}>
        <Ionicons name="search-outline" size={20} color="#DBD7DF" />
        <TextInput
          style={styles.input}
          placeholder="Pesquisar"
          placeholderTextColor="#DBD7DF"
        />
      </View>
      
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }} style={{ maxHeight: 110 }}>
        <MenuOptions text="Amostra" image={thermometerIcon} navigatesTo="Sample"/> 
        <MenuOptions text="Gráficos" image={graphIcon} navigatesTo="Graphs"/>
        <MenuOptions text="Histórico" image={historyIcon} navigatesTo="History"/>
        <MenuOptions text="Notificação" image={notificationIcon} navigatesTo="Notifications"/>
        <MenuOptions text="Minha conta" image={userIcon} navigatesTo="MyAccount"/>
      </ScrollView>

      <View style={styles.card}>
        <Image source={cardIcon} style={styles.cardImage}/>
        <View style={{ paddingHorizontal: 15, paddingVertical: 17 }}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ color: colors.highlight, fontWeight: "bold", fontSize: 18, marginBottom: 15 }}>Temperatura:</Text>
            <Text style={{ color: colors.white, fontSize: 18, marginLeft: 10 }}>-- °C</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ color: colors.highlight, fontWeight: "bold", fontSize: 18, marginBottom: 15 }}>Laboratório:</Text>
            <Text style={{ color: colors.white, fontSize: 18, marginLeft: 10 }}>Lab-01</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 30,
    flex: 1
  },
  input: {
    marginLeft: 8,
    flex: 1,
    color: "#DBD7DF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.highlight
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#343541",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    marginTop: 40,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardImage: {
    height: 150,
    width: "100%", 
    resizeMode: "cover", 
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10 
  }
});
