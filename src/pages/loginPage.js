import { entrarUsuario } from "../services/authService.js";
import { ativarOlhosSenha, layoutBase, setMensagem } from "../utils/ui.js";
import { navegar } from "../router.js";

export const loginPage = {
    render() {
        return layoutBase(`
            <h2>Entrar</h2>

            <p class="texto-secundario">
                Acesse sua conta.
            </p>

            <form id="formLogin">
                <label for="loginEmail">E-mail</label>
                <input 
                    id="loginEmail" 
                    type="email" 
                    placeholder="Digite seu e-mail" 
                    autocomplete="email"
                >

                <label for="loginSenha">Senha</label>

                <div class="campo-senha">
                    <input 
                        id="loginSenha" 
                        type="password" 
                        placeholder="Digite sua senha" 
                        autocomplete="current-password"
                    >

                    <button 
                        type="button" 
                        class="botao-olho" 
                        data-alvo="loginSenha" 
                        aria-label="Mostrar ou ocultar senha"
                    >
                        <span class="olho-aberto">👁️</span>
                        <span class="olho-fechado">🙈</span>
                    </button>
                </div>

                <button class="botao botao-principal" type="submit">
                    Entrar
                </button>
            </form>

            <p id="msgLogin" class="mensagem"></p>

            <button id="btnIrCadastro" class="link-botao">
                Não tenho conta. Criar cadastro
            </button>

            <button id="btnVoltarInicio" class="link-botao">
                Voltar
            </button>
        `);
    },

    afterRender() {
        ativarOlhosSenha();

        document.getElementById("btnIrCadastro").addEventListener("click", () => {
            navegar("/cadastro");
        });

        document.getElementById("btnVoltarInicio").addEventListener("click", () => {
            navegar("/");
        });

        document.getElementById("formLogin").addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const senha = document.getElementById("loginSenha").value;

            if (!email || !senha) {
                setMensagem("msgLogin", "Digite e-mail e senha.", "erro");
                return;
            }

            try {
                setMensagem("msgLogin", "Entrando...", "alerta");

                await entrarUsuario({
                    email,
                    senha
                });

                navegar("/painel");
            } catch (erro) {
                setMensagem("msgLogin", erro.message, "erro");
            }
        });
    }
};