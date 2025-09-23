import React from "react";
import MenuOptions from "../components/MenuOptions";
import { View, Text, StyleSheet, Image, TextInput, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import splash from "../assets/splash-icon.png";

type HomeScreenProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flask-outline" size={28} color="#fff" /> 
        <Text style={styles.headerText}>User</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>  
      
      <View style={styles.search}>
        <Ionicons name="search" size={26} color="#fff" style={{position: "relative", top: 38, left: 10}} />
        <TextInput
          style={styles.input}
          placeholder="Pesquisar"
        />
      </View>
      
      <ScrollView style={{ flexDirection: "column" }} horizontal={true}>
        <MenuOptions text="Amostra" image={splash} navigatesTo="Sample"/> 
        <MenuOptions text="Gráficos" image={splash} navigatesTo="Graphs"/>
        <MenuOptions text="Histórico" image={splash} navigatesTo="History"/>
        <MenuOptions text="Notificação" image={splash} navigatesTo="Notifications"/>
        <MenuOptions text="Minha conta" image={splash} navigatesTo="Account"/>
      </ScrollView>

      <View style={styles.card}>
        <Image source={splash} style={{width: 120, height: 120, resizeMode: "contain"}}/>
        <Text>Título</Text>
        <Text>Subtítulo</Text>
        <Text>Lorem Ipsum</Text>
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
    marginBottom: 50
  },
  card: {
    width: "100%"
  }
});
