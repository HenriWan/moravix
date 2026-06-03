import { appConfig } from "../config/appConfig.js";
import { layoutCentral, logoHtml } from "../utils/ui.js";
import { navegar } from "../router.js";

export const aberturaPage = {
    render() {
        return layoutCentral(`
            ${logoHtml()}

            <p class="slogan slogan-inicial">
                ${appConfig.slogan}
            </p>

            <p class="texto-secundario frase-inicial">
                ${appConfig.frase}
            </p>

            <div class="acoes-iniciais">
                <button id="btnEntrar" class="botao botao-principal">
                    Entrar
                </button>

                <button id="btnCriarConta" class="botao botao-secundario">
                    Criar conta
                </button>
            </div>
        `);
    },

    afterRender() {
        document.getElementById("btnEntrar").addEventListener("click", () => {
            navegar("/login");
        });

        document.getElementById("btnCriarConta").addEventListener("click", () => {
            navegar("/cadastro");
        });
    }
};