export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
}
export interface Usuario{
    id?:number;
    nome:string;
    email:string;
    senha:string;
    telefone:string;
    id_laboratorio:number;
    expo_push_token?:string;
}
export interface Laboratorio{
    id?:number;
    sigla:string;
    nome:string;
}
export interface dados_coletados{
    id?:number;
    temperatura:number;
    data_hora:Date;
}
export interface Avisos{
    id?:number;
    temp_min:number;
    temp_max:number;
    id_usuario:number
}
export interface CreateUserRequest{
    nome:string;
    email:string;
    senha:string;
    telefone:string;
    id_laboratorio?:number;
    sigla_laboratorio:string;
    expo_push_token?:string;
}
export interface UpdateRequest{
    nome?:string;
    email?:string;
    senha?:string;
    telefone?:string;
    id_laboratorio?:number;
    expo_push_token?:string;
}
export interface CreateAvisoRequest{
    temp_min:number;
    temp_max:number;
    id_usuario:number;
}
export interface UpdateAvisoRequest{
    temp_min?:number;
    temp_max?:number;
}
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export interface Amostra {
  id?: number;
  nome: string;
  data_inicio: Date;
  data_fim: Date;
  temp_min: number;
  temp_max: number;
  id_usuario: number;
}

export interface CreateAmostraRequest {
  nome: string;
  laboratorio: string;
  data_inicio: string;
  data_fim: string;
  temp_min: number;
  temp_max: number;
  unidade: "C" | "F" | "K";
  id_usuario: number;
}

export interface UpdateAmostraRequest {
  nome?: string;
  data_inicio?: Date;
  data_fim?: Date;
  temp_min?: number;
  temp_max?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}