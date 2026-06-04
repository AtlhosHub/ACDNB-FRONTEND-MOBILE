import dayjs from 'dayjs';
import "dayjs/locale/pt-br";
import { View, Text } from 'react-native'
import { useScale } from '../../../../../utils/scale';
import ProfileButton from '../../../../components/ProfileButton';

dayjs.locale("pt-br");

export default function DashboardHeader() {
    const scale = useScale();

    const date = dayjs();
    const month =
        date.format('MMMM').charAt(0).toUpperCase() +
        date.format('MMMM').slice(1);
    const today = `${date.format('DD')} de ${month} de ${date.format('YYYY')}`;

    return (
        <View
            style={{
                width: '100%',
                paddingTop: scale(20),
                minHeight: scale(80),
                backgroundColor: '#286DA8',
            }}
        >
            <View
                style={{
                    width: '100%',
                    paddingTop: scale(20),
                    paddingHorizontal: scale(18),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <View style={{ width: scale(34) }} />
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text
                        style={{
                            fontFamily: 'Mohave_600SemiBold',
                            fontSize: scale(32),
                            color: '#F3F9F9',
                            transform: [{ translateY: scale(2.5) }],
                        }}
                    >
                        ACDNB
                    </Text>
                </View>

                <ProfileButton size={scale(34)} />
            </View>
            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    paddingBottom: scale(20)
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontFamily: 'Poppins_400Regular',
                        fontSize: scale(12),
                        transform: [{ translateY: scale(1) }],
                    }}
                >
                    {today}
                </Text>
            </View>
        </View>
    );
}