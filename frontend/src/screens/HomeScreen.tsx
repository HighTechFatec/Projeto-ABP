import React from "react";
import MenuOptions from "../components/MenuOptions";
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "../theme/colors";
import testIcon from "../assets/icon.png";

const Home: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flask-outline" size={28} color="#fff" /> 
        <Text style={styles.headerText}>Olá, User</Text>
        <TouchableOpacity onPress={() => navigation.navigate("MyAccount")}>
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
      
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }} style={{ maxHeight: 170 }}>
        <MenuOptions text="Amostra" image={testIcon} navigatesTo="Sample"/> 
        <MenuOptions text="Gráficos" image={testIcon} navigatesTo="Graphs"/>
        <MenuOptions text="Histórico" image={testIcon} navigatesTo="History"/>
        <MenuOptions text="Notificação" image={testIcon} navigatesTo="Notifications"/>
        <MenuOptions text="Minha conta" image={testIcon} navigatesTo="MyAccount"/>
      </ScrollView>

      <View style={styles.card}>
        <Image source={testIcon} style={styles.cardImage}/>
        <View style={{ paddingHorizontal: 10, paddingVertical: 17 }}>
          <Text style={{ color: colors.highlight, fontWeight: "bold", fontSize: 18 }}>Título</Text>
          <Text style={{ color: colors.white, marginBottom: 15 }}>Subtítulo</Text>
          <Text style={{ color: colors.white }}>Lorem Ipsum</Text>
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
