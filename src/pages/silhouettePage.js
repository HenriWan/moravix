import {
    baixarBlob,
    gerarPdfDeDataUrl,
    prepararImagemSilhouette
} from "../services/imageService.js";

import { salvarArquivo } from "../services/storageService.js";

import {
    ativarBotoesVoltarPainel,
    ativarRecursosLayout,
    layoutBase,
    setMensagem
} from "../utils/ui.js";

let arquivoSelecionado = null;
let resultadoAtual = null;

export const silhouettePage = {
    render() {
        return layoutBase(`
            <h2>Preparar para Silhouette Studio</h2>

            <p class="texto-secundario">
                Prepare imagens para importar no Silhouette Studio e usar a ferramenta de rastrear/traçar.
            </p>

            <div class="aviso">
                PNG e JPG podem ser importados no Silhouette Studio, mas normalmente precisam ser rastreados/traçados dentro do próprio software para criar linhas de corte. SVG e DXF serão formatos avançados para uma próxima fase.
            </div>

            <label for="inputSilhouette">Escolher imagem</label>
            <input 
                id="inputSilhouette" 
                type="file" 
                accept="image/png,image/jpeg,image/jpg,image/webp"
            >

            <h3>Original</h3>
            <img 
                id="previewOriginal" 
                class="preview escondido" 
                alt="Imagem original"
            >

            <h3>Resultado preparado</h3>
            <img 
                id="previewResultado" 
                class="preview fundo-xadrez escondido" 
                alt="Imagem preparada para Silhouette Studio"
            >

            <div class="bloco-conversor">
                <h3>Preparações disponíveis</h3>

                <button id="btnAltoContraste" class="botao botao-principal">
                    Alto contraste
                </button>

                <button id="btnPretoBranco" class="botao botao-principal">
                    Preto e branco
                </button>

                <button id="btnSilhueta" class="botao botao-principal">
                    Silhueta preta
                </button>

                <button id="btnSilhuetaVermelha" class="botao botao-silhouette">
                    Silhueta vermelha para rastreio
                </button>

                <button id="btnRemoverFundo" class="botao botao-principal">
                    Remover fundo claro
                </button>
            </div>

            <div class="bloco-conversor">
                <h3>Baixar resultado</h3>

                <button id="btnBaixarPng" class="botao botao-sucesso">
                    Baixar PNG para Silhouette Studio
                </button>

                <button id="btnBaixarJpg" class="botao botao-sucesso">
                    Baixar JPG para Silhouette Studio
                </button>

                <button id="btnBaixarPdf" class="botao botao-sucesso">
                    Baixar PDF preparado
                </button>
            </div>

            <p id="msgSilhouette" class="mensagem"></p>

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

        const input = document.getElementById("inputSilhouette");
        const previewOriginal = document.getElementById("previewOriginal");
        const previewResultado = document.getElementById("previewResultado");

        input.addEventListener("change", () => {
            arquivoSelecionado = input.files[0];
            resultadoAtual = null;

            if (!arquivoSelecionado) {
                return;
            }

            previewOriginal.src = URL.createObjectURL(arquivoSelecionado);
            previewOriginal.classList.remove("escondido");

            previewResultado.classList.add("escondido");
            previewResultado.removeAttribute("src");

            setMensagem("msgSilhouette", "Imagem carregada.", "sucesso");
        });

        document.getElementById("btnAltoContraste").addEventListener("click", () => {
            processar("alto-contraste");
        });

        document.getElementById("btnPretoBranco").addEventListener("click", () => {
            processar("preto-branco");
        });

        document.getElementById("btnSilhueta").addEventListener("click", () => {
            processar("silhueta");
        });

        document.getElementById("btnSilhuetaVermelha").addEventListener("click", () => {
            processar("silhueta-vermelha");
        });

        document.getElementById("btnRemoverFundo").addEventListener("click", () => {
            processar("remover-fundo");
        });

        document.getElementById("btnBaixarPng").addEventListener("click", () => {
            baixarResultado("png");
        });

        document.getElementById("btnBaixarJpg").addEventListener("click", () => {
            baixarResultado("jpg");
        });

        document.getElementById("btnBaixarPdf").addEventListener("click", () => {
            baixarResultado("pdf");
        });
    }
};

async function processar(modo) {
    if (!arquivoSelecionado) {
        setMensagem("msgSilhouette", "Escolha uma imagem primeiro.", "erro");
        return;
    }

    try {
        setMensagem("msgSilhouette", "Preparando imagem...", "alerta");

        resultadoAtual = await prepararImagemSilhouette(arquivoSelecionado, modo);

        const previewResultado = document.getElementById("previewResultado");

        previewResultado.src = resultadoAtual.dataUrl;
        previewResultado.classList.remove("escondido");

        if (modo === "silhueta-vermelha") {
            setMensagem(
                "msgSilhouette",
                "Silhueta vermelha preparada. Baixe em PNG para importar no Silhouette Studio e usar o rastreio/trace.",
                "sucesso"
            );

            return;
        }

        if (modo === "silhueta") {
            setMensagem(
                "msgSilhouette",
                "Silhueta preta preparada. Baixe em PNG para importar no Silhouette Studio.",
                "sucesso"
            );

            return;
        }

        if (modo === "remover-fundo") {
            setMensagem(
                "msgSilhouette",
                "Fundo claro removido. Baixe em PNG para manter a transparência.",
                "sucesso"
            );

            return;
        }

        setMensagem("msgSilhouette", "Imagem preparada com sucesso.", "sucesso");
    } catch (erro) {
        setMensagem("msgSilhouette", erro.message, "erro");
    }
}

async function baixarResultado(formato) {
    if (!resultadoAtual) {
        setMensagem("msgSilhouette", "Gere uma imagem preparada primeiro.", "erro");
        return;
    }

    try {
        setMensagem("msgSilhouette", "Gerando arquivo...", "alerta");

        let blob;

        if (formato === "png") {
            blob = resultadoAtual.pngBlob;
        }

        if (formato === "jpg") {
            blob = resultadoAtual.jpgBlob;
        }

        if (formato === "pdf") {
            blob = await gerarPdfDeDataUrl(resultadoAtual.dataUrl);
        }

        const nomeArquivo = `moravix-silhouette-studio-${Date.now()}.${formato}`;

        baixarBlob(blob, nomeArquivo);

        await salvarArquivo({
            blob,
            nomeOriginal: arquivoSelecionado.name,
            formatoOrigem: arquivoSelecionado.type,
            formatoSaida: formato,
            categoria: "silhouette-studio"
        });

        setMensagem(
            "msgSilhouette",
            `${formato.toUpperCase()} preparado para Silhouette Studio baixado e salvo no histórico.`,
            "sucesso"
        );
    } catch (erro) {
        setMensagem("msgSilhouette", erro.message, "erro");
    }
}