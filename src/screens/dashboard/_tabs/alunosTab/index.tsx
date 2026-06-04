import { ScrollView, Text, View } from "react-native"
import { useScale } from "../../../../../utils/scale";
import { useTranslation } from "react-i18next";
import DashboardKpi from "../../_components/dashboardKpi";
import GraphLabel from "../../_components/graphLabel";
import StackedChart from "../../_components/stackedChart";
import { ListaAniversariante } from "../../_components/listaAniversariante";

export const AlunosTab = ({
    kpiList,
    dashboardData,
    alunos
}: {
    kpiList: any[],
    dashboardData: any,
    alunos: any[]
}) => {
    const scale = useScale();
    const { t } = useTranslation();

    return (
        <View>
            <ScrollView
                style={{
                    paddingBottom: scale(20),
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

            <View
                style={{
                    marginHorizontal: scale(20),
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
                        {t('dashboard.aniversariantes')}
                    </Text>
                    <ListaAniversariante
                        alunos={alunos}
                    />
                </View>
            </View>
        </View>
    )
}