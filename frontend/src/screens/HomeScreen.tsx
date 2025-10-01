import React from "react";
import MenuOptions from "../components/MenuOptions";
import { View, Text, StyleSheet, Image, TextInput, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import testIcon from "../assets/icon.png";

type HomeScreenProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flask-outline" size={28} color="#fff" /> 
        <Text style={styles.headerText}>Olá, User</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>  
      
      <View style={styles.search}>
        <Ionicons name="search" size={26} color="#fff" style={{position: "absolute", top: 11, left: 10}} />
        <TextInput
          style={styles.input}
          placeholder="Pesquisar"
        />
      </View>
      
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }} style={{ display: "contents" }}>
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
    height: "100%",
    width: "100%"
  },
  input: {
    height: 50,
    paddingLeft: 45,
    borderRadius: 3,
    borderColor: colors.white,
    borderWidth: 1,
    color: colors.white
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
    marginBottom: 50,
    position: "relative"
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
