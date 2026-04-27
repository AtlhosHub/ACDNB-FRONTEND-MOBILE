import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import Label from '../components/Label';
import AppHeader from '../components/AppHeader';
import { useFocusEffect } from '@react-navigation/native';
import FiltroMensalidadesModal from '../components/FiltroMensalidadesModal';
import { mensalidadesMock } from '../mocks/listaMock';
import DetalhesAlunoScreen from './DetalhesAlunoScreen';
import { api } from '../../api';

const ENDPOINT_MENSALIDADES = '/alunos/comprovantes';
const REGISTROS_POR_PAGINA = 5;

const MESES_PT = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

const PALETA_INICIAIS = [
  { bg: '#E1F5EE', text: '#085041' },
  { bg: '#E6F1FB', text: '#0C447C' },
  { bg: '#FAEEDA', text: '#633806' },
  { bg: '#FCEBEB', text: '#791F1F' },
  { bg: '#EEEDFE', text: '#3C3489' },
  { bg: '#FBEAF0', text: '#72243E' },
];

const STATUS_CONFIG = {
  pago: { label: 'Pago', bg: '#EAF3DE', cor: '#27500A' },
  pendente: { label: 'Pendente', bg: '#FAEEDA', cor: '#633806' },
  atrasado: { label: 'Atrasado', bg: '#FCEBEB', cor: '#791F1F' },
};

const BORDA_STATUS = {
  pago: '#639922',
  pendente: '#BA7517',
  atrasado: '#E24B4A',
};

const obterIniciais = (nome) => {
  const partes = nome.trim().split(/\s+/);
  if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
  return nome.substring(0, 2).toUpperCase();
};

const obterCorIniciais = (nome) => {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = (nome.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  }
  return PALETA_INICIAIS[Math.abs(hash) % PALETA_INICIAIS.length];
};

const calcularIntervaloData = (meses, ano) => {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth(); // 0-11

  // Se não tiver mês selecionado -> usar mês atual
  if (!meses || meses.length === 0) {
    const anoUsado = ano || anoAtual;

    return {
      dataEnvioFrom: `${anoUsado}-${String(mesAtual + 1).padStart(2, '0')}-01`,
      dataEnvioTo: `${anoUsado}-${String(mesAtual + 1).padStart(2, '0')}-${new Date(
        anoUsado,
        mesAtual + 1,
        0
      ).getDate()}`,
    };
  }

  const indicesMeses = [...meses].sort((a, b) => a - b);
  const mesInicio = indicesMeses[0];
  const mesFim = indicesMeses[indicesMeses.length - 1];

  return {
    dataEnvioFrom: `${ano}-${String(mesInicio + 1).padStart(2, '0')}-01`,
    dataEnvioTo: `${ano}-${String(mesFim + 1).padStart(2, '0')}-${new Date(
      ano,
      mesFim + 1,
      0
    ).getDate()}`,
  };
};

const normalizarMensalidade = (item, i) => {
  // Trata dados da API real
  if (item.idMensalidade !== undefined) {
    return {
      id: String(item.id ?? i + 1),
      nomeAluno: String(item.nome ?? '-'),
      dataPagamento: item.dataEnvio ?? null,
      metodoPagamento: item.formaPagamento ?? null,
      status: String(item.status ?? 'pendente').toLowerCase(),
    };
  }

  // Trata dados do mock (fallback)
  return {
    id: String(item.id ?? i + 1),
    nomeAluno: String(item.nomeAluno ?? item.nome ?? '-'),
    dataPagamento: item.dataPagamento ?? null,
    metodoPagamento: item.metodoPagamento ?? null,
    status: String(item.status ?? 'pendente').toLowerCase(),
  };
};

