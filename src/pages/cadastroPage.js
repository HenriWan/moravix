import { cadastrarUsuario } from "../services/authService.js";
import { ativarOlhosSenha, layoutBase, setMensagem } from "../utils/ui.js";
import { navegar } from "../router.js";

export const cadastroPage = {
    render() {
        return layoutBase(`
            <h2>Criar conta</h2>

            <p class="texto-secundario">
                Crie sua conta para acessar o app.
            </p>

            <form id="formCadastro">
                <label for="cadastroNome">Nome de usuário</label>
                <input 
                    id="cadastroNome" 
                    type="text" 
                    placeholder="Digite seu nome" 
                    autocomplete="name"
                >

                <label for="cadastroEmail">E-mail</label>
                <input 
                    id="cadastroEmail" 
                    type="email" 
                    placeholder="Digite seu e-mail" 
                    autocomplete="email"
                >

                <label for="cadastroSenha">Senha</label>

                <div class="campo-senha">
                    <input 
                        id="cadastroSenha" 
                        type="password" 
                        placeholder="Crie uma senha" 
                        autocomplete="new-password"
                    >

                    <button 
                        type="button" 
                        class="botao-olho" 
                        data-alvo="cadastroSenha" 
                        aria-label="Mostrar ou ocultar senha"
                    >
                        <span class="olho-aberto">👁️</span>
                        <span class="olho-fechado">🙈</span>
                    </button>
                </div>

                <label for="cadastroConfirmar">Confirmar senha</label>

                <div class="campo-senha">
                    <input 
                        id="cadastroConfirmar" 
                        type="password" 
                        placeholder="Repita a senha" 
                        autocomplete="new-password"
                    >

                    <button 
                        type="button" 
                        class="botao-olho" 
                        data-alvo="cadastroConfirmar" 
                        aria-label="Mostrar ou ocultar senha"
                    >
                        <span class="olho-aberto">👁️</span>
                        <span class="olho-fechado">🙈</span>
                    </button>
                </div>

                <button class="botao botao-principal" type="submit">
                    Criar conta
                </button>
            </form>

            <p id="msgCadastro" class="mensagem"></p>

            <button id="btnLogin" class="link-botao">
                Já tenho conta
            </button>
        `);
    },

    afterRender() {
        ativarOlhosSenha();

        document.getElementById("btnLogin").addEventListener("click", () => {
            navegar("/login");
        });

        document.getElementById("formCadastro").addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const nome = document.getElementById("cadastroNome").value.trim();
            const email = document.getElementById("cadastroEmail").value.trim();
            const senha = document.getElementById("cadastroSenha").value;
            const confirmar = document.getElementById("cadastroConfirmar").value;

            if (!nome || !email || !senha || !confirmar) {
                setMensagem("msgCadastro", "Preencha todos os campos.", "erro");
                return;
            }

            if (senha.length < 6) {
                setMensagem("msgCadastro", "A senha precisa ter pelo menos 6 caracteres.", "erro");
                return;
            }

            if (senha !== confirmar) {
                setMensagem("msgCadastro", "As senhas não são iguais.", "erro");
                return;
            }

            try {
                setMensagem("msgCadastro", "Criando conta...", "alerta");

                await cadastrarUsuario({
                    nome,
                    email,
                    senha
                });

                setMensagem("msgCadastro", "Conta criada. Agora faça login.", "sucesso");

                setTimeout(() => {
                    navegar("/login");
                }, 1200);
            } catch (erro) {
                setMensagem("msgCadastro", erro.message, "erro");
            }
        });
    }
};