import { useScale } from '../../../utils/scale'
import { getIcon } from './_components/dashboardKpi/utils/getIcon';
import { getTitle } from './_components/dashboardKpi/utils/getTitle';

import DashboardHeader from './_components/dashboardHeader'
import StackedChart from './_components/stackedChart'
import DashboardKpi from './_components/dashboardKpi';
import { View, ScrollView, Text } from 'react-native'
import GraphLabel from './_components/graphLabel';
import HeatMap from './_components/heatMap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { HeatMapTable } from './_components/heatMapTable';
import { ListaAniversariante } from './_components/listaAniversariante';
import { getAniversariantes, getGraphData, getTotalAtivo, getCensoRank } from './_utils/apiRequests';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

export default function DashboardScreen() {
    const scale = useScale();
    const { t } = useTranslation();

    const [alunos, setAlunos] = useState([]);
    const [kpiList, setKpiList] = useState([]);
    const [dashboardData, setDashboardData] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const didMountRef = useRef(false);

    useFocusEffect(
        useCallback(() => {
            if (didMountRef.current) {
                setRefreshKey((k) => k + 1);
            }
            didMountRef.current = true;
        }, []),
    );

    const [mapData, setMapData] = useState([]);

    const [region, setRegion] = useState({
        latitude: -23.5558,
        longitude: -46.6358,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const buildKpi = async (graphData) => {
        if (graphData.length === 0) {
            setKpiList([]);
        }

        const totalAtivo = await getTotalAtivo();

        const actualMonthData = graphData.find(item => item.mes === new dayjs().month() + 1);

        let kpiRawData = {
            alunos: { value: totalAtivo },
            pagDesconto: { value: actualMonthData?.pagos_com_desconto || 0 },
            pagAtrasados: { value: actualMonthData?.atrasados || 0 },
        }

        const formattedResponse = []

        for (const key in kpiRawData) {
            formattedResponse.push({
                title: getTitle(key),
                icon: getIcon(key),
                value: kpiRawData[key].value,
            })
        }

        setKpiList(formattedResponse)
    }

    const buildGraph = async (graphData) => {
        if (graphData.length === 0) {
            setDashboardData([]);
        }

        setDashboardData(graphData);
    }

    const buildAniversariantes = async () => {
        const response = await getAniversariantes();

        if (response.length === 0) {
            setAlunos([]);
        }

        setAlunos(response);
    }

    const buildMapData = async () => {
        const response = await getCensoRank();

        if (response.length === 0) {
            setMapData([]);
        }

        setMapData(response);
    }

    const initliaze = async () => {
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
    }

    useEffect(() => {
        initliaze();
    }, [refreshKey])

    return (
        <ScrollView
            contentContainerStyle={{
                paddingBottom: scale(20)
            }}
            bounces={false}
            overScrollMode="never"
        >
            <DashboardHeader />
            <View style={{ backgroundColor: '#286DA8', height: scale(50) }} />

            <View style={{ marginTop: scale(-40) }}>
                <ScrollView
                    style={{
                        paddingBottom: scale(3),
                    }}
                    contentContainerStyle={{
                        paddingHorizontal: scale(10),
                        gap: scale(15),
                    }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={true}
                >
                    <DashboardKpi
                        kpiData={kpiList[0]}
                    />
                    <DashboardKpi
                        kpiData={kpiList[1]}
                    />
                    <DashboardKpi
                        kpiData={kpiList[2]}
                    />

                </ScrollView>
            </View>

            <View
                style={{
                    marginHorizontal: scale(20),
                    marginTop: scale(20),
                    gap: scale(20)
                }}
            >
                <View
                    style={{
                        gap: scale(15)
                    }}
                >
                    <View>
                        <Text
                            style={{
                                color: '#111827',
                                fontSize: scale(17),
                                fontFamily: 'Poppins_600SemiBold',
                            }}>
                            {t('dashboard.statusPagamentoAnual')}
                        </Text>

                        <View style={{ flexDirection: 'row', gap: scale(15) }}>
                            <GraphLabel text={t('dashboard.pago')} color="#286DA8" textColor="#111827" />
                            <GraphLabel text={t('dashboard.pagoComDesconto')} color="#FFAE03" textColor="#111827" />
                            <GraphLabel text={t('dashboard.emAtraso')} color="#CF3333" textColor="#111827" />
                        </View>
                    </View>

                    <StackedChart
                        data={dashboardData}
                    />
                </View>

                <View>
                    <Text
                        style={{
                            color: '#111827',
                            fontSize: scale(17),
                            fontFamily: 'Poppins_600SemiBold',
                        }}>
                        {t('dashboard.topRegioes')}
                    </Text>

                    <HeatMap
                        mapPoints={mapData}
                        defaultRegion={region}
                        setDefaultRegion={setRegion}
                    />
                    <HeatMapTable
                        tableData={mapData}
                        setDefaultRegion={setRegion}
                    />
                </View>

                <View>
                    <Text
                        style={{
                            color: '#111827',
                            fontSize: scale(17),
                            fontFamily: 'Poppins_600SemiBold',
                        }}>
                        {t('dashboard.aniversariantes')}
                    </Text>
                    <ListaAniversariante
                        alunos={alunos}
                    />
                </View>
            </View>
        </ScrollView>
    )
}