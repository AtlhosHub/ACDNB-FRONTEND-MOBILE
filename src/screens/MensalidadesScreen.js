import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import Label from '../components/Label';
import AppHeader from '../components/AppHeader';
import FiltroMensalidadesModal from '../components/FiltroMensalidadesModal';
import { mensalidadesMock } from '../mocks/listaMock';

const ENDPOINT_MENSALIDADES = 'http/';
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
  pago:     { label: 'Pago',     bg: '#EAF3DE', cor: '#27500A' },
  pendente: { label: 'Pendente', bg: '#FAEEDA', cor: '#633806' },
  atrasado: { label: 'Atrasado', bg: '#FCEBEB', cor: '#791F1F' },
};

const BORDA_STATUS = {
  pago:     '#639922',
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

const normalizarMensalidade = (item, i) => ({
  id: String(item.id ?? i + 1),
  nomeAluno: String(item.nomeAluno ?? item.nome ?? '-'),
  dataPagamento: item.dataPagamento ?? null,
  metodoPagamento: item.metodoPagamento ?? null,
  status: String(item.status ?? 'pendente').toLowerCase(),
});

const MensalidadesScreen = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;

  const agora = new Date();
  const tituloSecao = `MENSALIDADES - ${MESES_PT[agora.getMonth()]} - ${agora.getFullYear()}`;

  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroVisivel, setFiltroVisivel] = useState(false);
  const [filtrosAtivos, setFiltrosAtivos] = useState({ status: [], meses: [], ano: null, tiposPagamento: [] });

  useEffect(() => {
    const carregarMensalidades = async () => {
      try {
        const resposta = await fetch(ENDPOINT_MENSALIDADES);
        if (!resposta.ok) throw new Error('Erro ao carregar mensalidades');
        const dados = await resposta.json();
        const lista = Array.isArray(dados) ? dados : dados?.itens;
        if (!Array.isArray(lista)) throw new Error('Formato de resposta inválido');
        setRegistros(lista.map(normalizarMensalidade));
        setUsandoMock(false);
      } catch {
        setRegistros(mensalidadesMock.map(normalizarMensalidade));
        setUsandoMock(true);
      } finally {
        setCarregando(false);
      }
    };
    carregarMensalidades();
  }, []);

  const registrosFiltrados = useMemo(() => {
    const busca = textoBusca.trim().toLowerCase();
    return registros.filter((r) => {
      if (!r.nomeAluno.toLowerCase().includes(busca)) return false;
      if (filtrosAtivos.status.length > 0 && !filtrosAtivos.status.includes(r.status)) return false;
      if (filtrosAtivos.tiposPagamento.length > 0) {
        const metodo = r.metodoPagamento ?? '';
        if (!filtrosAtivos.tiposPagamento.some((t) => t.toLowerCase() === metodo.toLowerCase())) return false;
      }
      if (filtrosAtivos.meses.length > 0 && filtrosAtivos.ano != null && r.dataPagamento) {
        const [dia, mes, ano] = r.dataPagamento.split('/');
        const mesIdx = parseInt(mes, 10) - 1;
        const anoNum = parseInt(ano, 10);
        if (anoNum !== filtrosAtivos.ano || !filtrosAtivos.meses.includes(mesIdx)) return false;
      }
      return true;
    });
  }, [registros, textoBusca, filtrosAtivos]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(registrosFiltrados.length / REGISTROS_POR_PAGINA),
  );

  useEffect(() => {
    setPaginaAtual(1);
  }, [textoBusca, filtrosAtivos]);

  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas);
  }, [paginaAtual, totalPaginas]);

  const inicio = (paginaAtual - 1) * REGISTROS_POR_PAGINA;
  const registrosPagina = registrosFiltrados.slice(inicio, inicio + REGISTROS_POR_PAGINA);

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
          <Label
            value={textoBusca}
            onChangeText={setTextoBusca}
            width="100%"
            placeholder="Nome do Aluno"
            containerStyle={{
              height: scale(38),
              borderRadius: scale(8),
              borderColor: 'rgba(0,0,0,0.6)',
            }}
            inputStyle={{ fontSize: scale(12), paddingRight: scale(38) }}
            rightIcon={
              <Ionicons name="search-outline" size={scale(16)} color="#1e1919" />
            }
          />
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
            {registrosPagina.map((item) => {
              const iniciais = obterIniciais(item.nomeAluno);
              // ✅ CORRIGIDO: desestrutura { bg, text } da paleta
              const { bg: bgCirculo, text: textCirculo } = obterCorIniciais(item.nomeAluno);
              const statusConf = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pendente;
              // ✅ CORRIGIDO: borda lateral colorida por status
              const bordaStatus = BORDA_STATUS[item.status] ?? BORDA_STATUS.pendente;

              return (
                <View
                  key={item.id}
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
                </View>
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
