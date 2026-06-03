import "./styles.css";
import { iniciarRouter } from "./router.js";

const escalaFonte = localStorage.getItem("moravixEscalaFonte") || 1;
const altoContraste = localStorage.getItem("moravixAltoContraste");
const modoFoco = localStorage.getItem("moravixModoFoco");

document.documentElement.style.setProperty("--escala-fonte", escalaFonte);

if (altoContraste === "sim") {
    document.body.classList.add("alto-contraste");
}

if (modoFoco === "sim") {
    document.body.classList.add("modo-foco");
}

iniciarRouter();