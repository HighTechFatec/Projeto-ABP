import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";

// Importando telas
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import MyAccountScreen from "../screens/MyAccountScreen";
import DataGraphicScreen from "../screens/DataGraphicScreen";

// Definição dos tipos de rotas
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Sample: undefined;
  Graphs: undefined;
  History: undefined;
  Notifications: undefined;
  Account: undefined;
  MyAccount: undefined;
<<<<<<< HEAD
  DataGraphic: undefined;
=======
  App: undefined;
>>>>>>> 26c58476ec52de3588dea019944c5c68b975a646
};

// Stack principal (para login e registro)
const Stack = createNativeStackNavigator<RootStackParamList>();

// Drawer Navigator (para as telas internas)
const Drawer = createDrawerNavigator<RootStackParamList>();

// Drawer com as telas de navegação lateral
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true, // Mostra header com o ícone de 3 barrinhas
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="MyAccount" component={MyAccountScreen} />
      {/* Se quiser adicionar mais telas internas: */}
      {/* <Drawer.Screen name="History" component={HistoryScreen} /> */}
      {/* <Drawer.Screen name="Graphs" component={GraphsScreen} /> */}
    </Drawer.Navigator>
  );
}

// Navegação geral
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
        {/* Telas de autenticação */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
<<<<<<< HEAD
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MyAccount" component={MyAccountScreen} />
        <Stack.Screen name="Graphs" component={DataGraphicScreen} />
=======

        {/* Drawer dentro do Stack */}
        <Stack.Screen name="App" component={DrawerNavigator} />
>>>>>>> 26c58476ec52de3588dea019944c5c68b975a646
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
