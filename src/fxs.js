import { casillas, tarjetas as Tarjetas } from "./data";
import { addClass, hasClass, removeClass } from "./utils";
import { chronoStart, chronoStop } from "./chrono";

const posicionesFichas = [0, 0, 0, 0];
let backupTarjetas = [];
let tarjetas = [...Tarjetas];

let turno;
let tj;
let equipos;
let tamanioCasilla;
let tablero;
let configuracion;
let blinkTimer;
let blinkTJMTimer;
let blinkTarjetaTimer;
let centerX;
let centerY;

const viewportWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const borrarDados = () => {
  let i = 1;
  while (document.getElementById("dado" + i)) {
    document
      .getElementById("dado" + i)
      .parentNode.removeChild(document.getElementById("dado" + i));
    i++;
  }
};
const blinkTarjeta = categoria => {
  if (blinkTarjetaTimer) {
    clearTimeout(blinkTarjetaTimer);
  }
  if (
    hasClass(document.getElementById("tarj" + categoria + "tableTR"), "blink")
  )
    removeClass(
      document.getElementById("tarj" + categoria + "tableTR"),
      "blink"
    );
  else
    addClass(document.getElementById("tarj" + categoria + "tableTR"), "blink");
  blinkTarjetaTimer = setTimeout(
    () => blinkTarjeta(categoria),
    !hasClass(document.getElementById("tarj" + categoria + "tableTR"), "blink")
      ? 300
      : 300
  );
};
const stopBlinkTarjeta = () => {
  if (blinkTarjetaTimer) {
    clearTimeout(blinkTarjetaTimer);
  }
  removeClass(document.getElementById("tarjPtableTR"), "blink");
  removeClass(document.getElementById("tarjOtableTR"), "blink");
  removeClass(document.getElementById("tarjAtableTR"), "blink");
  removeClass(document.getElementById("tarjDtableTR"), "blink");
  removeClass(document.getElementById("tarjTtableTR"), "blink");
};
const blinkFicha = equipo => {
  if (blinkTimer) {
    clearTimeout(blinkTimer);
  }
  document.getElementById("ficha" + equipo).style.display =
    document.getElementById("ficha" + equipo).style.display === ""
      ? "none"
      : "";
  blinkTimer = setTimeout(
    () => blinkFicha(equipo),
    document.getElementById("ficha" + equipo).style.display === "" ? 1000 : 300
  );
};
const stopBlinkFicha = () => {
  if (blinkTimer) {
    clearTimeout(blinkTimer);
  }
  for (let i = 1; i <= equipos; i++)
    document.getElementById("ficha" + i).style.display = "";
};
const blinkTodosJueganMsg = () => {
  if (blinkTJMTimer) {
    clearTimeout(blinkTJMTimer);
  }
  document.getElementById("todosJueganMsg").style.display =
    document.getElementById("todosJueganMsg").style.display === ""
      ? "none"
      : "";
  blinkTJMTimer = setTimeout(
    blinkTodosJueganMsg,
    document.getElementById("todosJueganMsg").style.display === "" ? 1000 : 300
  );
};
const stopBlinkTodosJueganMsg = () => {
  if (blinkTJMTimer) {
    clearTimeout(blinkTJMTimer);
  }
  document.getElementById("todosJueganMsg").style.display = "none";
};

