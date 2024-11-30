let eleccionAbuelo = "";
let eleccionNieto = "";
let scoreData = { abuelo: 0, nieto: 0 };
let jugadorActual = "";

function mostrarPantalla(id) {
  document
    .querySelectorAll(".screen")
    .forEach((screen) => screen.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function iniciarJuego(jugador) {
  jugadorActual = jugador;
  if (jugador === "abuelo") {
    mostrarPantalla("abueloScreen");
  } else {
    mostrarPantalla("nietoScreen");
  }
}

function elegirOpcion(jugador, opcion) {
  if (jugador === "abuelo") {
    eleccionAbuelo = opcion;
    // Cambiar al turno del nieto
    mostrarPantalla("nietoScreen");
  } else if (jugador === "nieto") {
    eleccionNieto = opcion;
    // Cambiar al turno del abuelo si este aún no ha jugado
    if (eleccionAbuelo === "") {
      mostrarPantalla("abueloScreen");
    } else {
      // Si ambos ya jugaron, mostrar el botón "Mostrar Ganador"
      mostrarPantalla("mostrarGanadorContainer");
    }
  }

  // Cuando ambos han jugado
  if (eleccionAbuelo !== "" && eleccionNieto !== "") {
    mostrarPantalla("mostrarGanadorContainer");
  }
}

function determinarGanador() {
  let resultado;
  if (eleccionAbuelo === eleccionNieto) {
    resultado = "¡Empate!";
  } else if (
    (eleccionAbuelo === "piedra" && eleccionNieto === "tijera") ||
    (eleccionAbuelo === "papel" && eleccionNieto === "piedra") ||
    (eleccionAbuelo === "tijera" && eleccionNieto === "papel")
  ) {
    resultado = "¡Gana el Abuelo!";
    scoreData.abuelo += 1;
  } else {
    resultado = "¡Gana el Nieto!";
    scoreData.nieto += 1;
  }

  document.getElementById("result").innerHTML = `
        Abuelo eligió: ${eleccionAbuelo}<br>
        Nieto eligió: ${eleccionNieto}<br>
        ${resultado}
      `;

  actualizarPuntuacion();
  mostrarPantalla("resultScreen");
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

  fetch("http://localhost:3000/api/score", {
    method: "POST",
    // mode: 'no-cors',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scoreData),
  })
    .then(async (res) => console.log(await res.text()))
    .catch((error) =>
      console.error("Error al actualizar puntuaciones:", error)
    );
}

function volverAlInicio() {
  eleccionAbuelo = "";
  eleccionNieto = "";
  mostrarPantalla("mainScreen");
}
