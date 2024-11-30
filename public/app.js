document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
    // Si la pestaña activa es clasificación, actualizamos los puntos
    if (tab.dataset.tab === "clasificacion") {
      actualizarPuntuacion(); // Llama a la función que sincroniza los puntos con el servidor
    }
  });
});
// Estado de la aplicación
let scoreData = { abuelo: 0, nieto: 0 };

async function jugarMinijuego(jugador) {
  try {
    // Enviar solicitud al servidor con el cuerpo basado en scoreData
    const response = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jugador,
        puntos: Math.floor(Math.random() * 10) + 1,
      }),
    });

    /* el formato json es global? */

    const result = await response.json();
    console.log(result);

    // Actualizar scoreData locales con la respuesta del servidor
    if (result.success) {
      scoreData[jugador] = result.puntos; // Actualiza los puntos del jugador
      actualizarPuntuacion(); // Actualiza la interfaz
    } else {
      console.error("Error al actualizar puntuación:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
function actualizarPuntuacion() {
  const puntosAbueloElem = document.getElementById("puntosAbuelo");
  const puntosNietoElem = document.getElementById("puntosNieto");

  if (puntosAbueloElem && puntosNietoElem) {
    puntosAbueloElem.textContent = scoreData.abuelo;
    puntosNietoElem.textContent = scoreData.nieto;
  } else {
    console.warn("Elementos de puntuación no están disponibles todavía.");
  }
}

// Función para enviar mensaje
async function enviarMensaje() {
  const mensajeInput = document.getElementById("mensajeInput");
  const mensaje = mensajeInput.value;
  if (mensaje) {
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje }),
      });
      const result = await response.json();
      console.log(result);
      mensajeInput.value = "";
      if (result.success) {
        alert("Mensaje enviado con éxito");
      } else {
        alert("Error al enviar el mensaje: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar el mensaje");
    }
  } else {
    alert("Por favor, escribe un mensaje antes de enviar.");
  }
}