window.sacarTarjeta = () => {
  borrarDados();
  let rand_no = Math.random();
  rand_no = rand_no * tarjetas.length;
  rand_no = Math.ceil(rand_no) - 1;
  removeClass(document.getElementById("tarjPtable"), "aDibujar");
  removeClass(document.getElementById("tarjOtable"), "aDibujar");
  removeClass(document.getElementById("tarjAtable"), "aDibujar");
  removeClass(document.getElementById("tarjDtable"), "aDibujar");
  removeClass(document.getElementById("tarjTtable"), "aDibujar");
  stopBlinkTarjeta();
  addClass(
    document.getElementById(
      "tarj" +
        casillas[posicionesFichas[turno - 1]]["t"].toUpperCase() +
        "table"
    ),
    "aDibujar"
  );
  blinkTarjeta(casillas[posicionesFichas[turno - 1]]["t"].toUpperCase());
  document.getElementById("tarjP").innerHTML =
    (tarjetas[rand_no]["p"]["tp"] === "S" ? "<span>&#8226;</span> " : "") +
    tarjetas[rand_no]["p"]["p"];
  document.getElementById("tarjO").innerHTML =
    (tarjetas[rand_no]["o"]["tp"] === "S" ? "<span>&#8226;</span> " : "") +
    tarjetas[rand_no]["o"]["p"];
  document.getElementById("tarjA").innerHTML =
    (tarjetas[rand_no]["a"]["tp"] === "S" ? "<span>&#8226;</span> " : "") +
    tarjetas[rand_no]["a"]["p"];
  document.getElementById("tarjD").innerHTML =
    (tarjetas[rand_no]["d"]["tp"] === "S" ? "<span>&#8226;</span> " : "") +
    tarjetas[rand_no]["d"]["p"];
  document.getElementById("tarjT").innerHTML =
    (tarjetas[rand_no]["t"]["tp"] === "S" ? "<span>&#8226;</span> " : "") +
    tarjetas[rand_no]["t"]["p"];
  document.getElementById("tarjNro").innerHTML = tarjetas[rand_no]["nt"];
  tj =
    casillas[posicionesFichas[turno - 1]]["t"] === "t" ||
    tarjetas[rand_no][casillas[posicionesFichas[turno - 1]]["t"]]["tp"] === "S";
  document.getElementById("btnSacarTarjeta").disabled = true;
  document.getElementById("btnVerTarjeta").disabled = false;
  backupTarjetas.push(tarjetas[rand_no]);
  let reiniciarTarjetas = tarjetas.length === 1;
  tarjetas.splice(rand_no, 1);
  if (reiniciarTarjetas) {
    tarjetas = backupTarjetas.slice();
    backupTarjetas = [];
  }
};
window.mostrarTarjeta = () => {
  if (tj) blinkTodosJueganMsg();
  if (document.getElementById("reloj").style.display === "")
    document.getElementById("reloj").style.display = "none";
  document.getElementById("tarjeta").style.display = "";
};
window.ocultarTarjeta = () => {
  document.getElementById("tarjeta").style.display = "none";
  if (document.getElementById("tiempo").innerHTML === "")
    document.getElementById("btnIniciarReloj").disabled = false;
  else document.getElementById("reloj").style.display = "";
};
window.iniciarReloj = () => {
  document.getElementById("btnPalabraNoAdivinada").disabled = true;
  document.getElementById("btnIniciarReloj").disabled = true;
  document.getElementById("reloj").style.display = "";
  chronoStart();
};

const ubicarFicha = (fichaNro, casilla) => {
  let ficha = document.getElementById("ficha" + fichaNro);
  const offsetX = viewportWidth / 4.9;
  const offsetY = -38;
  centerX =
    offsetX +
    parseInt(casillas[casilla]["x"] * tamanioCasilla + tamanioCasilla / 2);
  centerY =
    offsetY +
    parseInt(casillas[casilla]["y"] * tamanioCasilla + tamanioCasilla / 2);
  centerX += fichaNro === 1 || fichaNro === 2 ? -15 : 20;
  centerY += fichaNro === 2 || fichaNro === 4 ? -10 : 30;
  ficha.style.left = centerX + "px";
  ficha.style.top = centerY + "px";
  ficha.style.display = "";
};
const tirarDado = () => {
  let rand_no = Math.random();
  rand_no = rand_no * 6;
  rand_no = Math.ceil(rand_no);
  return rand_no;
};
const mostrarDado = (valorDado, x, y, padre) => {
  const dado = document.createElement("div");

  dado.className = "dado";
  dado.style.position = "relative";
  dado.style.display = "inline-block";
  dado.style.width = "50px";
  dado.style.height = "50px";

  let i = 1;
  while (document.getElementById("dado" + i)) i++;
  dado.id = "dado" + i;
  let dadocontent = `<div><b class="dice"><b class="dice1"><b></b></b><b class="dice2"><b></b></b><b class="dice3"></b><b class="dice4"></b><b class="dice5"></b></b><div class="dicefg">`;
  switch (valorDado) {
    case 1:
      dadocontent += "&nbsp;<br>•<br>&nbsp;";
      break;
    case 2:
      dadocontent += "•&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;&nbsp;•";
      break;
    case 3:
      dadocontent += "•&nbsp;&nbsp;&nbsp;<br>•<br>&nbsp;&nbsp;&nbsp;•";
      break;
    case 4:
      dadocontent += "•&nbsp;&nbsp;•<br>&nbsp;<br>•&nbsp;&nbsp;•";
      break;
    case 5:
      dadocontent += "•&nbsp;&nbsp;•<br>•<br>•&nbsp;&nbsp;•";
      break;
    case 6:
      dadocontent += "•&nbsp;&nbsp;•<br>•&nbsp;&nbsp;•<br>•&nbsp;&nbsp;•";
      break;
  }
  dadocontent += `</div><b class="dice"><b class="dice5"></b><b class="dice4"></b><b class="dice3"></b><b class="dice2"><b></b></b><b class="dice1"><b></b></b></b></div>`;
  dado.innerHTML = dadocontent;
  padre.appendChild(dado);
  return valorDado;
};
const moverFicha = (fichaNro, lugares) => {
  stopBlinkFicha();
  if (posicionesFichas[fichaNro - 1] !== 54)
    ubicarFicha(fichaNro, ++posicionesFichas[fichaNro - 1]);
  if (posicionesFichas[fichaNro - 1] !== 54 && lugares > 1)
    setTimeout(() => moverFicha(fichaNro, lugares - 1), 500);
  else {
    blinkFicha(turno);
    document.getElementById("btnSacarTarjeta").disabled = false;
  }
};

