import { api } from "../../../../api";
import { DificuldadePayload, OcorrenciaProps } from "../_tabs/dificuldadesTab/DificuldadesProps";

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
        const mappedData = response.data.map((item: any) => ({
            ...item,
            area: item.points,
            points: item.points.toFixed(2)
        }));
        return mappedData;
    } catch (error) {
        console.error('Erro ao buscar ranking do censo:', error);
        throw error;
    }
}

// TODO: endpoint para buscar dados de dificuldade
export const getDificuldade = async (payload: DificuldadePayload): Promise<OcorrenciaProps[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulando atraso pra ver o spinning lá nos componentes
    try {
        const response = await api.post('/dificuldades', payload);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados de dificuldade:', error);
        throw error;
    }
}