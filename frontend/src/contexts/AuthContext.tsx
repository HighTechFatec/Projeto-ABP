import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn(email: string, senha: string): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storagedUser = await AsyncStorage.getItem("@user");
        const storagedToken = await AsyncStorage.getItem("@token");

        if (storagedUser && storagedToken) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storagedToken}`;
          setUser(JSON.parse(storagedUser));
          setToken(storagedToken);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  async function signIn(email: string, senha: string) {
    try {
      const response = await api.post("/login", { email, senha });
      const { token, user } = response.data;

      await AsyncStorage.setItem("@token", token);
      await AsyncStorage.setItem("@user", JSON.stringify(user));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      setToken(token);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("E-mail ou senha inválidos");
    }
  }

  async function signOut() {
    await AsyncStorage.multiRemove(["@user", "@token"]);
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
  }
  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
