import { appConfig } from "../config/appConfig.js";
import { navegar } from "../router.js";
import {
    assistenteFlutuanteHtml,
    ativarAssistenteFlutuante
} from "../components/assistenteFlutuante.js";

export function logoHtml() {
    return `
        <div class="logo-area">
            <img class="logo logo-grande" src="${appConfig.logo}" alt="Logo do app">
        </div>
    `;
}

export function rodapeHtml() {
    return `
        <footer class="rodape-app">
            <span>${appConfig.copyright}</span>
            <span>Versão ${appConfig.versao}</span>
        </footer>
    `;
}

export function layoutBase(conteudo, opcoes = {}) {
    const mostrarAssistente = opcoes.assistente === true;

    return `
        <main class="app">
            <section class="tela tela-ativa">
                <div class="card">
                    ${conteudo}
                    ${rodapeHtml()}
                </div>
            </section>

            ${mostrarAssistente ? assistenteFlutuanteHtml() : ""}
        </main>
    `;
}

export function layoutCentral(conteudo) {
    return `
        <main class="app app-central">
            <section class="tela tela-ativa">
                <div class="card centralizado card-inicial">
                    ${conteudo}
                    ${rodapeHtml()}
                </div>
            </section>
        </main>
    `;
}

export function ativarRecursosLayout(opcoes = {}) {
    if (opcoes.assistente === true) {
        ativarAssistenteFlutuante();
    }
}

export function setMensagem(id, texto, tipo = "sucesso") {
    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.textContent = texto;
    elemento.className = `mensagem ${tipo}`;
}

export function limparMensagem(id) {
    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.textContent = "";
    elemento.className = "mensagem";
}

export function ativarBotoesVoltarPainel() {
    document.querySelectorAll("[data-voltar-painel]").forEach((botao) => {
        botao.addEventListener("click", () => {
            navegar("/painel");
        });
    });
}

export function ativarOlhosSenha() {
    document.querySelectorAll(".botao-olho").forEach((botao) => {
        botao.addEventListener("click", () => {
            const input = document.getElementById(botao.dataset.alvo);

            if (!input) {
                return;
            }

            if (input.type === "password") {
                input.type = "text";
                botao.classList.add("mostrando");
            } else {
                input.type = "password";
                botao.classList.remove("mostrando");
            }
        });
    });
}