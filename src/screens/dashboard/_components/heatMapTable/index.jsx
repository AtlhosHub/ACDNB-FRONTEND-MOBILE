import { View, Text, Pressable } from "react-native"
import { useScale } from "../../../../../utils/scale";
import { getLatitudeDelta } from "../../_utils/getRadius";

export const HeatMapTable = ({ tableData, setDefaultRegion }) => {
    const scale = useScale();

    const header = [
        { texto: 'Ranque', largura: 2 },
        { texto: 'Bairro', largura: 5 },
        { texto: 'Pontuação', largura: 2 }
    ]

    return (
        <View
            style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
                borderRadius: scale(12),
                overflow: 'hidden',
                marginTop: scale(10)
            }}
        >
            {/* ====== HEADER ====== */}
            <View
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: scale(10),
                    paddingVertical: scale(10),
                    backgroundColor: '#e9e9e9'
                }}
            >
                {header.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            flex: item.largura,
                            justifyContent: 'center',
                            alignItems: index === 0 || index === 2 ? 'center' : 'flex-start'
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: '#0D3C53',
                                textAlign: index === 0 || index === 2 ? 'center' : 'auto'
                            }}
                        >
                            {item.texto}
                        </Text>
                    </View>
                ))}
            </View>

            {tableData.length > 0 &&
                <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} />
            }

            {tableData.map((row, index) => (
                <Pressable
                    onTouchStart={() => {
                        setDefaultRegion({
                            latitude: row.latitude,
                            longitude: row.longitude,
                            latitudeDelta: getLatitudeDelta(row.area),
                            longitudeDelta: getLatitudeDelta(row.area)
                        })
                    }}
                    key={index}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingVertical: scale(10),
                            paddingHorizontal: scale(10)
                        }}
                    >
                        <Text style={{ flex: header[0].largura, textAlign: 'center' }}>{row.rank}</Text>
                        <Text style={{ flex: header[1]?.largura, textTransform: 'uppercase' }}>{row.nome}</Text>
                        <Text style={{ flex: header[2]?.largura, textAlign: 'center', fontFamily: 'Poppins_600SemiBold' }}>{row.points}</Text>
                    </View>
                    {index !== tableData.length - 1 &&
                        <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} />
                    }
                </Pressable>
            ))}

        </View >
    )
}