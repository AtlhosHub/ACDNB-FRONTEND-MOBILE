import { View, Text, StyleSheet } from 'react-native'
import { useScale } from '../../../../../utils/scale';

export default function GraphLabel({ text, color, textColor = '#111827' }) {
    const scale = useScale();

    return (
        <View style={[styles.container, { gap: scale(3) }]}>
            <View style={{ backgroundColor: color ?? '#000000', width: scale(15), height: scale(15) }} />
            <Text style={[styles.text, { color: textColor, fontSize: scale(12) }]}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        backgroundColor: 'transparent',
    },
});