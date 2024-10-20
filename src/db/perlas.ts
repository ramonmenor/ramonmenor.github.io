import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

// Configurar la URL y clave API de tu base de datos Turso
const TURSO_URL = process.env.DATABASE_URL;
const TURSO_API_KEY = process.env.DATABASE_TOKEN;

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_API_KEY,
});

// Función para obtener todas las perlas
export async function getPerlas() {
  const query = "SELECT * FROM perlas order by libro,capitulo,versiculos;";
  const result = await client.execute(query);
  return result.rows;
}

export async function verPerla(
  id: number,
  libro?: string,
  capitulo?: number,
  versiculos?: number
) {
  const query = "SELECT * FROM perlas WHERE id = ?";
  const result = await client.execute(query, [id]);
  console.log(result.rows);
  return result.rows[0];
}

export async function insertPerla(
  libro: string,
  capitulo: number,
  versiculos: number,
  perla: string
) {
  const query =
    "INSERT INTO perlas (libro,capitulo,versiculos,perla) VALUES (?, ?, ?, ?);";
  const result = await client.execute(query, [
    libro,
    capitulo,
    versiculos,
    perla,
  ]);
  return result;
}
