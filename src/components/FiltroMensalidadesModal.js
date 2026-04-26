import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Animated,
  PanResponder,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MESES_ABREV = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
];

const TIPOS_PAGAMENTO = ['Pix', 'Dinheiro'];

const STATUS_OPCOES = [
  { key: 'pago', label: 'Pago', bg: '#EAF3DE', cor: '#27500A', borda: '#639922' },
  { key: 'pendente', label: 'Pendente', bg: '#FAEEDA', cor: '#633806', borda: '#BA7517' },
  { key: 'atrasado', label: 'Atrasado', bg: '#FCEBEB', cor: '#791F1F', borda: '#E24B4A' },
];

const estadoInicial = () => ({
  status: [],
  meses: [],
  ano: new Date().getFullYear(),
  tiposPagamento: [],
});

const alternarItem = (lista, item) =>
  lista.includes(item) ? lista.filter((i) => i !== item) : [...lista, item];

const FiltroMensalidadesModal = ({ visivel, onFechar, onAplicar }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;

  const ALTURA_SHEET = screenHeight * 0.82;
  const LIMIAR_FECHAR = 120;

  const translateY = useRef(new Animated.Value(ALTURA_SHEET)).current;
  const [filtros, setFiltros] = useState(estadoInicial());

  // Abre o sheet com animação quando visivel muda
  useEffect(() => {
    if (visivel) {
      translateY.setValue(ALTURA_SHEET);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
        speed: 14,
      }).start();
    }
  }, [visivel]);

  const fecharComAnimacao = () => {
    Animated.timing(translateY, {
      toValue: ALTURA_SHEET,
      duration: 260,
      useNativeDriver: true,
    }).start(() => onFechar());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > LIMIAR_FECHAR || g.vy > 0.5) {
          fecharComAnimacao();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  const alternarStatus = (key) =>
    setFiltros((f) => ({
      ...f,
      status: f.status.includes(key) ? [] : [key],
    }));

  const alternarMes = (indice) =>
    setFiltros((f) => ({
      ...f,
      meses: f.meses.includes(indice) ? [] : [indice],
    }));

  const alternarTipo = (tipo) =>
    setFiltros((f) => ({ ...f, tiposPagamento: alternarItem(f.tiposPagamento, tipo) }));

  const alterarAno = (delta) =>
    setFiltros((f) => ({ ...f, ano: f.ano + delta }));

  const limparTudo = () => setFiltros(estadoInicial());

  const resumoFiltros = () => {
    const partes = [];
    if (filtros.status.length > 0)
      partes.push(filtros.status.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', '));
    if (filtros.meses.length > 0)
      partes.push(filtros.meses.map((m) => MESES_ABREV[m]).join(', ') + ` / ${filtros.ano}`);
    if (filtros.tiposPagamento.length > 0)
      partes.push(filtros.tiposPagamento.join(', '));
    return partes.length > 0 ? partes.join(' · ') : null;
  };

  const aplicar = () => {
    onAplicar(filtros);
    fecharComAnimacao();
  };

  const temFiltro =
    filtros.status.length > 0 ||
    filtros.meses.length > 0 ||
    filtros.tiposPagamento.length > 0;

  const resumo = resumoFiltros();

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="none"
      onRequestClose={fecharComAnimacao}
    >
      {/* Backdrop — fecha ao tocar fora */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={fecharComAnimacao}
      />

      {/* Sheet animado */}
      <Animated.View
        style={[
          styles.sheet,
          {
            height: ALTURA_SHEET,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Área da alça — captura o gesto de deslizar */}
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={[styles.handle, { width: scale(40), height: scale(4) }]} />
        </View>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={[styles.titulo, { fontSize: scale(16) }]}>Filtros</Text>
          <TouchableOpacity
            onPress={limparTudo}
            style={[styles.btnLimpar, { borderRadius: scale(6), paddingHorizontal: scale(12), paddingVertical: scale(5) }]}
          >
            <Text style={[styles.txtLimpar, { fontSize: scale(12) }]}>Limpar tudo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Conteúdo com scroll */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: scale(20), paddingBottom: scale(24) }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* STATUS */}
          <Text style={[styles.secaoLabel, { fontSize: scale(10), marginTop: scale(16) }]}>STATUS</Text>
          <View style={[styles.rowGap, { gap: scale(8), marginBottom: scale(20) }]}>
            {STATUS_OPCOES.map((op) => {
              const ativo = filtros.status.includes(op.key);
              return (
                <TouchableOpacity
                  key={op.key}
                  onPress={() => alternarStatus(op.key)}
                  style={[
                    styles.chipStatus,
                    {
                      paddingVertical: scale(8),
                      borderRadius: scale(8),
                      backgroundColor: ativo ? op.bg : '#f5f5f5',
                      borderColor: ativo ? op.borda : 'rgba(0,0,0,0.12)',
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: 'Poppins_500Medium',
                      fontSize: scale(12),
                      color: ativo ? op.cor : 'rgba(30,25,25,0.45)',
                    }}
                  >
                    {op.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* MÊS / ANO */}
          <View style={[styles.rowBetween, { marginTop: scale(16), marginBottom: scale(10) }]}>
            <Text style={[styles.secaoLabel, { fontSize: scale(10), marginBottom: 0 }]}>MÊS/ANO</Text>
            <View style={styles.rowGap}>
              <TouchableOpacity
                onPress={() => alterarAno(-1)}
                style={[styles.btnAno, { width: scale(26), height: scale(26), borderRadius: scale(6) }]}
              >
                <Ionicons name="chevron-back" size={scale(14)} color="#286da8" />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  fontSize: scale(13),
                  color: '#1e1919',
                  minWidth: scale(38),
                  textAlign: 'center',
                }}
              >
                {filtros.ano}
              </Text>
              <TouchableOpacity
                onPress={() => alterarAno(1)}
                style={[styles.btnAno, { width: scale(26), height: scale(26), borderRadius: scale(6) }]}
              >
                <Ionicons name="chevron-forward" size={scale(14)} color="#286da8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Grade de meses — 3 colunas com flex */}
          <View style={[styles.gradeWrap, { gap: scale(8), marginBottom: scale(20) }]}>
            {MESES_ABREV.map((mes, i) => {
              const ativo = filtros.meses.includes(i);
              return (
                <TouchableOpacity
                  key={mes}
                  onPress={() => alternarMes(i)}
                  style={[
                    styles.chipMes,
                    {
                      paddingVertical: scale(8),
                      borderRadius: scale(8),
                      backgroundColor: ativo ? '#E6F1FB' : '#f5f5f5',
                      borderColor: ativo ? '#286da8' : 'rgba(0,0,0,0.12)',
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: 'Poppins_500Medium',
                      fontSize: scale(12),
                      color: ativo ? '#0C447C' : 'rgba(30,25,25,0.45)',
                    }}
                  >
                    {mes}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* TIPO PAGAMENTO --> COMENTADO PQ NO BACK NÃO TEM FILTRO DE TIPO PAGAMENTO*/}
          {/* <Text style={[styles.secaoLabel, { fontSize: scale(10), marginTop: scale(16) }]}>TIPO DE PAGAMENTO</Text>
          <View style={[styles.rowGap, { gap: scale(8), flexWrap: 'wrap', marginBottom: scale(16) }]}>
            {TIPOS_PAGAMENTO.map((tipo) => {
              const ativo = filtros.tiposPagamento.includes(tipo);
              return (
                <TouchableOpacity
                  key={tipo}
                  onPress={() => alternarTipo(tipo)}
                  style={{
                    paddingHorizontal: scale(16),
                    paddingVertical: scale(8),
                    borderRadius: scale(20),
                    backgroundColor: ativo ? '#E6F1FB' : '#f5f5f5',
                    borderWidth: 1,
                    borderColor: ativo ? '#286da8' : 'rgba(0,0,0,0.12)',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Poppins_500Medium',
                      fontSize: scale(12),
                      color: ativo ? '#0C447C' : 'rgba(30,25,25,0.45)',
                    }}
                  >
                    {tipo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View> */}

          {/* Resumo de filtros ativos */}
          <View
            style={{
              backgroundColor: temFiltro ? '#E6F1FB' : '#f0f0f0',
              borderRadius: scale(8),
              borderWidth: 1,
              borderColor: temFiltro ? 'rgba(40,109,168,0.2)' : 'transparent',
              paddingHorizontal: scale(12),
              paddingVertical: scale(10),
              marginBottom: scale(16),
              minHeight: scale(38),
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: scale(11),
                color: temFiltro ? '#286da8' : 'rgba(30,25,25,0.4)',
              }}
              numberOfLines={2}
            >
              {resumo ?? 'Nenhum filtro selecionado'}
            </Text>
          </View>

          {/* Botão aplicar */}
          <TouchableOpacity
            onPress={aplicar}
            style={{
              backgroundColor: '#286da8',
              borderRadius: scale(10),
              height: scale(46),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_600SemiBold',
                fontSize: scale(14),
                color: '#F3F9F9',
              }}
            >
              Aplicar filtros
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    backgroundColor: '#D3D1C7',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  titulo: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#1e1919',
  },
  btnLimpar: {
    borderWidth: 1,
    borderColor: '#286da8',
  },
  txtLimpar: {
    fontFamily: 'Poppins_500Medium',
    color: '#286da8',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginHorizontal: 0,
  },
  secaoLabel: {
    fontFamily: 'Poppins_500Medium',
    color: 'rgba(30,25,25,0.45)',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  rowGap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipStatus: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
  },
  gradeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipMes: {
    width: '30.5%',
    alignItems: 'center',
    borderWidth: 1,
  },
  btnAno: {
    borderWidth: 1,
    borderColor: '#286da8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FiltroMensalidadesModal;