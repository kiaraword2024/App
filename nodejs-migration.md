# Migración de App de Cuidado Familiar a Node.js

## Estructura del Proyecto
```
family-care-app/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── server/
│   └── server.js
│
├── package.json
└── README.md
```

## Pasos de Migración

### 1. Inicializar Proyecto
```bash
mkdir family-care-app
cd family-care-app
npm init -y
```

### 2. Separar HTML, CSS y JavaScript
- Crea carpeta `public`
- Mueve estilos a `public/styles.css`
- Mueve scripts a `public/app.js`
- Modifica `index.html` para enlazar archivos externos

### 3. Crear Servidor Node.js Básico
En `server/server.js`:
```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  // Ruta raíz
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, '../public/index.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error cargando página');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  }
  
  // Servir archivos estáticos
  else if (req.url.startsWith('/static/')) {
    const filePath = path.join(__dirname, '../public', req.url.replace('/static/', ''));
    const ext = path.extname(filePath);
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Archivo no encontrado');
      } else {
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
        res.end(content);
      }
    });
  }
  
  // API - Endpoints básicos
  else if (req.url === '/api/score' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const scoreData = JSON.parse(body);
        // Aquí podrías agregar lógica para guardar/procesar puntaje
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'Puntaje recibido', data: scoreData }));
      } catch (error) {
        res.writeHead(400);
        res.end('Datos inválidos');
      }
    });
  }
  
  else if (req.url === '/api/message' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const messageData = JSON.parse(body);
        // Aquí podrías agregar lógica para procesar mensaje
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'Mensaje recibido', data: messageData }));
      } catch (error) {
        res.writeHead(400);
        res.end('Datos inválidos');
      }
    });
  }
  
  // 404 para rutas no encontradas
  else {
    res.writeHead(404);
    res.end('Página no encontrada');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

### 4. Modificar `index.html`
```html
<!DOCTYPE html>
<html lang="es">
<head>
    ...
    <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
    ...
    <script src="/static/app.js"></script>
</body>
</html>
```

### 5. Modificar `app.js`
```javascript
// Reemplazar funciones para enviar datos a API
async function jugarMinijuego(jugador) {
    const puntosGanados = Math.floor(Math.random() * 10) + 1;
    try {
        const response = await fetch('/api/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jugador, puntos: puntosGanados })
        });
        const result = await response.json();
        console.log(result);
        actualizarPuntuacion();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function enviarMensaje() {
    const mensajeInput = document.getElementById('mensajeInput');
    const mensaje = mensajeInput.value;
    if (mensaje) {
        try {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje })
            });
            const result = await response.json();
            console.log(result);
            mensajeInput.value = '';
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
```

### 6. Archivo `package.json`
```json
{
  "name": "family-care-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node server/server.js"
  }
}
```

### Comandos Finales
```bash
npm start  # Iniciar servidor
```
