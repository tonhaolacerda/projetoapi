// src/config/database.js
// Conexão com o MongoDB.
//
// MongoClient: objeto do driver oficial que representa a conexão com o servidor MongoDB.
// Ele mantém um pool de conexões internamente, por isso é criado UMA vez, na inicialização,
// e reutilizado por todas as requisições. Abrir uma conexão a cada requisição seria lento
// e desperdiçaria recursos do servidor.
//
// ObjectId: tipo de identificador que o MongoDB gera automaticamente para cada documento
// (campo `_id`). É um valor de 24 caracteres hexadecimais, como "65f1c2a9e4b0a1b2c3d4e5f6".
// Como ele não é um número sequencial, o service converte `_id` em `id` (string) antes de
// devolver os dados para a API.
import { MongoClient } from 'mongodb';

let client;
let db;

export async function conectar() {
  const uri = process.env.MONGODB_URI;
  const nomeDoBanco = process.env.MONGODB_DB_NAME;

  if (!uri || !nomeDoBanco) {
    throw new Error('Defina MONGODB_URI e MONGODB_DB_NAME no arquivo .env.');
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(nomeDoBanco);
  return db;
}

// Retorna o banco conectado. Os models usam esta função para acessar as coleções.
export function obterBanco() {
  return db;
}

export async function desconectar() {
  if (client) {
    await client.close();
  }
}