import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useScale } from "../../../../../utils/scale";
import { Text, View } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { getRadius } from "../../_utils/getRadius";

const MarkerMemo = memo(({ point, scale }) => {
    return (
        <Marker
            coordinate={point.coordinate}
            anchor={{ y: 0.5 }}
            tracksViewChanges={false}
        >
            <View
                renderToHardwareTextureAndroid
                style={{
                    backgroundColor: '#00000099',
                    padding: scale(7),
                    borderRadius: scale(20),
                    minWidth: scale(30),
                }}
            >
                <Text
                    style={{
                        color: '#fff',
                        fontSize: scale(14),
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}
                >
                    {point.rank}
                </Text>
            </View>
        </Marker>
    );
});

const EPS = {
    lat: 0.0001,
    lng: 0.0001,
    delta: 0.0005,
};

const hasRegionChanged = (a, b) => {
    if (!a || !b) return true;

    return (
        Math.abs(a.latitude - b.latitude) > EPS.lat ||
        Math.abs(a.longitude - b.longitude) > EPS.lng ||
        Math.abs(a.latitudeDelta - b.latitudeDelta) > EPS.delta ||
        Math.abs(a.longitudeDelta - b.longitudeDelta) > EPS.delta
    );
};

export const HeatMap = ({
    mapPoints,
    selectedRegion,
    setSelectedRegion
}) => {
    const scale = useScale();
    const mapRef = useRef(null);
    const regionRef = useRef(selectedRegion);

    useEffect(() => {
        // quando região vem "de fora" (ex.: clique na tabela), anima o mapa
        if (!mapRef.current || !selectedRegion) return;

        if (hasRegionChanged(regionRef.current, selectedRegion)) {
            mapRef.current.animateToRegion(selectedRegion, 500);
            regionRef.current = selectedRegion;
        }
    }, [selectedRegion]);

    const formattedPoints = useMemo(() => {
        return mapPoints.map((point) => ({
            ...point,
            coordinate: {
                latitude: point.latitude,
                longitude: point.longitude,
            },
            radius: getRadius(point.area),
        }));
    }, [mapPoints]);

    const handleRegionChange = useCallback((region) => {
        // guarda estado local do mapa sem rerender
        regionRef.current = region;

        // só atualiza estado global quando realmente mudou
        if (hasRegionChanged(region, selectedRegion)) {
            setSelectedRegion(region);
        }
    }, [selectedRegion, setSelectedRegion]);

    const shouldRenderMarkers = useMemo(() => {
        return selectedRegion.latitudeDelta < 0.05;
    }, [selectedRegion.latitudeDelta]);

    return (
        <View
            renderToHardwareTextureAndroid
            style={{
                height: scale(300),
                borderRadius: scale(8),
                overflow: 'hidden',
                borderColor: '#bfbfbf',
                borderWidth: scale(1),
            }}
        >
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={selectedRegion}
                customMapStyle={[
                    {
                        featureType: 'poi',
                        stylers: [{ visibility: 'off' }]
                    }
                ]}
                onRegionChangeComplete={handleRegionChange}
                loadingEnabled
                moveOnMarkerPress={false}
                showsCompass={false}
                showsBuildings={false}
                showsTraffic={false}
                showsIndoors={false}
                toolbarEnabled={false}
            >
                {formattedPoints.map((point, index) => (
                    <Circle
                        key={`circle-${index}`}
                        center={point.coordinate}
                        radius={point.radius}
                        fillColor="rgba(255, 0, 0, 0.3)"
                        strokeWidth={0}
                    />
                ))}

                {shouldRenderMarkers &&
                    formattedPoints.map((point, index) => (
                        <MarkerMemo
                            key={`marker-${index}`}
                            point={point}
                            scale={scale}
                        />
                    ))
                }
            </MapView>
        </View>
    );
};

export default memo(HeatMap);