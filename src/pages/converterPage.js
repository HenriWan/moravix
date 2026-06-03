import {
    baixarBlob,
    converterImagemParaPdf,
    converterParaJpg,
    converterParaPng,
    converterPdfParaJpg,
    nomeSemExtensao
} from "../services/imageService.js";

import { salvarArquivo } from "../services/storageService.js";
import {
    ativarBotoesVoltarPainel,
    ativarRecursosLayout,
    layoutBase,
    setMensagem
} from "../utils/ui.js";

let arquivoImagemSelecionado = null;
let arquivoPdfSelecionado = null;

export const converterPage = {
    render() {
        return layoutBase(`
            <h2>Conversores</h2>

            <p class="texto-secundario">
                Escolha o tipo de conversão.
            </p>

            <div class="bloco-conversor">
                <h3>Imagem para PNG, JPG ou PDF</h3>

                <label for="inputConversorImagem">Escolher imagem</label>
                <input 
                    id="inputConversorImagem" 
                    type="file" 
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                >

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

            <div class="bloco-conversor">
                <h3>PDF para JPG</h3>

                <p class="texto-secundario">
                    Transforme cada página do PDF em uma imagem JPG.
                </p>

                <label for="inputPdfParaJpg">Escolher PDF</label>
                <input 
                    id="inputPdfParaJpg" 
                    type="file" 
                    accept="application/pdf"
                >

                <button id="btnPdfParaJpg" class="botao botao-principal">
                    Converter PDF para JPG
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
                    Em breve: transformar PDF em documento editável usando backend.
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

        const inputImagem = document.getElementById("inputConversorImagem");
        const preview = document.getElementById("previewConversor");
        const inputPdf = document.getElementById("inputPdfParaJpg");

        inputImagem.addEventListener("change", () => {
            arquivoImagemSelecionado = inputImagem.files[0];

            if (!arquivoImagemSelecionado) {
                return;
            }

            preview.src = URL.createObjectURL(arquivoImagemSelecionado);
            preview.classList.remove("escondido");

            setMensagem("msgConversor", "Imagem carregada.", "sucesso");
        });

        inputPdf.addEventListener("change", () => {
            arquivoPdfSelecionado = inputPdf.files[0];

            if (!arquivoPdfSelecionado) {
                return;
            }

            setMensagem("msgConversor", "PDF carregado.", "sucesso");
        });

        document.getElementById("btnPng").addEventListener("click", async () => {
            await converterImagem("png");
        });

        document.getElementById("btnJpg").addEventListener("click", async () => {
            await converterImagem("jpg");
        });

        document.getElementById("btnPdf").addEventListener("click", async () => {
            await converterImagem("pdf");
        });

        document.getElementById("btnPdfParaJpg").addEventListener("click", async () => {
            await converterPdfEmJpg();
        });

        document.querySelectorAll("[data-em-breve]").forEach((botao) => {
            botao.addEventListener("click", () => {
                setMensagem(
                    "msgConversor",
                    "Esse conversor será implementado na próxima fase com backend próprio.",
                    "alerta"
                );
            });
        });
    }
};

async function converterImagem(formato) {
    if (!arquivoImagemSelecionado) {
        setMensagem("msgConversor", "Escolha uma imagem primeiro.", "erro");
        return;
    }

    try {
        setMensagem("msgConversor", "Convertendo...", "alerta");

        let blob;

        if (formato === "png") {
            blob = await converterParaPng(arquivoImagemSelecionado);
        }

        if (formato === "jpg") {
            blob = await converterParaJpg(arquivoImagemSelecionado);
        }

        if (formato === "pdf") {
            blob = await converterImagemParaPdf(arquivoImagemSelecionado);
        }

        const nome = `moravix-${nomeSemExtensao(arquivoImagemSelecionado.name)}.${formato}`;

        baixarBlob(blob, nome);

        await salvarArquivo({
            blob,
            nomeOriginal: arquivoImagemSelecionado.name,
            formatoOrigem: arquivoImagemSelecionado.type,
            formatoSaida: formato,
            categoria: "conversoes"
        });

        setMensagem("msgConversor", `${formato.toUpperCase()} baixado e salvo no histórico.`, "sucesso");
    } catch (erro) {
        setMensagem("msgConversor", erro.message, "erro");
    }
}

async function converterPdfEmJpg() {
    if (!arquivoPdfSelecionado) {
        setMensagem("msgConversor", "Escolha um PDF primeiro.", "erro");
        return;
    }

    try {
        setMensagem("msgConversor", "Convertendo PDF para JPG. Aguarde...", "alerta");

        const imagens = await converterPdfParaJpg(arquivoPdfSelecionado);
        const nomeBase = nomeSemExtensao(arquivoPdfSelecionado.name);

        for (const imagem of imagens) {
            const nomeArquivo = `moravix-${nomeBase}-pagina-${imagem.pagina}.jpg`;

            baixarBlob(imagem.blob, nomeArquivo);

            await salvarArquivo({
                blob: imagem.blob,
                nomeOriginal: arquivoPdfSelecionado.name,
                formatoOrigem: arquivoPdfSelecionado.type,
                formatoSaida: "jpg",
                categoria: "pdf-para-jpg"
            });
        }

        setMensagem(
            "msgConversor",
            `PDF convertido com sucesso. ${imagens.length} página(s) foram baixadas em JPG e salvas no histórico.`,
            "sucesso"
        );
    } catch (erro) {
        setMensagem("msgConversor", erro.message, "erro");
    }
}