import { api } from "../../../../api";

const authToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGFkbS5jb20iLCJpYXQiOjE3NzcxNjQzMzIsImV4cCI6MTc3NzE3MTUzMn0.S0ciRJL-iv2dzLGI-UhZlaZASdBGpdZq8IbmTeX0--pJgVy0SeSodU7Ej90EVrW9FB3Lpu3WPDiYQfgSdWJVpw"

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