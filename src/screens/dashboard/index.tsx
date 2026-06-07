import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import DashboardHeader from './_components/dashboardHeader'
import { TabNavigator } from './_components/tabNavigator';
import { useFocusEffect } from '@react-navigation/native';
import { useScale } from '../../../utils/scale'
import { AlunosTab } from './_tabs/alunosTab';
import { RegioesTab } from './_tabs/regioesTab';
import { DificuldadesTab } from './_tabs/dificuldadesTab';
import { useDashboardData } from './_hooks/useDashboardData';

const TABS = [
    { id: "alunos", label: "Alunos" },
    { id: "regioes", label: "Regiões" },
    { id: "dificuldades", label: "Dificuldades" },
];

export default function DashboardScreen() {
    const scale = useScale();

    const [tab, setTab] = useState(TABS[0].id);
    const [refreshKey, setRefreshKey] = useState(0);
    const didMountRef = useRef(false);

    const {
        alunos,
        kpiList,
        dashboardData,
        mapData,
        mapDataLoading,
        mapDataEmpty
    } = useDashboardData(refreshKey);

    useFocusEffect(
        useCallback(() => {
            if (didMountRef.current) {
                setRefreshKey((k) => k + 1);
            }
            didMountRef.current = true;
        }, []),
    );

    return (
        <ScrollView
            contentContainerStyle={{
                paddingBottom: scale(20),
                gap: scale(20)
            }}
            bounces={false}
            overScrollMode="never"
        >
            <DashboardHeader />

            <TabNavigator
                tab={tab}
                setTab={setTab}
                TABS={TABS}
            />

            {tab === "alunos" &&
                <AlunosTab
                    kpiList={kpiList}
                    dashboardData={dashboardData}
                    alunos={alunos} />
            }
            {tab === "regioes" &&
                <RegioesTab
                    mapData={mapData}
                    mapDataLoading={mapDataLoading}
                    mapDataEmpty={mapDataEmpty}
                />
            }
            {tab === "dificuldades" &&
                <DificuldadesTab />
            }
        </ScrollView>
    )
}

export const shadowBoxStyle = StyleSheet.create({
    shadowBox: {
        shadowColor: '#286DA8',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3
    }
})