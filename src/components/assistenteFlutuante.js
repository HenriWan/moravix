import { navegar } from "../router.js";

export function assistenteFlutuanteHtml() {
    return `
        <div class="assistente-flutuante">
            <button id="btnAbrirAssistente" class="botao-assistente" aria-label="Abrir assistente de ajuda">
                🤖
            </button>

            <div id="janelaAssistente" class="janela-assistente escondido">
                <div class="topo-assistente">
                    <strong>Assistente de Ajuda</strong>
                    <button id="btnFecharAssistente" aria-label="Fechar assistente">×</button>
                </div>

                <p>
                    Olá! Como posso ajudar?
                </p>

                <button class="sugestao-assistente" data-ajuda="converter">
                    Como converter imagens?
                </button>

                <button class="sugestao-assistente" data-ajuda="silhouette">
                    Como preparar para Silhouette?
                </button>

                <button class="sugestao-assistente" data-ajuda="historico">
                    Ver meu histórico
                </button>

                <button class="sugestao-assistente" data-ajuda="baixa-visao">
                    Ativar modo baixa visão
                </button>

                <div id="respostaAssistente" class="resposta-assistente">
                    Escolha uma opção acima.
                </div>
            </div>
        </div>
    `;
}

export function ativarAssistenteFlutuante() {
    const btnAbrir = document.getElementById("btnAbrirAssistente");
    const btnFechar = document.getElementById("btnFecharAssistente");
    const janela = document.getElementById("janelaAssistente");
    const resposta = document.getElementById("respostaAssistente");

    if (!btnAbrir || !janela) {
        return;
    }

    btnAbrir.addEventListener("click", () => {
        janela.classList.toggle("escondido");
    });

    if (btnFechar) {
        btnFechar.addEventListener("click", () => {
            janela.classList.add("escondido");
        });
    }

    document.querySelectorAll(".sugestao-assistente").forEach((botao) => {
        botao.addEventListener("click", () => {
            const tipo = botao.dataset.ajuda;

            if (tipo === "converter") {
                resposta.textContent = "Vá em Conversores e escolha o tipo desejado: imagem para PNG, JPG, PDF, Word para PDF ou PDF para Word.";
            }

            if (tipo === "silhouette") {
                resposta.textContent = "Use a opção Preparar para Silhouette para criar alto contraste, preto e branco, silhueta ou remover fundo claro.";
            }

            if (tipo === "historico") {
                navegar("/historico");
            }

            if (tipo === "baixa-visao") {
                navegar("/acessibilidade");
            }
        });
    });
}