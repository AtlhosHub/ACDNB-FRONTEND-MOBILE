import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { getAniversariantes, getGraphData, getTotalAtivo, getCensoRank } from '../_utils/apiRequests';
import { getTitle } from '../_components/dashboardKpi/utils/getTitle';
import { getIcon } from '../_components/dashboardKpi/utils/getIcon';

export const useDashboardData = (refreshKey) => {
    const [alunos, setAlunos] = useState([]);
    const [kpiList, setKpiList] = useState([]);
    const [dashboardData, setDashboardData] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [mapDataLoading, setMapDataLoading] = useState(false);
    const [mapDataEmpty, setMapDataEmpty] = useState(false);

    const buildKpi = useCallback(async (graphData) => {
        if (graphData.length === 0) {
            setKpiList([]);
            return;
        }

        const totalAtivo = await getTotalAtivo();
        const actualMonthData = graphData.find(item => item.mes === new dayjs().month() + 1);

        let kpiRawData = {
            alunos: { value: totalAtivo },
            pagDesconto: { value: actualMonthData?.pagos_com_desconto || 0 },
            pagAtrasados: { value: actualMonthData?.atrasados || 0 },
        };

        const formattedResponse = [];
        for (const key in kpiRawData) {
            formattedResponse.push({
                title: getTitle(key),
                icon: getIcon(key),
                value: kpiRawData[key].value,
            });
        }

        setKpiList(formattedResponse);
    }, []);

    const buildGraph = useCallback(async (graphData) => {
        if (graphData.length === 0) {
            setDashboardData([]);
            return;
        }
        setDashboardData(graphData);
    }, []);

    const buildAniversariantes = useCallback(async () => {
        const response = await getAniversariantes();
        if (response.length === 0) {
            setAlunos([]);
            return;
        }
        setAlunos(response);
    }, []);

    const buildMapData = useCallback(async () => {
        try {
            setMapDataLoading(true);
            setMapDataEmpty(false);

            const response = await getCensoRank();

            if (response.length === 0) {
                setMapData([]);
                setMapDataEmpty(true);
            } else {
                setMapData(response);
                setMapDataEmpty(false);
            }
        } finally {
            setMapDataLoading(false);
        }
    }, []);

    const initialize = useCallback(async () => {
        const graphData = await getGraphData();

        try {
            await buildGraph(graphData);
        } catch (error) {
            console.error('Erro ao carregar gráfico:', error);
        }

        try {
            await buildKpi(graphData);
        } catch (error) {
            console.error('Erro ao carregar KPI:', error);
        }

        try {
            await buildAniversariantes();
        } catch (error) {
            console.error('Erro ao carregar aniversariantes:', error);
        }

        try {
            await buildMapData();
        } catch (error) {
            console.error('Erro ao carregar dados do mapa:', error);
        }
    }, [buildGraph, buildKpi, buildAniversariantes, buildMapData]);

    useEffect(() => {
        initialize();
    }, [refreshKey, initialize]);

    return {
        alunos,
        kpiList,
        dashboardData,
        mapData,
        mapDataLoading,
        mapDataEmpty,
    };
};
