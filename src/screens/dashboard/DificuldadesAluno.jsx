import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from '../../mocks/constants';

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const ANOS = ['2023', '2024', '2025', '2026'];

// Mock data de dificuldades
const DIFICULDADES_MOCK = [
  { nome: 'Saque', ocorrencias: 42 },
  { nome: 'Backhand', ocorrencias: 38 },
  { nome: 'Volei', ocorrencias: 28 },
  { nome: 'Serviço', ocorrencias: 22 },
  { nome: 'Recepção', ocorrencias: 18 },
];

export function DificuldadesAluno() {
  const [mes, setMes] = useState('Março');
  const [ano, setAno] = useState('2025');
  const max = Math.max(...DIFICULDADES_MOCK.map((d) => d.ocorrencias));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.title}>Principais Dificuldades dos Alunos</Text>

      {/* Filtros - Mês e Ano */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Mês</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={mes}
              onValueChange={setMes}
              style={styles.picker}
            >
              {MESES.map((m) => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Ano</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={ano}
              onValueChange={setAno}
              style={styles.picker}
            >
              {ANOS.map((a) => (
                <Picker.Item key={a} label={a} value={a} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Dificuldades - Barras de Progresso */}
      <View style={styles.difficultiesContainer}>
        {DIFICULDADES_MOCK.map((d) => (
          <View key={d.nome} style={styles.difficultiesItem}>
            {/* Header da dificuldade */}
            <View style={styles.difficultiesHeader}>
              <Text style={styles.difficultiesName}>{d.nome}</Text>
              <Text style={styles.difficultiesCount}>
                {d.ocorrencias} ocorrências
              </Text>
            </View>

            {/* Barra de progresso */}
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(d.ocorrencias / max) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Insight da IA */}
      <View style={styles.insightContainer}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightIcon}>✨</Text>
          <Text style={styles.insightTitle}>Insight da IA</Text>
        </View>
        <Text style={styles.insightText}>
          O foco nos treinos de Saque e Backhand deve ser priorizado na próxima
          semana para 40% dos alunos ativos.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  content: {
    padding: 16,
    gap: 20,
  },

  // Title
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'Poppins_600SemiBold',
  },

  // Filters
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterField: {
    flex: 1,
    gap: 6,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Poppins_600SemiBold',
  },
  pickerWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: 45,
    justifyContent: 'center',
  },
  picker: {
    height: 45,
    color: '#1a1a1a',
  },

  // Difficulties
  difficultiesContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    padding: 16,
    gap: 16,
  },
  difficultiesItem: {
    gap: 8,
  },
  difficultiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultiesName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'Poppins_600SemiBold',
  },
  difficultiesCount: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND_BLUE,
    fontFamily: 'Poppins_600SemiBold',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e8e8e8',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: BRAND_BLUE,
    borderRadius: 4,
  },

  // Insight
  insightContainer: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(40, 109, 168, 0.3)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(40, 109, 168, 0.08)',
    padding: 16,
    gap: 8,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightIcon: {
    fontSize: 18,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Poppins_600SemiBold',
    color: BRAND_BLUE,
  },
  insightText: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(40, 109, 168, 0.8)',
    fontFamily: 'Poppins_400Regular',
  },
});
