import { api } from "../../../../api";

export const getAniversariantes = async () => {
    try {
        const response = await api.get('/alunos/aniversariantes');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar aniversariantes:', error);
        throw error;
    }
}

export const getGraphData = async () => {
    try {
        const response = await api.get('/mensalidades/grafico');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        throw error;
    }
}

export const getTotalAtivo = async () => {
    try {
        const response = await api.get('/alunos/totalAtivo');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar total de alunos ativos:', error);
        throw error;
    }
}

export const getCensoRank = async () => {
    try {
        const response = await api.get('/censo/ranking');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar ranking do censo:', error);
        throw error;
    }
}