const MensalidadesScreen = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;

  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroVisivel, setFiltroVisivel] = useState(false);
  const [filtrosAtivos, setFiltrosAtivos] = useState({ status: [], meses: [], ano: new Date().getFullYear(), tiposPagamento: [] });
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const didMountRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (didMountRef.current) {
        setRefreshKey((k) => k + 1);
      }
      didMountRef.current = true;
    }, []),
  );
  const [textoBuscaDebounce, setTextoBuscaDebounce] = useState('');

  async function getMensalidades(filtro) {
    try {
      const response = await api.post(ENDPOINT_MENSALIDADES, filtro);


      // Extrai o array 'content' da resposta
      const dadosAPI = response.data?.content || [];
      const total = response.data?.total || 0;

      if (Array.isArray(dadosAPI) && dadosAPI.length > 0) {
        // Mapeia os dados reais para o formato esperado
        const registrosFormatados = dadosAPI.map(normalizarMensalidade);
        setRegistros(registrosFormatados);
        setTotalRegistros(total);
        setUsandoMock(false);
      } else {
        // Se não há dados, limpar a lista anterior
        setRegistros([]);
        setTotalRegistros(0);
        setUsandoMock(false);
      }

      return response.data;
    } catch (erro) {
      console.error('Erro ao obter dados de mensalidades:', erro);
      throw erro;
    }
  }

  const tituloSecao = useMemo(() => {
    const { meses, ano } = filtrosAtivos;

    const hoje = new Date();
    const mesIndex = (meses && meses.length > 0) ? meses[0] : hoje.getMonth();
    const anoUsado = ano || hoje.getFullYear();

    return `MENSALIDADES - ${MESES_PT[mesIndex]} - ${anoUsado}`;
  }, [filtrosAtivos]);


  // Chamada a API quando mudar página, busca ou filtros
  useEffect(() => {
    const carregarMensalidades = async () => {
      try {
        setCarregando(true);
        const offset = (paginaAtual - 1) * REGISTROS_POR_PAGINA;

        const statusFiltro = filtrosAtivos.status.length > 0
          ? filtrosAtivos.status.map((s) => s.toUpperCase())
          : [];

        const { dataEnvioFrom, dataEnvioTo } = calcularIntervaloData(
          filtrosAtivos.meses,
          filtrosAtivos.ano
        );

        const filtro = {
          nome: textoBuscaDebounce.trim() || null,
          status: statusFiltro.length > 0 ? statusFiltro : null,
          ativo: true,
          dataEnvioFrom: dataEnvioFrom,
          dataEnvioTo: dataEnvioTo,
          offset: offset,
          limit: REGISTROS_POR_PAGINA
        };

        await getMensalidades(filtro);
      } catch (erro) {
        console.error('Erro ao carregar mensalidades:', erro);
        setRegistros(mensalidadesMock.map(normalizarMensalidade));
        setUsandoMock(true);
      } finally {
        setCarregando(false);
      }
    };

    carregarMensalidades();
  }, [paginaAtual, textoBuscaDebounce, filtrosAtivos, refreshKey]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(totalRegistros / REGISTROS_POR_PAGINA),
  );

  useEffect(() => {
    setPaginaAtual(1);
  }, [textoBuscaDebounce, filtrosAtivos]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setTextoBuscaDebounce(textoBusca);
    }, 600); // tempo em ms (0.6s)

    return () => clearTimeout(timeout);
  }, [textoBusca]);

  if (alunoSelecionado) {
    return (
      <DetalhesAlunoScreen
        aluno={alunoSelecionado}
        onVoltar={() => setAlunoSelecionado(null)}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f9f9' }}>
      <FiltroMensalidadesModal
        visivel={filtroVisivel}
        onFechar={() => setFiltroVisivel(false)}
        onAplicar={(f) => setFiltrosAtivos(f)}
      />
      <AppHeader
        subtitulo="Mensalidades"
        onBackPress={() => console.log('voltar pressionado')}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: '5%',
          paddingTop: scale(16),
          paddingBottom: scale(18),
          minHeight: screenHeight * 0.82,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Busca e filtro */}
        <View style={{ marginBottom: scale(10) }}>
          <View
            style={{
              width: "100%",
              height: scale(38),
              borderRadius: scale(8),
              borderColor: 'rgba(0,0,0,0.6)',
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: scale(8),
            }}
          >
            <TextInput
              value={textoBusca}
              onChangeText={setTextoBusca}
              placeholder="Nome do Aluno"
              style={{
                flex: 1,
                fontSize: scale(12),
                paddingRight: scale(38),
              }}
            />

            <Ionicons
              name="search-outline"
              size={scale(16)}
              color="#1e1919"
            />
          </View>
          <View
            style={{
              marginTop: scale(8),
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              title="FILTRO"
              onPress={() => setFiltroVisivel(true)}
              width={scale(88)}
              height={scale(30)}
              borderRadius={scale(4)}
              backgroundColor="#ffffff"
              textColor="#286da8"
              borderWidth={1}
              borderColor="#286da8"
              fontSize={scale(10)}
              style={{ flexDirection: 'row', paddingHorizontal: scale(8) }}
              textStyle={{ marginRight: 0 }}
              rightIcon={
                <Ionicons name="options-outline" size={scale(12)} color="#286da8" />
              }
            />
          </View>
        </View>

        {/* Título da seção */}
        <Text
          style={{
            fontFamily: 'Poppins_500Medium',
            fontSize: scale(11),
            color: '#0d3c53',
            letterSpacing: 0.5,
            marginBottom: scale(10),
          }}
        >
          {tituloSecao}
        </Text>

        {/* Lista de mensalidades */}
        {carregando ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: scale(36),
            }}
          >
            <ActivityIndicator size="small" color="#286da8" />
            <Text
              style={{
                marginTop: scale(10),
                fontFamily: 'Poppins_400Regular',
                fontSize: scale(13),
                color: '#0d3c53',
              }}
            >
              Carregando mensalidades...
            </Text>
          </View>
        ) : (
          <View style={{ gap: scale(10) }}>
            {registros.map((item) => {
              const iniciais = obterIniciais(item.nomeAluno);
              // ✅ CORRIGIDO: desestrutura { bg, text } da paleta
              const { bg: bgCirculo, text: textCirculo } = obterCorIniciais(item.nomeAluno);
              const statusConf = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pendente;
              // ✅ CORRIGIDO: borda lateral colorida por status
              const bordaStatus = BORDA_STATUS[item.status] ?? BORDA_STATUS.pendente;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => setAlunoSelecionado(item.id)}
                  style={{
                    backgroundColor: '#ffffff',
                    // ✅ CORRIGIDO: border-radius 14px igual ao Figma
                    borderRadius: 14,
                    // ✅ CORRIGIDO: borda lateral esquerda colorida por status (5px)
                    borderLeftWidth: 5,
                    borderLeftColor: bordaStatus,
                    paddingVertical: scale(12),
                    // ✅ CORRIGIDO: padding esquerdo compensa a borda lateral
                    paddingLeft: scale(12),
                    paddingRight: scale(12),
                    flexDirection: 'row',
                    alignItems: 'center',
                    // ✅ CORRIGIDO: sombra igual ao Figma (0px 4px 5px rgba(0,0,0,0.2))
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    elevation: 3,
                  }}
                >
                  {/* Círculo com iniciais */}
                  <View
                    style={{
                      // ✅ CORRIGIDO: tamanho 34px igual ao Figma
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      // ✅ CORRIGIDO: fundo claro da paleta
                      backgroundColor: bgCirculo,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: scale(10),
                      flexShrink: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins_500Medium',
                        fontSize: scale(12),
                        // ✅ CORRIGIDO: texto escuro da mesma família de cor
                        color: textCirculo,
                      }}
                    >
                      {iniciais}
                    </Text>
                  </View>

                  {/* Nome e data/método */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins_500Medium',
                        // ✅ CORRIGIDO: 13.5px igual ao Figma
                        fontSize: scale(13.5),
                        color: '#1a1a1a',
                      }}
                      numberOfLines={1}
                    >
                      {item.nomeAluno}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: scale(3),
                      }}
                    >
                      {item.dataPagamento ? (
                        <>
                          <Text
                            style={{
                              fontFamily: 'Poppins_400Regular',
                              // ✅ CORRIGIDO: 12px igual ao Figma
                              fontSize: scale(12),
                              color: '#777777',
                            }}
                          >
                            {item.dataPagamento}
                          </Text>
                          {item.metodoPagamento && (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: scale(8),
                              }}
                            >
                              {/* ✅ CORRIGIDO: divisor vertical 1px × 12px cor #E0E0E0 */}
                              <View
                                style={{
                                  width: 1,
                                  height: 12,
                                  backgroundColor: '#E0E0E0',
                                  marginRight: scale(8),
                                }}
                              />
                              <Text
                                style={{
                                  fontFamily: 'Poppins_400Regular',
                                  fontSize: scale(12),
                                  color: '#777777',
                                }}
                              >
                                {item.metodoPagamento}
                              </Text>
                            </View>
                          )}
                        </>
                      ) : (
                        <Text
                          style={{
                            fontFamily: 'Poppins_400Regular',
                            fontSize: scale(12),
                            color: '#777777',
                          }}
                        >
                          —
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Badge de status */}
                  <View
                    style={{
                      backgroundColor: statusConf.bg,
                      paddingHorizontal: scale(10),
                      paddingVertical: scale(4),
                      // ✅ CORRIGIDO: border-radius 20px (pílula) igual ao Figma
                      borderRadius: 20,
                      marginLeft: scale(8),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins_500Medium',
                        // ✅ CORRIGIDO: 11px igual ao Figma
                        fontSize: scale(11),
                        color: statusConf.cor,
                      }}
                    >
                      {statusConf.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {!carregando && usandoMock && (
          <Text
            style={{
              marginTop: scale(10),
              fontFamily: 'Poppins_400Regular',
              fontSize: scale(11),
              color: '#286da8',
            }}
          >
            Exibindo dados de demonstração enquanto o backend não está disponível
          </Text>
        )}

        {/* Paginação */}
        {!carregando && (
          <View
            style={{
              marginTop: scale(16),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => setPaginaAtual((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              style={{
                width: scale(32),
                height: scale(28),
                borderRadius: scale(5),
                borderWidth: 1,
                borderColor:
                  paginaAtual === 1 ? 'rgba(40,109,168,0.35)' : '#286da8',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: scale(10),
              }}
            >
              <Ionicons
                name="chevron-back"
                size={scale(16)}
                color={paginaAtual === 1 ? 'rgba(40,109,168,0.35)' : '#286da8'}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: scale(12),
                color: '#0d3c53',
              }}
            >
              Página {paginaAtual} de {totalPaginas}
            </Text>

            <TouchableOpacity
              onPress={() =>
                setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
              }
              disabled={paginaAtual === totalPaginas}
              style={{
                width: scale(32),
                height: scale(28),
                borderRadius: scale(5),
                borderWidth: 1,
                borderColor:
                  paginaAtual === totalPaginas
                    ? 'rgba(40,109,168,0.35)'
                    : '#286da8',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: scale(10),
              }}
            >
              <Ionicons
                name="chevron-forward"
                size={scale(16)}
                color={
                  paginaAtual === totalPaginas
                    ? 'rgba(40,109,168,0.35)'
                    : '#286da8'
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MensalidadesScreen;
