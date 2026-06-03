import { getSession } from "./services/authService.js";

import { aberturaPage } from "./pages/aberturaPage.js";
import { loginPage } from "./pages/loginPage.js";
import { cadastroPage } from "./pages/cadastroPage.js";
import { painelPage } from "./pages/painelPage.js";
import { converterPage } from "./pages/converterPage.js";
import { silhouettePage } from "./pages/silhouettePage.js";
import { acessibilidadePage } from "./pages/acessibilidadePage.js";
import { assistentePage } from "./pages/assistentePage.js";
import { historicoPage } from "./pages/historicoPage.js";
import { sobrePage } from "./pages/sobrePage.js";

const app = document.getElementById("app");

const rotas = {
    "/": {
        protegida: false,
        page: aberturaPage
    },
    "/login": {
        protegida: false,
        page: loginPage
    },
    "/cadastro": {
        protegida: false,
        page: cadastroPage
    },
    "/painel": {
        protegida: true,
        page: painelPage
    },
    "/converter": {
        protegida: true,
        page: converterPage
    },
    "/silhouette": {
        protegida: true,
        page: silhouettePage
    },
    "/acessibilidade": {
        protegida: true,
        page: acessibilidadePage
    },
    "/assistente": {
        protegida: true,
        page: assistentePage
    },
    "/historico": {
        protegida: true,
        page: historicoPage
    },
    "/sobre": {
        protegida: true,
        page: sobrePage
    }
};

export function navegar(rota) {
    window.location.hash = rota;
}

function pegarRotaAtual() {
    return window.location.hash.replace("#", "") || "/";
}

async function renderizar() {
    const rotaAtual = pegarRotaAtual();
    const configRota = rotas[rotaAtual] || rotas["/"];

    if (configRota.protegida) {
        const session = await getSession();

        if (!session) {
            navegar("/login");
            return;
        }
    }

    app.innerHTML = configRota.page.render();

    if (configRota.page.afterRender) {
        await configRota.page.afterRender();
    }
}

export function iniciarRouter() {
    window.addEventListener("hashchange", renderizar);
    window.addEventListener("load", renderizar);

    renderizar();
}