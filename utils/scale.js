import { useWindowDimensions } from "react-native";

export function useScale() {
    const { width: screenWidth } = useWindowDimensions();

    return (size) => (screenWidth / 375) * size;
}