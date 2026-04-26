import { View, Text, StyleSheet } from 'react-native'
import { useScale } from '../../../../../utils/scale';
import SystemIcons from '../../../../components/systemIcons';

export default function DashboardKpi({ title, icon, value }) {
    const scale = useScale();

    return (
        <View
            style={
                [styles.container,
                {
                    paddingVertical: scale(10),
                    paddingHorizontal: scale(10),
                    borderRadius: scale(15),
                    minWidth: scale(180),
                }
                ]}
        >
            <Text style={[styles.title, { fontSize: scale(15) }]}>
                {title}
            </Text>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: scale(4) }}>
                {icon && (
                    <SystemIcons
                        icon={icon}
                        size={scale(30)}
                        color='#286DA8'
                    />
                )}
                <Text
                    style={[styles.value, { fontSize: scale(20), transform: [{ translateY: scale(1) }] }]}
                >
                    {value}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
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