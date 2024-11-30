const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
};

const SCORES_FILE = path.join(__dirname, "api", "score", "puntos.json");
let scoreData = { abuelo: 0, nieto: 0 };

// Función para guardar puntos
function guardarPuntos(scoreData) {
  try {
    fs.writeFileSync(SCORES_FILE, JSON.stringify(scoreData, null, 2), "utf-8");
    console.log("Ok escrito");
  } catch (error) {
    console.error("Error al guardar puntos:", error);
  }
}
// Función para leer puntos
function leerPuntos() {
  try {
    if (!fs.existsSync(SCORES_FILE)) {
      // Si el archivo no existe, inicializar con datos predeterminados
      guardarPuntos(scoreData);
    }
    const data = fs.readFileSync(SCORES_FILE, "utf-8");
    console.log("Ok leido");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer puntos:", error);
    return { abuelo: 0, nieto: 0 }; // Estado predeterminado en caso de error
  }
}

// Servidor HTTP
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile(
      path.join(__dirname, "../public/index.html"),
      (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end("Error cargando la página");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content);
        }
      }
    );
  } else if (req.url.startsWith("/static/")) {
    const filePath = path.join(
      __dirname,
      "../public",
      req.url.replace("/static/", "")
    );
    const ext = path.extname(filePath);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end("Archivo no encontrado");
      } else {
        res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "text/plain" });
        res.end(content);
      }
    });
  } else if (req.url === "/api/score" && req.method === "GET") {
    const ScoreData = leerPuntos();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        puntos: ScoreData,
      })
    );
  } else if (req.url === "/api/score" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const scoreData = JSON.parse(body);
        guardarPuntos(scoreData);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, puntos: scoreData }));
      } catch (error) {
        console.error("Error al procesar los datos:", error);
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      }
    });
  } else {
    res.writeHead(404);
    res.end("Página no encontrada");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
