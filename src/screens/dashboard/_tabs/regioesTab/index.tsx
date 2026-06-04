import { useTranslation } from "react-i18next";
import { Text, View } from "react-native"
import { useScale } from "../../../../../utils/scale";
import { useState } from "react";
import HeatMap from "../../_components/heatMap";
import { HeatMapTable } from "../../_components/heatMapTable";

export const RegioesTab = ({
    mapData,
    mapDataLoading,
    mapDataEmpty
}: {
    mapData: any[],
    mapDataLoading: boolean,
    mapDataEmpty: boolean
}) => {
    const scale = useScale();
    const { t } = useTranslation();

    const [region, setRegion] = useState({
        latitude: -23.5558,
        longitude: -46.6358,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    return (
        <View style={{
            marginHorizontal: scale(20),
        }}>
            <Text
                style={{
                    color: '#111827',
                    fontSize: scale(17),
                    fontFamily: 'Poppins_600SemiBold',
                }}>
                {t('dashboard.topRegioes')}
            </Text>

            {mapDataLoading ? (
                <Text
                    style={{
                        color: '#6B7280',
                        fontSize: scale(14),
                        fontFamily: 'Poppins_400Regular',
                        marginTop: scale(10),
                        textAlign: 'center',
                    }}>
                    Os dados estão carregando...
                </Text>
            ) : mapDataEmpty ? (
                <Text
                    style={{
                        color: '#6B7280',
                        fontSize: scale(14),
                        fontFamily: 'Poppins_400Regular',
                        marginTop: scale(10),
                        textAlign: 'center',
                        borderColor: '#6B7280',
                        borderWidth: 1,
                        borderRadius: scale(8),
                        padding: scale(10),
                    }}>
                    Não há dados o suficiente na base.
                </Text>
            ) : (
                <>
                    <HeatMap
                        mapPoints={mapData}
                        defaultRegion={region}
                        setDefaultRegion={setRegion}
                    />
                    <HeatMapTable
                        tableData={mapData}
                        setDefaultRegion={setRegion}
                    />
                </>
            )}
        </View>
    )
}