import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "../theme/colors";

type MenuOptionsProp = {image: any, text: string, navigatesTo: keyof RootStackParamList};

export default function MenuOptions(props: MenuOptionsProp) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
      <TouchableOpacity style={styles.container} onPress={() => navigation.navigate(props.navigatesTo)}>
        <Image source={props.image} style={styles.image} />
        <Text style={styles.text}>{props.text}</Text>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  text: {
    color: colors.highlight,
    marginTop: 5
  }
})