const avanzar = (window.avanzar = nuevoTurno => {
  document.getElementById("equipoAdivinoTJ").style.display = "none";
  if (posicionesFichas[nuevoTurno - 1] === 54 && turno === nuevoTurno) {
    document.getElementById("btnSacarTarjeta").disabled = true;
    document.getElementById("mensajeGanador").innerHTML =
      "Ganador<br>Equipo " +
      nuevoTurno +
      "<button type='submit' onclick='window.location.reload()'>Nuevo Partido</button>";
    document.getElementById("mensajeGanador").style.display = "";
    return false;
  }
  turno = nuevoTurno;
  let avanza = tirarDado();
  mostrarDado(avanza, 147, 93, tablero);
  moverFicha(turno, avanza);
});

window.palabraAdivinada = () => {
  stopBlinkTodosJueganMsg();
  chronoStop();
  document.getElementById("tiempo").innerHTML = "";
  document.getElementById("reloj").style.display = "none";
  document.getElementById("btnVerTarjeta").disabled = true;
  if (tj) document.getElementById("equipoAdivinoTJ").style.display = "";
  else avanzar(turno);
};

const cambiaTurno = () => {
  turno = (turno % equipos) + 1;
  document.getElementById("divturno").innerHTML = "Turno: Equipo " + turno;
  stopBlinkFicha();
  blinkFicha(turno);
};

window.palabraNOAdivinada = () => {
  stopBlinkTodosJueganMsg();
  chronoStop();
  document.getElementById("tiempo").innerHTML = "";
  document.getElementById("reloj").style.display = "none";
  cambiaTurno();
  document.getElementById("btnVerTarjeta").disabled = true;
  document.getElementById("btnSacarTarjeta").disabled = false;
};

window.pause = millis => {
  let date = new Date();
  let curDate = null;
  do {
    curDate = new Date();
  } while (curDate - date < millis);
};
window.onload = () => {
  tamanioCasilla = 75;
  tablero = document.getElementById("tablero");
  configuracion = document.getElementById("configuracion");
};

