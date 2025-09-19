import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3011;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de status
app.get("/status", (req, res) => {
  res.json({
    status: "ok",
    message: "Servidor rodando com sucesso 🚀",
    timestamp: new Date().toISOString(),
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});