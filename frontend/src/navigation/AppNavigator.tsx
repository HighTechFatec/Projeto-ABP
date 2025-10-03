import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import colors from "../theme/colors";
import "react-native-gesture-handler";

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
      <Drawer.Screen options={{title: "Minha conta"}} name="MyAccount" component={MyAccountScreen} />
      <Drawer.Screen options={{title: "Gráficos"}} name="Graphs" component={DataGraphicScreen} />
      <Drawer.Screen options={{title: "Amostra"}} name="Sample" component={SampleScreen} />
      <Drawer.Screen options={{title: "Notificações"}} name="Notifications" component={NotificationScreen} />
    </Drawer.Navigator>
  );
}

// Navegação geral
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MyAccount" component={MyAccountScreen} />
        <Stack.Screen name="Graphs" component={DataGraphicScreen} />
        <Stack.Screen name="NewSample" component={NewSampleScreen} />
        <Stack.Screen name="Sample" component={SampleScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="App" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
