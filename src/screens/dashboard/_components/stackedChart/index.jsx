import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useScale } from '../../../../../utils/scale';

const meses = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
];

const StackedChart = ({ data = [] }) => {
    const scale = useScale();
    const [chartData, setChartData] = useState([]);

    const buildChartData = () => {
        const formatted = meses.map((mes, index) => {
            const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1);
            const dataForMonth = data.find(item => item.mes === index + 1);

            const pagos = dataForMonth?.pagos || 0;
            const pagosComDesconto = dataForMonth?.pagos_com_desconto || 0;
            const atrasados = dataForMonth?.atrasados || 0;

            return {
                label: mesFormatado,
                stacks: [
                    { value: pagos, color: '#286DA8' },
                    { value: pagosComDesconto, color: '#FFAE03' },
                    { value: atrasados, color: '#CF3333' },
                ],
            };
        });

        setChartData(formatted);
    };

    const maxValue = () => {
        let max = 0;

        chartData.forEach(item => {
            const total = item.stacks.reduce((sum, stack) => sum + stack.value, 0);
            if (total > max) max = total;
        });

        return max;
    }

    useEffect(() => {
        buildChartData();
    }, [data]);

    return (
        <View>
            {data.length > 0 ? (
                <BarChart
                    stackData={chartData}
                    barWidth={30}
                    spacing={25}
                    noOfSections={5}
                    xAxisThickness={1}
                    yAxisThickness={1}
                    maxValue={maxValue()}
                />
            ) : (
                <View
                    style={{
                        height: scale(300),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: scale(1),
                        borderRadius: scale(8),
                        borderColor: '#bfbfbf',
                        backgroundColor: '#e6e6e6',
                    }}
                >
                    <Text
                        style={{
                            color: '#999999',
                            fontWeight: 'bold'
                        }}
                    >
                        NENHUM DADO DE PAGAMENTO DISPONÍVEL
                    </Text>
                </View>
            )}
        </View>
    );
};

export default StackedChart;