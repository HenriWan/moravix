import {
    baixarBlob,
    converterImagemParaPdf,
    converterParaJpg,
    converterParaPng,
    nomeSemExtensao
} from "../services/imageService.js";

import { salvarArquivo } from "../services/storageService.js";
import {
    ativarBotoesVoltarPainel,
    ativarRecursosLayout,
    layoutBase,
    setMensagem
} from "../utils/ui.js";

let arquivoSelecionado = null;

export const converterPage = {
    render() {
        return layoutBase(`
            <h2>Conversores</h2>

            <p class="texto-secundario">
                Escolha o tipo de conversão.
            </p>

            <div class="bloco-conversor">
                <h3>Imagem para PNG, JPG ou PDF</h3>

                <label for="inputConversor">Escolher imagem</label>
                <input id="inputConversor" type="file" accept="image/png,image/jpeg,image/jpg,image/webp">

                <img id="previewConversor" class="preview escondido" alt="Prévia da imagem">

                <button id="btnPng" class="botao botao-principal">
                    Baixar PNG
                </button>

                <button id="btnJpg" class="botao botao-principal">
                    Baixar JPG
                </button>

                <button id="btnPdf" class="botao botao-principal">
                    Baixar PDF
                </button>
            </div>

            <div class="bloco-conversor bloco-em-breve">
                <h3>Word para PDF</h3>
                <p class="texto-secundario">
                    Em breve: conversão de documentos Word para PDF usando backend.
                </p>

                <button class="botao botao-secundario" data-em-breve>
                    Selecionar documento Word
                </button>
            </div>

            <div class="bloco-conversor bloco-em-breve">
                <h3>PDF para Word</h3>
                <p class="texto-secundario">
                    Em breve: transformar PDF em documento editável.
                </p>

                <button class="botao botao-secundario" data-em-breve>
                    Selecionar PDF
                </button>
            </div>

            <div class="bloco-conversor bloco-em-breve">
                <h3>PDF para imagem</h3>
                <p class="texto-secundario">
                    Em breve: transformar páginas de PDF em PNG ou JPG.
                </p>

                <button class="botao botao-secundario" data-em-breve>
                    Selecionar PDF
                </button>
            </div>

            <p id="msgConversor" class="mensagem"></p>

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

        const input = document.getElementById("inputConversor");
        const preview = document.getElementById("previewConversor");

        input.addEventListener("change", () => {
            arquivoSelecionado = input.files[0];

            if (!arquivoSelecionado) {
                return;
            }

            preview.src = URL.createObjectURL(arquivoSelecionado);
            preview.classList.remove("escondido");

            setMensagem("msgConversor", "Imagem carregada.", "sucesso");
        });

        document.getElementById("btnPng").addEventListener("click", async () => {
            await converter("png");
        });

        document.getElementById("btnJpg").addEventListener("click", async () => {
            await converter("jpg");
        });

        document.getElementById("btnPdf").addEventListener("click", async () => {
            await converter("pdf");
        });

        document.querySelectorAll("[data-em-breve]").forEach((botao) => {
            botao.addEventListener("click", () => {
                setMensagem(
                    "msgConversor",
                    "Esse conversor será implementado na próxima fase com backend.",
                    "alerta"
                );
            });
        });
    }
};

async function converter(formato) {
    if (!arquivoSelecionado) {
        setMensagem("msgConversor", "Escolha uma imagem primeiro.", "erro");
        return;
    }

    try {
        setMensagem("msgConversor", "Convertendo...", "alerta");

        let blob;

        if (formato === "png") {
            blob = await converterParaPng(arquivoSelecionado);
        }

        if (formato === "jpg") {
            blob = await converterParaJpg(arquivoSelecionado);
        }

        if (formato === "pdf") {
            blob = await converterImagemParaPdf(arquivoSelecionado);
        }

        const nome = `moravix-${nomeSemExtensao(arquivoSelecionado.name)}.${formato}`;

        baixarBlob(blob, nome);

        await salvarArquivo({
            blob,
            nomeOriginal: arquivoSelecionado.name,
            formatoOrigem: arquivoSelecionado.type,
            formatoSaida: formato,
            categoria: "conversoes"
        });

        setMensagem("msgConversor", `${formato.toUpperCase()} baixado e salvo no histórico.`, "sucesso");
    } catch (erro) {
        setMensagem("msgConversor", erro.message, "erro");
    }
}