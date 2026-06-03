import { supabase } from "../supabaseClient.js";
import { appConfig } from "../config/appConfig.js";
import { getUser } from "./authService.js";

function limparNomeArquivo(nome) {
    return nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9.]+/g, "-")
        .replace(/-+/g, "-");
}

function removerExtensao(nome) {
    return nome.replace(/\.[^/.]+$/, "");
}

export async function salvarArquivo({
    blob,
    nomeOriginal,
    formatoOrigem,
    formatoSaida,
    categoria
}) {
    const user = await getUser();

    if (!user) {
        throw new Error("Usuário não autenticado.");
    }

    const base = limparNomeArquivo(removerExtensao(nomeOriginal || "arquivo"));
    const nomeArquivo = `${base}-${Date.now()}.${formatoSaida}`;
    const caminho = `${user.id}/${categoria}/${nomeArquivo}`;

    const { error: uploadError } = await supabase.storage
        .from(appConfig.bucket)
        .upload(caminho, blob, {
            contentType: blob.type,
            upsert: false
        });

    if (uploadError) {
        throw uploadError;
    }

    const { error: bancoError } = await supabase
        .from("arquivos")
        .insert({
            user_id: user.id,
            nome_original: nomeOriginal,
            formato_origem: formatoOrigem,
            formato_saida: formatoSaida,
            categoria,
            caminho_storage: caminho,
            nome_arquivo: nomeArquivo,
            tamanho_bytes: blob.size
        });

    if (bancoError) {
        throw bancoError;
    }

    return caminho;
}

export async function listarArquivos() {
    const { data, error } = await supabase
        .from("arquivos")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {
        throw error;
    }

    return data;
}

export async function criarLinkTemporario(caminho) {
    const { data, error } = await supabase.storage
        .from(appConfig.bucket)
        .createSignedUrl(caminho, 60);

    if (error) {
        throw error;
    }

    return data.signedUrl;
}

export async function apagarArquivo({ id, caminho }) {
    const { error: storageError } = await supabase.storage
        .from(appConfig.bucket)
        .remove([caminho]);

    if (storageError) {
        throw storageError;
    }

    const { error: bancoError } = await supabase
        .from("arquivos")
        .delete()
        .eq("id", id);

    if (bancoError) {
        throw bancoError;
    }
}