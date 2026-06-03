import { buscarPerfil, sairUsuario } from "../services/authService.js";
import { layoutBase, ativarRecursosLayout } from "../utils/ui.js";
import { navegar } from "../router.js";

export const painelPage = {
    render() {
        return layoutBase(`
            <h2 id="saudacaoPainel">Olá!</h2>

            <p class="texto-secundario">
                Escolha um conversor.
            </p>

            <div class="lista-conversores">
                <button class="conversor-item" data-rota="/converter">
                    <span>🖼️</span>
                    <div>
                        <strong>Imagem para PNG, JPG ou PDF</strong>
                        <small>Converta fotos, prints e imagens.</small>
                    </div>
                </button>

                <button class="conversor-item" data-rota="/silhouette">
                    <span>✂️</span>
                    <div>
                        <strong>Imagem para Silhouette Studio</strong>
                        <small>Prepare imagem para importar, rastrear e criar linha de corte no Silhouette Studio.</small>
                    </div>
                </button>

                <button class="conversor-item" data-conversor-breve="word-pdf">
                    <span>📄</span>
                    <div>
                        <strong>Word para PDF</strong>
                        <small>Conversor de documento Word para PDF.</small>
                    </div>
                </button>

                <button class="conversor-item" data-conversor-breve="pdf-word">
                    <span>📝</span>
                    <div>
                        <strong>PDF para Word</strong>
                        <small>Conversor de PDF para documento editável.</small>
                    </div>
                </button>

                <button class="conversor-item" data-conversor-breve="pdf-imagem">
                    <span>📷</span>
                    <div>
                        <strong>PDF para imagem</strong>
                        <small>Transformar páginas de PDF em imagem.</small>
                    </div>
                </button>
            </div>

            <p id="msgPainel" class="mensagem"></p>

            <button id="btnSair" class="botao botao-perigo">
                Sair
            </button>

            <div class="links-menores-painel">
                <button id="btnBaixaVisao" class="link-menor">
                    Modo baixa visão
                </button>

                <button id="btnSobre" class="link-menor">
                    Sobre o projeto
                </button>
            </div>
        `, {
            assistente: true
        });
    },

    async afterRender() {
        ativarRecursosLayout({
            assistente: true
        });

        const perfil = await buscarPerfil();

        if (perfil?.nome) {
            document.getElementById("saudacaoPainel").textContent = `Olá, ${perfil.nome}!`;
        }

        document.querySelectorAll("[data-rota]").forEach((botao) => {
            botao.addEventListener("click", () => {
                navegar(botao.dataset.rota);
            });
        });

        document.querySelectorAll("[data-conversor-breve]").forEach((botao) => {
            botao.addEventListener("click", () => {
                const msg = document.getElementById("msgPainel");

                msg.textContent = "Esse conversor será ativado em uma próxima fase com backend próprio.";
                msg.className = "mensagem alerta";
            });
        });

        document.getElementById("btnBaixaVisao").addEventListener("click", () => {
            navegar("/acessibilidade");
        });

        document.getElementById("btnSobre").addEventListener("click", () => {
            navegar("/sobre");
        });

        document.getElementById("btnSair").addEventListener("click", async () => {
            await sairUsuario();
            navegar("/");
        });
    }
};