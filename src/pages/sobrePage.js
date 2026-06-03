import { appConfig } from "../config/appConfig.js";

import {
    ativarBotoesVoltarPainel,
    ativarRecursosLayout,
    layoutBase
} from "../utils/ui.js";

export const sobrePage = {
    render() {
        return layoutBase(`
            <h2>Sobre o projeto</h2>

            <p>
                O Moravix é um app criado para acessibilidade visual, conversão de imagens e preparação de artes para fluxos de corte.
            </p>

            <div class="bloco-conversor">
                <h3>Objetivo</h3>

                <p>
                    Ajudar pessoas a converter imagens para PNG, JPG e PDF, além de preparar imagens em alto contraste, preto e branco, silhueta preta e fundo transparente.
                </p>
            </div>

            <div class="bloco-conversor">
                <h3>Preparação para Silhouette</h3>

                <p>
                    O app permite preparar imagens para importar no Silhouette Studio e rastrear para uso em máquinas de corte.
                </p>

                <p class="texto-secundario">
                    PNG e JPG podem precisar de rastreio/trace dentro do Silhouette Studio para criar linhas de corte.
                </p>
            </div>

            <div class="bloco-conversor">
                <h3>Acessibilidade</h3>

                <p>
                    O projeto também possui recursos para baixa visão, como aumento de fonte, alto contraste e modo foco.
                </p>
            </div>

            <div class="bloco-conversor">
                <h3>Criador</h3>

                <p>
                    Criado por <strong>${appConfig.criador}</strong>.
                </p>

                <p class="texto-secundario">
                    ${appConfig.copyright}
                </p>

                <p class="texto-secundario">
                    Versão ${appConfig.versao}
                </p>
            </div>

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
    }
};