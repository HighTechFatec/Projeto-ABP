import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useAuth } from "../contexts/AuthContext";
import colors from "../theme/colors";
import "react-native-gesture-handler";
import { Alert, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

// Importando telas
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import MyAccountScreen from "../screens/MyAccountScreen";
import DataGraphicScreen from "../screens/DataGraphicScreen";
import SampleScreen from "../screens/SampleScreen";
import NotificationScreen from "../screens/NotificationScreen";
import NewSampleScreen from "../screens/NewSampleScreen";
import HistoricoScreen from "../screens/HistoryScreen";
import { ActivityIndicator } from "react-native-paper";

// Definição dos tipos de rotas
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Sample: undefined;
  NewSample: undefined;
  Graphs: undefined;
  History: undefined;
  Notifications: undefined;
  Account: undefined;
  MyAccount: undefined;
  DataGraphic: undefined;
  App: undefined;
};

//configuração dos navegadores
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const {signOut} = useAuth();
  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
       {/* 🔹 Botão estilizado de Logout */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color={colors.white} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

// Drawer com as telas de navegação lateral
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />} // ⬅️ adiciona o botão aqui
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.cardBackground,
          borderBottomWidth: 0,
        },
        headerTintColor: colors.white,
        drawerStyle: {
          backgroundColor: colors.cardBackground,
          width: "60%",
          height: "50%"
        },
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: colors.black,
        drawerInactiveTintColor: colors.white
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen options={{title: "Amostra"}} name="Sample" component={SampleScreen} />
      <Drawer.Screen options={{title: "Gráficos"}} name="Graphs" component={DataGraphicScreen} />
      <Drawer.Screen options={{title: "Notificações"}} name="Notifications" component={NotificationScreen} />
      <Drawer.Screen options={{title: "Histórico"}} name="History" component={HistoricoScreen} />
      <Drawer.Screen options={{title: "Minha conta"}} name="MyAccount" component={MyAccountScreen} />
    </Drawer.Navigator>
  );
}

//stack de autenticação antes do login
function AuthStack() {
  return(
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Navegação geral
const AppNavigator: React.FC = () => {
  const {user, loading} = useAuth()
  if (loading){
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size = "large" color={colors.primary} />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {user ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // pode trocar pela cor do tema
  },
});
