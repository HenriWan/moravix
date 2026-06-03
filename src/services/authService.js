import { supabase } from "../supabaseClient.js";

export async function getSession() {
    const { data } = await supabase.auth.getSession();

    return data.session;
}

export async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw error;
    }

    return data.user;
}

export async function cadastrarUsuario({ nome, email, senha }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
            data: {
                nome
            }
        }
    });

    if (error) {
        throw error;
    }

    return data;
}

export async function entrarUsuario({ email, senha }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
    });

    if (error) {
        throw error;
    }

    return data;
}

export async function sairUsuario() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}

export async function buscarPerfil() {
    const user = await getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("nome, email")
        .eq("id", user.id)
        .single();

    if (error) {
        return {
            nome: user.email,
            email: user.email
        };
    }

    return data;
}