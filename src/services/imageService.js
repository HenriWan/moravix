import { jsPDF } from "jspdf";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export function baixarBlob(blob, nomeArquivo) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

export function nomeSemExtensao(nome) {
    return nome.replace(/\.[^/.]+$/, "");
}

function carregarImagem(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const imagem = new Image();

        imagem.onload = () => {
            URL.revokeObjectURL(url);
            resolve(imagem);
        };

        imagem.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Não foi possível carregar a imagem."));
        };

        imagem.src = url;
    });
}

function carregarImagemPorDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
        const imagem = new Image();

        imagem.onload = () => resolve(imagem);
        imagem.onerror = () => reject(new Error("Não foi possível carregar o resultado."));

        imagem.src = dataUrl;
    });
}

function canvasParaBlob(canvas, tipo, qualidade = 0.92) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Erro ao gerar arquivo."));
                }
            },
            tipo,
            qualidade
        );
    });
}

function reduzirCanvasSeNecessario(canvas, larguraMaxima = 1800) {
    if (canvas.width <= larguraMaxima) {
        return canvas;
    }

    const proporcao = larguraMaxima / canvas.width;
    const novoCanvas = document.createElement("canvas");
    const ctx = novoCanvas.getContext("2d");

    novoCanvas.width = larguraMaxima;
    novoCanvas.height = Math.round(canvas.height * proporcao);

    ctx.drawImage(canvas, 0, 0, novoCanvas.width, novoCanvas.height);

    return novoCanvas;
}

export async function arquivoParaCanvas(file) {
    const imagem = await carregarImagem(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = imagem.naturalWidth || imagem.width;
    canvas.height = imagem.naturalHeight || imagem.height;

    ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height);

    return reduzirCanvasSeNecessario(canvas);
}

export async function converterParaPng(file) {
    const canvas = await arquivoParaCanvas(file);

    return await canvasParaBlob(canvas, "image/png");
}

export async function converterParaJpg(file) {
    const canvas = await arquivoParaCanvas(file);

    const canvasJpg = document.createElement("canvas");
    const ctx = canvasJpg.getContext("2d");

    canvasJpg.width = canvas.width;
    canvasJpg.height = canvas.height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasJpg.width, canvasJpg.height);
    ctx.drawImage(canvas, 0, 0);

    return await canvasParaBlob(canvasJpg, "image/jpeg", 0.92);
}

function adicionarImagemNoPdf(pdf, dataUrl, larguraOriginal, alturaOriginal) {
    const larguraPagina = pdf.internal.pageSize.getWidth();
    const alturaPagina = pdf.internal.pageSize.getHeight();

    const margem = 10;
    const larguraUtil = larguraPagina - margem * 2;
    const alturaUtil = alturaPagina - margem * 2;

    const proporcao = larguraOriginal / alturaOriginal;

    let larguraImagem = larguraUtil;
    let alturaImagem = larguraImagem / proporcao;

    if (alturaImagem > alturaUtil) {
        alturaImagem = alturaUtil;
        larguraImagem = alturaImagem * proporcao;
    }

    const x = (larguraPagina - larguraImagem) / 2;
    const y = (alturaPagina - alturaImagem) / 2;

    pdf.addImage(dataUrl, "JPEG", x, y, larguraImagem, alturaImagem);
}

export async function converterImagemParaPdf(file) {
    const canvas = await arquivoParaCanvas(file);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    adicionarImagemNoPdf(pdf, dataUrl, canvas.width, canvas.height);

    return pdf.output("blob");
}

export async function gerarPdfDeDataUrl(dataUrl) {
    const imagem = await carregarImagemPorDataUrl(dataUrl);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = imagem.naturalWidth || imagem.width;
    canvas.height = imagem.naturalHeight || imagem.height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imagem, 0, 0);

    const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.92);

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    adicionarImagemNoPdf(pdf, jpgDataUrl, canvas.width, canvas.height);

    return pdf.output("blob");
}

export async function converterPdfParaJpg(file) {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
    }).promise;

    const imagens = [];

    for (let numeroPagina = 1; numeroPagina <= pdf.numPages; numeroPagina++) {
        const pagina = await pdf.getPage(numeroPagina);

        const viewport = pagina.getViewport({
            scale: 2
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await pagina.render({
            canvasContext: ctx,
            viewport
        }).promise;

        const blob = await canvasParaBlob(canvas, "image/jpeg", 0.92);

        imagens.push({
            blob,
            pagina: numeroPagina,
            totalPaginas: pdf.numPages
        });
    }

    return imagens;
}

function limitar255(valor) {
    return Math.max(0, Math.min(255, valor));
}

export async function prepararImagemSilhouette(file, modo) {
    const canvas = await arquivoParaCanvas(file);
    const ctx = canvas.getContext("2d");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        const cinza = Math.round((r + g + b) / 3);

        if (modo === "alto-contraste") {
            pixels[i] = limitar255((r - 128) * 1.9 + 128);
            pixels[i + 1] = limitar255((g - 128) * 1.9 + 128);
            pixels[i + 2] = limitar255((b - 128) * 1.9 + 128);
            pixels[i + 3] = a;
        }

        if (modo === "preto-branco") {
            const valor = cinza > 145 ? 255 : 0;

            pixels[i] = valor;
            pixels[i + 1] = valor;
            pixels[i + 2] = valor;
            pixels[i + 3] = 255;
        }

        if (modo === "silhueta") {
            if (cinza < 215) {
                pixels[i] = 0;
                pixels[i + 1] = 0;
                pixels[i + 2] = 0;
                pixels[i + 3] = 255;
            } else {
                pixels[i] = 255;
                pixels[i + 1] = 255;
                pixels[i + 2] = 255;
                pixels[i + 3] = 0;
            }
        }

        if (modo === "silhueta-vermelha") {
            if (cinza < 215) {
                pixels[i] = 239;
                pixels[i + 1] = 68;
                pixels[i + 2] = 68;
                pixels[i + 3] = 255;
            } else {
                pixels[i] = 255;
                pixels[i + 1] = 255;
                pixels[i + 2] = 255;
                pixels[i + 3] = 0;
            }
        }

        if (modo === "remover-fundo") {
            if (r > 235 && g > 235 && b > 235) {
                pixels[i + 3] = 0;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    const pngBlob = await canvasParaBlob(canvas, "image/png");
    const dataUrl = canvas.toDataURL("image/png");

    const canvasJpg = document.createElement("canvas");
    const ctxJpg = canvasJpg.getContext("2d");

    canvasJpg.width = canvas.width;
    canvasJpg.height = canvas.height;

    ctxJpg.fillStyle = "#ffffff";
    ctxJpg.fillRect(0, 0, canvasJpg.width, canvasJpg.height);
    ctxJpg.drawImage(canvas, 0, 0);

    const jpgBlob = await canvasParaBlob(canvasJpg, "image/jpeg", 0.92);

    return {
        pngBlob,
        jpgBlob,
        dataUrl
    };
}