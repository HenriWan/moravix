import {
    ativarBotoesVoltarPainel,
    ativarRecursosLayout,
    layoutBase,
    setMensagem
} from "../utils/ui.js";

let escalaFonte = Number(localStorage.getItem("moravixEscalaFonte")) || 1;

function aplicarFonte() {
    document.documentElement.style.setProperty("--escala-fonte", escalaFonte);
    localStorage.setItem("moravixEscalaFonte", escalaFonte);
}

export const acessibilidadePage = {
    render() {
        return layoutBase(`
            <h2>Modo baixa visão</h2>

            <p class="texto-secundario">
                Ajuste o visual do app para melhorar a leitura.
            </p>

            <div class="bloco-conversor">
                <h3>Tamanho da fonte</h3>

                <button id="btnAumentar" class="botao botao-principal">
                    Aumentar fonte
                </button>

                <button id="btnDiminuir" class="botao botao-secundario">
                    Diminuir fonte
                </button>
            </div>

            <div class="bloco-conversor">
                <h3>Contraste e foco</h3>

                <button id="btnContraste" class="botao botao-secundario">
                    Ativar/desativar alto contraste
                </button>

                <button id="btnFoco" class="botao botao-secundario">
                    Ativar/desativar modo foco
                </button>
            </div>

            <div class="bloco-conversor">
                <h3>Restaurar visual</h3>

                <button id="btnRestaurar" class="botao botao-alerta">
                    Restaurar padrão
                </button>
            </div>

            <p id="msgAcessibilidade" class="mensagem"></p>

            <button class="botao botao-secundario" data-voltar-painel>
                Voltar ao painel
            </button>
        `, {
            assistente: true
        });
    },

    afterRender() {
        ativarBotoesVoltarPainel();

        ativarRecursosLayout({
            assistente: true
        });

        aplicarFonte();

        document.getElementById("btnAumentar").addEventListener("click", () => {
            escalaFonte = Math.min(1.5, escalaFonte + 0.1);
            aplicarFonte();

            setMensagem(
                "msgAcessibilidade",
                "Fonte aumentada.",
                "sucesso"
            );
        });

        document.getElementById("btnDiminuir").addEventListener("click", () => {
            escalaFonte = Math.max(1, escalaFonte - 0.1);
            aplicarFonte();

            setMensagem(
                "msgAcessibilidade",
                "Fonte diminuída.",
                "sucesso"
            );
        });

        document.getElementById("btnContraste").addEventListener("click", () => {
            document.body.classList.toggle("alto-contraste");

            if (document.body.classList.contains("alto-contraste")) {
                localStorage.setItem("moravixAltoContraste", "sim");
                setMensagem(
                    "msgAcessibilidade",
                    "Alto contraste ativado.",
                    "sucesso"
                );
            } else {
                localStorage.setItem("moravixAltoContraste", "nao");
                setMensagem(
                    "msgAcessibilidade",
                    "Alto contraste desativado.",
                    "alerta"
                );
            }
        });

        document.getElementById("btnFoco").addEventListener("click", () => {
            document.body.classList.toggle("modo-foco");

            if (document.body.classList.contains("modo-foco")) {
                localStorage.setItem("moravixModoFoco", "sim");
                setMensagem(
                    "msgAcessibilidade",
                    "Modo foco ativado.",
                    "sucesso"
                );
            } else {
                localStorage.setItem("moravixModoFoco", "nao");
                setMensagem(
                    "msgAcessibilidade",
                    "Modo foco desativado.",
                    "alerta"
                );
            }
        });

        document.getElementById("btnRestaurar").addEventListener("click", () => {
            escalaFonte = 1;

            document.body.classList.remove("alto-contraste");
            document.body.classList.remove("modo-foco");

            localStorage.setItem("moravixEscalaFonte", escalaFonte);
            localStorage.setItem("moravixAltoContraste", "nao");
            localStorage.setItem("moravixModoFoco", "nao");

            aplicarFonte();

            setMensagem(
                "msgAcessibilidade",
                "Visual restaurado para o padrão.",
                "alerta"
            );
        });
    }
};