window.sortearInicio = equiposPartido => {
  equipos = equiposPartido;
  document.getElementById("seleccionEquipos").style.display = "none";
  document.getElementById("mensajeConf").style.display = "none";
  let dadosSorteo = [];
  for (let i = 1; i <= equiposPartido; i++)
    dadosSorteo[dadosSorteo.length] = {
      e: i,
      d: "7",
      g: true
    };
  let ganadores = equiposPartido;
  while (ganadores > 1) {
    for (let i = 0; i < equiposPartido; i++)
      if (dadosSorteo[i]["g"]) dadosSorteo[i]["d"] = tirarDado();
    for (let i = 0; i < dadosSorteo.length; i++)
      for (let j = i + 1; j < dadosSorteo.length; j++) {
        if (dadosSorteo[j]["g"] && dadosSorteo[i]["d"] < dadosSorteo[j]["d"])
          dadosSorteo[i]["g"] = false;
        if (dadosSorteo[i]["g"] && dadosSorteo[i]["d"] > dadosSorteo[j]["d"])
          dadosSorteo[j]["g"] = false;
      }
    ganadores = 0;
    for (let i = 0; i < dadosSorteo.length; i++)
      if (dadosSorteo[i]["g"]) ganadores++;
  }
  let dadosDefinitivos = [];
  for (let i = 0; i < equiposPartido; i++)
    dadosDefinitivos[dadosDefinitivos.length] = dadosSorteo[i]["d"];

  borrarDados();

  let offsetConfX =
    parseInt((viewportWidth - (equiposPartido - 1) * 150) / 2) - 20;
  let offsetAdivinoX = parseInt((300 - (equiposPartido - 1) * 70) / 2) - 24;
  const diceContainer = document.getElementById("dice-container");

  for (let i = 0; i < equiposPartido; i++) {
    mostrarDado(dadosDefinitivos[i], offsetConfX + i * 150, 160, diceContainer);

    document.getElementById("fichaconf" + (i + 1)).style.left =
      offsetConfX + i * 150 + 2 + "px";
    document.getElementById("fichaconf" + (i + 1)).style.top = "240px";
    document.getElementById("fichaconf" + (i + 1)).style.display = "";
    document.getElementById("fichaAdivino" + (i + 1)).style.left =
      offsetAdivinoX + i * 70 + 2 + "px";
    document.getElementById("fichaAdivino" + (i + 1)).style.display = "";
  }

  turno = 0;
  for (let i = 0; i < equiposPartido; i++)
    if (dadosSorteo[i]["g"]) turno = dadosSorteo[i]["e"];

  if (document.getElementById("comienzaJugando"))
    document
      .getElementById("comienzaJugando")
      .parentNode.removeChild(document.getElementById("comienzaJugando"));

  const comienzaJugando = document.createElement("div");
  comienzaJugando.id = "comienzaJugando";
  comienzaJugando.innerHTML = "Comienza Jugando el equipo " + turno;
  configuracion.appendChild(comienzaJugando);
  document.getElementById("comenzarPartida").style.display = "";
};

window.iniciarPartida = () => {
  borrarDados();
  const offset = viewportWidth / 5;
  for (let i = 0; i < casillas.length; i++) {
    const casillaFondo = document.createElement("div");
    casillaFondo.width = tamanioCasilla + 4 + "px";
    casillaFondo.height = tamanioCasilla + 4 + "px";
    casillaFondo.className = "casillaFondo";
    casillaFondo.style.zIndex = 1;
    casillaFondo.style.width = tamanioCasilla + 6 + "px";
    casillaFondo.style.height = tamanioCasilla + 6 + "px";
    casillaFondo.style.left =
      offset + casillas[i]["x"] * tamanioCasilla + 18 + "px";
    casillaFondo.style.top = casillas[i]["y"] * tamanioCasilla + 18 + "px";
    tablero.appendChild(casillaFondo);
    const casillaNueva = document.createElement("div");
    casillaNueva.id = "casilla" + i;
    casillaNueva.className = "casilla " + casillas[i]["t"];
    casillaNueva.style.zIndex = 2;
    casillaNueva.style.width = tamanioCasilla + "px";
    casillaNueva.style.height = tamanioCasilla + "px";
    casillaNueva.innerHTML = casillas[i]["t"] !== "t" ? casillas[i]["t"] : "tj";
    casillaNueva.style.left =
      offset + casillas[i]["x"] * tamanioCasilla + 20 + "px";
    casillaNueva.style.top = casillas[i]["y"] * tamanioCasilla + 20 + "px";
    tablero.appendChild(casillaNueva);
  }
  configuracion.style.display = "none";
  tablero.style.display = "";
  for (let i = 1; i <= equipos; i++) ubicarFicha(i, 0);
  stopBlinkFicha();
  blinkFicha(turno);
  document.getElementById("divturno").innerHTML = "Turno: Equipo " + turno;
  document.getElementById("statusBar").style.display = "";
};

document.onselectstart = () => {
  return false;
};
document.onmousedown = () => {
  return false;
};
document.oncontextmenu = () => {
  return false;
};
