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
  telefone: string;
  id_laboratorio: number;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn(email: string, senha: string): Promise<any>;
  signOut(): Promise<void>;
  updateUser(data: Partial<User>): Promise<any>;
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

  async function updateUser(data: Partial<User>) {
    if (!user) return;

    try {
      const response = await api.put(`/api/usuario/${user.id}`, data);

      const updatedUser = response.data;

      await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      return updatedUser;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw new Error("Erro ao salvar alterações");
    }
  }

  async function signIn(email: string, senha: string) {
  try {
    const response = await api.post("/api/usuario/login", { email, senha });
    const { token, user } = response.data;

    await AsyncStorage.setItem("@token", token);
    await AsyncStorage.setItem("@user", JSON.stringify(user));

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    setToken(token);

    return { user, token }; // 🔥 AGORA RETORNA!
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
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut, updateUser }}>
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
