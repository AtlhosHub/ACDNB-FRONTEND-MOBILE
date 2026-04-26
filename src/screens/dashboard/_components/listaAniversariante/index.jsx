import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

import { meses } from './enum/meses';
import { useScale } from '../../../../../utils/scale';

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const ListaAniversariante = ({ alunos }) => {
    const scale = useScale();
    const dataAtual = dayjs().startOf('day');

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

            const dia = String(d.date()).padStart(2, '0');
            const mes = d.month();
            const nomeMes = meses[mes] ?? `MÊS ${mes + 1}`;
            const mesStr = String(mes + 1).padStart(2, '0');

            if (!respostaObj[nomeMes]) respostaObj[nomeMes] = [];

            respostaObj[nomeMes].push({
                nome,
                data: `${dia}/${mesStr}`
            });
        });

        Object.keys(respostaObj).forEach(m => {
            respostaObj[m].sort((a, b) => {
                const diaA = parseInt(a.data.split('/')[0], 10);
                const diaB = parseInt(b.data.split('/')[0], 10);
                return diaA - diaB;
            });
        });

        const resultado = Object.entries(respostaObj)
            .map(([mes, aniversariantes]) => ({ mes, aniversariantes }))
            .sort((a, b) => meses.indexOf(a.mes) - meses.indexOf(b.mes));

        setRespostaFormatada(resultado);
    };

    const verificarAniversario = (data) => {
        const [dia, mes] = data.split('/');
        const anoAtual = dayjs().year();

        const dataFormatada = dayjs(`${anoAtual}-${mes}-${dia}`).startOf('day');
        if (dataFormatada.isBefore(dataAtual)) return 'niver-passado'
        else if (dataFormatada.isAfter(dataAtual)) return 'niver-futuro';
        else return 'niver-atual';
    };

    useEffect(() => {
        if (alunos.length > 0) formatarResposta();
    }, [alunos]);

    return (
        <ScrollView
            style={{
                borderWidth: scale(0),
                borderRadius: scale(8),
                maxHeight: scale(300),
                padding: scale(8),
                backgroundColor: respostaFormatada.length > 0 ? '#f5f5f5' : '#e6e6e6',
            }}
            scrollEnabled={true}
            nestedScrollEnabled={true}
        >
            {respostaFormatada.length > 0 ?
                respostaFormatada.map(({ mes, aniversariantes }) => {
                    const inicio = dataAtual.subtract(7, 'day');
                    const fim = dataAtual.add(2, 'month');

                    const proximos = aniversariantes.filter(({ data }) => {
                        const [dia, mesStr] = data.split('/');
                        const aniversario = dayjs(`${dayjs().year()}-${mesStr}-${dia}`);
                        return aniversario.isSameOrAfter(inicio) && aniversario.isSameOrBefore(fim);
                    });

                    if (!proximos.length) return null;

                    return (
                        <View
                            style={style.niverWrap}
                            key={mes}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <View style={[style.mesNiverBox, style.mesNiverBoxAtual]} />
                                <Text style={style.spanAtual}>{mes.toUpperCase()}</Text>
                                <View style={[style.mesNiverBox, style.mesNiverBoxAtual]} />
                            </View>
                            <View style={{ flexDirection: 'column', marginVertical: scale(4) }}>
                                {proximos.map(({ nome, data }, index) => {
                                    const classe = verificarAniversario(data);
                                    const aniversario = classe === 'niver-atual';
                                    const textStyle = classe === 'niver-passado'
                                        ? style.niverPassado
                                        : classe === 'niver-atual'
                                            ? style.niverAtual
                                            : style.niverFuturo;

                                    return (
                                        <View key={`${nome}-${data}-${index}`}>
                                            <Text style={textStyle}>{data} - {nome}{aniversario && ' 🎉'}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    );
                })
                :
                <View style={{
                    padding: 10,
                    alignItems: 'center'
                }}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            color: '#999999',
                            textAlign: 'center'
                        }}
                    >
                        Nenhum aniversário próximo encontrado
                    </Text>
                </View>
            }
        </ScrollView>
    );
};

const style = StyleSheet.create({
    niverWrap: {
        flexDirection: 'column',
        marginVertical: 7,
    },
    mesNiverBox: {
        flex: 1,
        height: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    mesNiverBoxAtual: {
        borderBottomColor: '#286DA8',
    },
    span: {
        color: 'black',
        fontSize: 16,
        backgroundColor: 'white',
        paddingHorizontal: 32,
    },
    spanAtual: {
        color: '#286DA8',
        marginInline: 10,
        fontWeight: '600',
    },
    niverPassado: {
        color: '#AFAFAF',
    },
    niverAtual: {
        color: '#286DA8',
        fontWeight: '600',
    },
    niverFuturo: {
        color: 'black',
    },
});