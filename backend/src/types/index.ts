export interface Usuario{
    id?:number;
    nome:string;
    email:string;
    senha:string;
    id_laboratorio:number;
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
export interface CreateUserRequest{
    nome:string;
    email:string;
    senha:string;
    id_laboratorio:number
}
export interface UpdateRequest{
    nome?:string;
    email?:string;
    senha?:string;
    id_laboratorio?:number;
}
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}