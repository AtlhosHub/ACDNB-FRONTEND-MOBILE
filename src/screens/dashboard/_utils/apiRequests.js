import { api } from "../../../../api";

const authToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGFkbS5jb20iLCJpYXQiOjE3NzcxNjMzMDgsImV4cCI6MTc3NzE3MDUwOH0.RBaz7QMaO1Zfa9m7D_uZn1YiIwAi-KHqK2xs1G9feBJ2pACGgUNTQdhnHl61oIVfzuWvQRJX-FwrSHFutxy3jQ"

export const getAniversariantes = async () => {
    try {
        const response = await api.get('/alunos/aniversariantes', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar aniversariantes:', error);
        throw error;
    }
}

export const getGraphData = async () => {
    try {
        const response = await api.get('/mensalidades/grafico', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        throw error;
    }
}

export const getTotalAtivo = async () => {
    try {
        const response = await api.get('/alunos/totalAtivo', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar total de alunos ativos:', error);
        throw error;
    }
}