import { Text, TouchableOpacity, View } from "react-native";
import { TabProps } from "./TabProps";
import { useScale } from "../../../../../utils/scale";
import { shadowBoxStyle } from "../..";

export const TabNavigator = ({
    tab, setTab, TABS
}: {
    tab: string;
    setTab: (id: string) => void;
    TABS: TabProps[]
}) => {
    const scale = useScale();

    return (
        <View
            accessibilityRole="tablist"
            style={[
                shadowBoxStyle.shadowBox,
                {
                    marginHorizontal: scale(20),
                    flexDirection: "row",
                    gap: scale(4),
                    borderRadius: scale(16),
                    borderWidth: scale(1),
                    borderColor: "#dee2e6",
                    backgroundColor: "#fff",
                    padding: scale(4),
                    elevation: 4
                }
            ]}
        >
            {
                TABS.map((t) => {
                    const active = tab === t.id;

                    return (
                        <TouchableOpacity
                            key={t.id}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: active }}
                            onPress={() => setTab(t.id)}
                            style={{
                                flex: 1,
                                borderRadius: scale(12),
                                paddingVertical: scale(10),
                                alignItems: "center",
                                backgroundColor: active ? "#286DA8" : "transparent",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: scale(14),
                                    fontWeight: "600",
                                    color: active ? "#fff" : "#6c757d",
                                }}
                            >
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })
            }
        </View >
    )
}