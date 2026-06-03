import {
    apagarArquivo,
    criarLinkTemporario,
    listarArquivos
} from "../services/storageService.js";

import {
    ativarBotoesVoltarPainel,
    ativarRecursosLayout,
    layoutBase,
    setMensagem
} from "../utils/ui.js";

export const historicoPage = {
    render() {
        return layoutBase(`
            <h2>Histórico</h2>

            <p class="texto-secundario">
                Veja os arquivos convertidos e salvos na sua conta.
            </p>

            <div class="bloco-conversor">
                <h3>Meus arquivos</h3>

                <button id="btnAtualizar" class="botao botao-principal">
                    Atualizar histórico
                </button>

                <div id="listaHistorico" class="lista-historico"></div>
            </div>

            <p id="msgHistorico" class="mensagem"></p>

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

        document.getElementById("btnAtualizar").addEventListener("click", carregarHistorico);

        carregarHistorico();
    }
};

async function carregarHistorico() {
    const lista = document.getElementById("listaHistorico");

    try {
        lista.innerHTML = "";

        setMensagem(
            "msgHistorico",
            "Carregando histórico...",
            "alerta"
        );

        const arquivos = await listarArquivos();

        if (!arquivos || arquivos.length === 0) {
            lista.innerHTML = `
                <div class="item-historico">
                    <strong>Nenhum arquivo encontrado</strong>
                    <span>Quando você converter uma imagem, ela aparecerá aqui.</span>
                </div>
            `;

            setMensagem(
                "msgHistorico",
                "Nenhum arquivo salvo ainda.",
                "alerta"
            );

            return;
        }

        limparMensagemHistorico();

        lista.innerHTML = arquivos.map((arquivo) => {
            const dataFormatada = new Date(arquivo.created_at).toLocaleString("pt-BR");

            const categoria = arquivo.categoria || "arquivo";
            const formato = arquivo.formato_saida || "desconhecido";
            const nomeArquivo = arquivo.nome_arquivo || "Arquivo convertido";

            return `
                <div class="item-historico">
                    <strong>${nomeArquivo}</strong>

                    <span>Categoria: ${categoria}</span>
                    <span>Formato: ${formato.toUpperCase()}</span>
                    <span>Data: ${dataFormatada}</span>

                    <button 
                        class="botao botao-sucesso" 
                        data-abrir="${arquivo.caminho_storage}"
                    >
                        Abrir / baixar
                    </button>

                    <button 
                        class="botao botao-perigo" 
                        data-apagar="${arquivo.id}" 
                        data-caminho="${arquivo.caminho_storage}"
                    >
                        Apagar
                    </button>
                </div>
            `;
        }).join("");

        ativarAcoesHistorico();
    } catch (erro) {
        setMensagem(
            "msgHistorico",
            erro.message,
            "erro"
        );
    }
}

function limparMensagemHistorico() {
    const msg = document.getElementById("msgHistorico");

    if (!msg) {
        return;
    }

    msg.textContent = "";
    msg.className = "mensagem";
}

function ativarAcoesHistorico() {
    document.querySelectorAll("[data-abrir]").forEach((botao) => {
        botao.addEventListener("click", async () => {
            try {
                const caminho = botao.dataset.abrir;

                setMensagem(
                    "msgHistorico",
                    "Gerando link temporário...",
                    "alerta"
                );

                const url = await criarLinkTemporario(caminho);

                window.open(url, "_blank");

                setMensagem(
                    "msgHistorico",
                    "Link aberto com sucesso.",
                    "sucesso"
                );
            } catch (erro) {
                setMensagem(
                    "msgHistorico",
                    erro.message,
                    "erro"
                );
            }
        });
    });

    document.querySelectorAll("[data-apagar]").forEach((botao) => {
        botao.addEventListener("click", async () => {
            const confirmar = window.confirm("Tem certeza que deseja apagar este arquivo?");

            if (!confirmar) {
                return;
            }

            try {
                const id = botao.dataset.apagar;
                const caminho = botao.dataset.caminho;

                setMensagem(
                    "msgHistorico",
                    "Apagando arquivo...",
                    "alerta"
                );

                await apagarArquivo({
                    id,
                    caminho
                });

                setMensagem(
                    "msgHistorico",
                    "Arquivo apagado com sucesso.",
                    "sucesso"
                );

                await carregarHistorico();
            } catch (erro) {
                setMensagem(
                    "msgHistorico",
                    erro.message,
                    "erro"
                );
            }
        });
    });
}