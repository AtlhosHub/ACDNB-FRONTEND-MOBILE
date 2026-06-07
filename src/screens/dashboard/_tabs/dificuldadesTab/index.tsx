import { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useScale } from "../../../../../utils/scale";
import { getDificuldade } from "../../_utils/apiRequests";
import dayjs from "dayjs";
import { OcorrenciaProps } from "./DificuldadesProps";

const MESES = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

const ANOS = ["2023", "2024", "2025", "2026"];

export function DificuldadesTab() {
    const scale = useScale();

    const [mes, setMes] = useState<string>(MESES[dayjs().month()]);
    const [ano, setAno] = useState<string>(dayjs().year().toString());
    const [max, setMax] = useState(0);

    const [ocorrencia, setOcorrencia] = useState<OcorrenciaProps[]>([]);
    const [sugestao, setSugestao] = useState<string>("");
    const [fetchingData, setFetchingData] = useState<boolean>(false);

    const buildDificuldades = async () => {
        setFetchingData(true);

        const payload = {
            mes: MESES.indexOf(mes) + 1,
            ano: parseInt(ano),
        }

        const response = await getDificuldade(payload);

        setOcorrencia(response);

        if (response.length > 0) {
            setMax(Math.max(
                ...response.map((d: OcorrenciaProps) => d.numOcorrencias)
            ));
        }

        setFetchingData(false);
    }

    useEffect(() => {
        buildDificuldades();
    }, [])

    useEffect(() => {
        buildDificuldades();
    }, [mes, ano])

    return (
        <View
            style={{
                gap: scale(20),
                marginHorizontal: scale(20),
            }}
        >
            <Text
                style={{
                    fontSize: scale(17),
                    fontFamily: 'Poppins_600SemiBold',
                    color: '#111827',
                }}
            >
                Principais ocorrencia dos Alunos
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    gap: scale(12),
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: scale(11),
                            fontFamily: 'Poppins_600SemiBold',
                            textTransform: "uppercase",
                            color: "#6c757d",
                        }}
                    >
                        Mês
                    </Text>

                    <View
                        style={{
                            borderWidth: scale(1),
                            borderColor: "#dee2e6",
                            borderRadius: scale(12),
                            backgroundColor: "#fff",
                            overflow: "hidden",
                        }}
                    >
                        <Picker
                            selectedValue={mes}
                            onValueChange={(value) => setMes(value)}
                            enabled={!fetchingData}
                        >
                            {MESES.map((m) => (
                                <Picker.Item
                                    key={m}
                                    label={m}
                                    value={m}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: scale(11),
                            fontFamily: 'Poppins_600SemiBold',
                            textTransform: "uppercase",
                            color: "#6c757d",
                        }}
                    >
                        Ano
                    </Text>

                    <View
                        style={{
                            borderWidth: scale(1),
                            borderColor: "#dee2e6",
                            borderRadius: scale(12),
                            backgroundColor: "#fff",
                            overflow: "hidden",
                        }}
                    >
                        <Picker
                            selectedValue={ano}
                            onValueChange={(value) => setAno(value)}
                            enabled={!fetchingData}
                        >
                            {ANOS.map((a) => (
                                <Picker.Item
                                    key={a}
                                    label={a}
                                    value={a}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>
            </View>

            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: scale(16),
                    borderWidth: scale(1),
                    borderColor: "#dee2e6",
                    padding: scale(20),
                    gap: scale(16),
                    minHeight: scale(150),
                }}
            >
                {fetchingData ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#286DA8" />
                    </View>
                ) : ocorrencia.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text
                            style={{
                                fontSize: scale(14),
                                fontFamily: 'Poppins_600SemiBold',
                                color: "#6c757d",
                            }}
                        >
                            Não há dados disponíveis
                        </Text>
                    </View>
                ) : (
                    ocorrencia.map((d) => (
                        <View key={d.descricao}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: scale(6),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale(14),
                                        fontFamily: 'Poppins_600SemiBold',
                                        color: "#212529",
                                    }}
                                >
                                    {d.descricao}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: scale(13),
                                        fontFamily: 'Poppins_600SemiBold',
                                        color: "#286DA8",
                                    }}
                                >
                                    {d.numOcorrencias} ocorrências
                                </Text>
                            </View>

                            <View
                                style={{
                                    height: scale(10),
                                    width: "100%",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: scale(999),
                                    overflow: "hidden",
                                }}
                            >
                                <View
                                    style={{
                                        height: "100%",
                                        width: `${(d.numOcorrencias / max) * 100}%`,
                                        backgroundColor: "#286DA8",
                                        borderRadius: scale(999),
                                    }}
                                />
                            </View>
                        </View>
                    ))
                )}
            </View>

            {/* <View
                style={{
                    borderWidth: scale(2),
                    borderColor: "#6ea8fe",
                    backgroundColor: "#1e293b",
                    borderRadius: scale(16),
                    padding: scale(20),
                    minHeight: scale(120),
                    justifyContent: fetchingData ? "center" : "flex-start",
                    alignItems: fetchingData ? "center" : "flex-start",
                }}
            >
                {fetchingData ? (
                    <ActivityIndicator size="large" color="#6ea8fe" />
                ) : (
                    <>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(8),
                                marginBottom: scale(8),
                            }}
                        >
                            <Text style={{ fontSize: scale(16) }}>
                                ✨
                            </Text>

                            <Text
                                style={{
                                    fontSize: scale(14),
                                    fontFamily: 'Poppins_600SemiBold',
                                    textTransform: "uppercase",
                                    color: "#fff",
                                }}
                            >
                                Sugestão da IA
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontSize: scale(14),
                                lineHeight: scale(22),
                                color: "rgba(255,255,255,0.8)",
                            }}
                        >
                            {sugestao}
                        </Text>
                    </>
                )}
            </View> */}
        </View>
    );
}