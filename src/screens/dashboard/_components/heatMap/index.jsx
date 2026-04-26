import { useState } from "react";
import { useScale } from "../../../../../utils/scale";
import { Text, View } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { getRadius } from "../../_utils/getRadius";

export const HeatMap = ({
    mapPoints,
    defaultRegion,
    setDefaultRegion
}) => {
    const scale = useScale();

    return (
        <View
            style={{
                height: scale(300),
                borderRadius: scale(8),
                overflow: 'hidden',
                borderColor: '#bfbfbf',
                borderWidth: scale(1),
            }}
            renderToHardwareTextureAndroid
        >
            <MapView
                style={{
                    flex: 1,
                }}
                initialRegion={defaultRegion}
                region={defaultRegion}
                customMapStyle={[
                    {
                        featureType: 'poi',
                        stylers: [{ visibility: 'off' }]
                    }
                ]}
                onRegionChangeComplete={(r) => setDefaultRegion(r)}
            >
                {mapPoints.map((point, index) => (
                    <View key={`point-${index}`} style={{ pointerEvents: 'none' }}>
                        <Circle
                            center={{
                                latitude: point.latitude,
                                longitude: point.longitude,
                            }}
                            radius={getRadius(point.area)}
                            fillColor="rgba(255, 0, 0, 0.3)"
                            strokeWidth={0}
                        />

                        {defaultRegion.latitudeDelta < 0.05 &&
                            <Marker
                                coordinate={{
                                    latitude: point.latitude,
                                    longitude: point.longitude,
                                }}
                                anchor={{ y: 0.5 }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#00000099',
                                        padding: scale(7),
                                        borderRadius: scale(20),
                                        minWidth: scale(30),
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: scale(14), textAlign: 'center', fontWeight: 'bold' }}>
                                        {point.rank}
                                    </Text>
                                </View>
                            </Marker>
                        }
                    </View>
                ))}
            </MapView>
        </View>
    )
}

export default HeatMap;