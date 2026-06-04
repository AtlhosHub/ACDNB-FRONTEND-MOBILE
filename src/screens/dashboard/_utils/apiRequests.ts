import { api } from "../../../../api";
import { DificuldadePayload } from "../_tabs/dificuldadesTab/DificuldadesProps";

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
export const getDificuldade = async (payload: DificuldadePayload) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulando atraso pra ver o spinning lá nos componentes
    try {
        // const response = await api.get('/dificuldade/ocorrencia', { params: payload });
        const response = {
            data: {
                ocorrencias: [
                    { nome: "Saque", ocorrencias: 120 },
                    { nome: "Backhand", ocorrencias: 90 },
                    { nome: "Forehand", ocorrencias: 60 },
                    { nome: "Voleio", ocorrencias: 30 },
                    { nome: "Pateta", ocorrencias: 40 },
                ],
                sugestao: "O foco nos treinos de Saque e Backhand deve ser priorizado na próxima semana para 40% dos alunos ativos."
            }
        }
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados de dificuldade:', error);
        throw error;
    }
}