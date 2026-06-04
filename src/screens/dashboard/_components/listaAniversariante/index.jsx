import { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    View,
} from "react-native";

import dayjs from "dayjs";
import { useScale } from "../../../../../utils/scale";
import { meses } from "./enum/meses";

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { shadowBoxStyle } from "../..";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const ListaAniversariante = ({ alunos }) => {
    const scale = useScale();
    const dataAtual = dayjs().startOf("day");

    const [respostaFormatada, setRespostaFormatada] = useState([]);

    const formatarResposta = () => {
        if (!Array.isArray(alunos) || alunos.length === 0) {
            setRespostaFormatada([]);
            return;
        }

        const respostaObj = {};

        alunos.forEach(({ nome, dataNascimento }) => {
            if (!dataNascimento) return;

            const d = dayjs(dataNascimento);

            if (!d.isValid()) return;

            const dia = String(d.date()).padStart(2, "0");
            const mes = d.month();

            const nomeMes =
                meses[mes] ?? `MÊS ${mes + 1}`;

            const mesStr = String(mes + 1).padStart(2, "0");

            if (!respostaObj[nomeMes]) {
                respostaObj[nomeMes] = [];
            }

            respostaObj[nomeMes].push({
                nome,
                data: `${dia}/${mesStr}`,
            });
        });

        Object.keys(respostaObj).forEach((m) => {
            respostaObj[m].sort((a, b) => {
                const diaA = parseInt(
                    a.data.split("/")[0],
                    10
                );

                const diaB = parseInt(
                    b.data.split("/")[0],
                    10
                );

                return diaA - diaB;
            });
        });

        const resultado = Object.entries(respostaObj)
            .map(([mes, aniversariantes]) => ({
                mes,
                aniversariantes,
            }))
            .sort(
                (a, b) =>
                    meses.indexOf(a.mes) -
                    meses.indexOf(b.mes)
            );

        setRespostaFormatada(resultado);
    };

    const verificarAniversario = (data) => {
        const [dia, mes] = data.split("/");

        const anoAtual = dayjs().year();

        const dataFormatada = dayjs(
            `${anoAtual}-${mes}-${dia}`
        ).startOf("day");

        if (dataFormatada.isBefore(dataAtual)) {
            return "niver-passado";
        } else if (dataFormatada.isAfter(dataAtual)) {
            return "niver-futuro";
        }

        return "niver-atual";
    };

    useEffect(() => {
        if (alunos.length > 0) {
            formatarResposta();
        }
    }, [alunos]);

    return (
        <View
            style={[
                shadowBoxStyle.shadowBox,
                {
                    backgroundColor: "#ffffff",
                    borderColor: "#dee2e6",
                    borderRadius: scale(16),
                    borderWidth: 1,
                    padding: scale(16),
                    elevation: 3,
                }
            ]}
        >
            <ScrollView
                style={{
                    maxHeight: scale(300),
                }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
            >
                {respostaFormatada.length > 0 ? (
                    respostaFormatada.map(
                        ({ mes, aniversariantes }) => {
                            const inicio = dataAtual.subtract(7, "day");
                            const fim = dataAtual.add(2, "month");

                            const proximos =
                                aniversariantes.filter(
                                    ({ data }) => {
                                        const [dia, mesStr] = data.split("/");

                                        const aniversario = dayjs(
                                            `${dayjs().year()}-${mesStr}-${dia}`
                                        );

                                        const dentroDoPeriodo =
                                            aniversario.isSameOrAfter(inicio) &&
                                            aniversario.isSameOrBefore(fim);

                                        return dentroDoPeriodo
                                    }
                                );

                            if (!proximos.length) { return null }

                            return (
                                <View
                                    key={mes}
                                    style={{
                                        marginBottom: scale(16),
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginBottom: scale(8),
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                height: 1,
                                                backgroundColor: "#6ea8fe",
                                            }}
                                        />

                                        <Text
                                            style={{
                                                marginHorizontal: scale(8),
                                                fontSize: scale(12),
                                                fontWeight: "700",
                                                color: "#286DA8",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {mes}
                                        </Text>

                                        <View
                                            style={{
                                                flex: 1,
                                                height: 1,
                                                backgroundColor: "#286DA8",
                                            }}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            gap: scale(6),
                                        }}
                                    >
                                        {proximos.map((
                                            { nome, data },
                                            index
                                        ) => {
                                            const classe = verificarAniversario(data);

                                            const aniversario =
                                                classe ===
                                                "niver-atual";

                                            const color =
                                                classe ===
                                                    "niver-passado"
                                                    ? "#9aa7b3"
                                                    : classe ===
                                                        "niver-atual"
                                                        ? "#198754"
                                                        : "#212529";

                                            return (
                                                <View
                                                    key={`${nome}-${data}-${index}`}
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        borderRadius: scale(8),
                                                        paddingHorizontal: scale(8),
                                                        paddingVertical: scale(8),
                                                        backgroundColor: "#f8f9fa",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: scale(14),
                                                            fontWeight: "600",
                                                            color,
                                                        }}
                                                    >
                                                        {data}
                                                    </Text>

                                                    <Text
                                                        style={{
                                                            fontSize:
                                                                scale(14),
                                                            color,
                                                        }}
                                                    >
                                                        {nome}
                                                        {aniversario && " 🎉"}
                                                    </Text>
                                                </View>
                                            );
                                        }
                                        )}
                                    </View>
                                </View>
                            );
                        }
                    )
                ) : (
                    <View
                        style={{
                            padding: scale(16),
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "700",
                                textTransform:
                                    "uppercase",
                                color: "#999999",
                                textAlign: "center",
                            }}
                        >
                            Nenhum aniversário próximo
                            encontrado
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};