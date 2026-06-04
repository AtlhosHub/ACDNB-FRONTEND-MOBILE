import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useScale } from '../../../../../utils/scale';
import SystemIcons from '../../../../components/systemIcons';
import { shadowBoxStyle } from '../..';

interface DashboardKpiProps {
    title: string;
    icon?: string;
    value: string;
}

export default function DashboardKpi({ kpiData }: { kpiData: DashboardKpiProps | null }) {
    const scale = useScale();

    return (
        <View
            style={[
                styles.container,
                shadowBoxStyle.shadowBox,
                {
                    paddingVertical: scale(10),
                    paddingHorizontal: scale(10),
                    borderRadius: scale(15),
                    minWidth: scale(180),
                    minHeight: scale(81),
                }
            ]}
        >
            {kpiData ? (
                <View>
                    <Text style={[styles.title, { fontSize: scale(15) }]}>
                        {kpiData.title}
                    </Text>
                    <View style={{ alignItems: 'center', flexDirection: 'row', gap: scale(4) }}>
                        {kpiData.icon && (
                            <SystemIcons
                                icon={kpiData.icon}
                                size={scale(30)}
                                color='#286DA8'
                            />
                        )}
                        <Text
                            style={[styles.value, { fontSize: scale(20), transform: [{ translateY: scale(1) }] }]}
                        >
                            {kpiData.value}
                        </Text>
                    </View>
                </View>
            ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <ActivityIndicator size='small' color='#286da8' />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        elevation: 3,
    },
    title: {
        color: '#111827',
        fontFamily: 'Poppins_600SemiBold',
    },
    value: {
        color: '#111827',
        fontFamily: 'Poppins_600SemiBold',
    },
});