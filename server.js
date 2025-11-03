// server.js
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Obtener ruta absoluta (compatibilidad con módulos ES)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// Endpoint principal para pedidos
app.post("/pedido", (req, res) => {
  const { items, total } = req.body;

  // Crear mensaje de WhatsApp
  let mensaje = `🍽 *Nuevo Pedido - Gourmet Restaurant*\n\n`;
  items.forEach(item => {
    mensaje += `• ${item.nombre} x${item.cantidad} - $${item.precio}\n`;
  });
  mensaje += `\n💰 *Total:* $${total}\n\n📍Gracias por su pedido.`;

  const telefono = "56935621667"; // tu número con código de país
  const mensajeCodificado = encodeURIComponent(mensaje);
  const link = `https://wa.me/${telefono}?text=${mensajeCodificado}`;

  // Responder al cliente con el link
  res.json({ ok: true, link });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
});
