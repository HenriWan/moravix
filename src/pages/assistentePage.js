import { perguntasAjuda } from "../data/ajudaData.js";
import { ativarBotoesVoltarPainel, layoutBase } from "../utils/ui.js";

export const assistentePage = {
    render() {
        const botoes = perguntasAjuda.map((item, index) => {
            return `
                <button class="pergunta-ajuda" data-index="${index}">
                    <strong>${item.pergunta}</strong>
                    <small>${item.categoria}</small>
                </button>
            `;
        }).join("");

        return layoutBase(`
            <h2>Assistente Moravix</h2>

            <p class="texto-secundario">
                Ajuda rápida sobre como usar o app.
            </p>

            <label for="buscaAjuda">Buscar dúvida</label>
            <input id="buscaAjuda" type="text" placeholder="Ex: PNG, PDF, Silhouette, senha...">

            <div id="listaPerguntas" class="lista-ajuda">
                ${botoes}
            </div>

            <div id="respostaAjuda" class="resposta-ajuda">
                <strong>Resposta</strong>
                <p>Escolha uma dúvida acima para ver a explicação.</p>
            </div>

            <button class="botao botao-secundario" data-voltar-painel>
                Voltar ao painel
            </button>
        `);
    },

    afterRender() {
        ativarBotoesVoltarPainel();

        const busca = document.getElementById("buscaAjuda");
        const lista = document.getElementById("listaPerguntas");
        const resposta = document.getElementById("respostaAjuda");

        function mostrarPerguntas(filtro = "") {
            const termo = filtro.toLowerCase();

            const filtradas = perguntasAjuda
                .map((item, index) => ({ ...item, index }))
                .filter((item) => {
                    return (
                        item.pergunta.toLowerCase().includes(termo) ||
                        item.resposta.toLowerCase().includes(termo) ||
                        item.categoria.toLowerCase().includes(termo)
                    );
                });

            lista.innerHTML = filtradas.map((item) => {
                return `
                    <button class="pergunta-ajuda" data-index="${item.index}">
                        <strong>${item.pergunta}</strong>
                        <small>${item.categoria}</small>
                    </button>
                `;
            }).join("");

            ativarPerguntas();
        }

        function ativarPerguntas() {
            document.querySelectorAll(".pergunta-ajuda").forEach((botao) => {
                botao.addEventListener("click", () => {
                    const item = perguntasAjuda[Number(botao.dataset.index)];

                    resposta.innerHTML = `
                        <strong>${item.pergunta}</strong>
                        <p>${item.resposta}</p>
                    `;
                });
            });
        }

        busca.addEventListener("input", () => {
            mostrarPerguntas(busca.value);
        });

        ativarPerguntas();
    }
};