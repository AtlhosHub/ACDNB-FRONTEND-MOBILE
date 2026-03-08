import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import Label from '../components/Label';
import { ImageBackground, TextInput } from 'react-native';
import AppHeader from '../components/AppHeader';
import { listaMock } from '../mocks/listaMock';
import { ActivityIndicator } from 'react-native';

const ENDPOINTLISTAESPERA = 'http/';
const REGISTROSPORPAGINA = 10;
const normalizarRegistro = (registro, indice) => ({
  id: String(registro.id ?? registro.alunoId ?? indice + 1),
  nomeAluno: String(
    registro.nomeAluno ?? registro.nome ?? registro.nomeEstudante ?? '-',
  ),
  dataContato: String(
    registro.dataContato ?? registro.contatoData ?? registro.dataAluno ?? '-',
  ),
  horarioPreferencia: String(
    registro.horarioPreferencia ??
      registro.horario ??
      registro.preferenciaAluno ??
      '-',
  ),
});

const listaEsperaScreen = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;

  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    const carregarListaEspera = async () => {
      try {
        const resposta = await fetch(ENDPOINTLISTAESPERA);

        if (!resposta.ok) {
          throw new Error('Erro ao carregar lista de espera');
        }

        const dados = await resposta.json();
        const listaSegura = Array.isArray(dados) ? dados : dados?.itens;

        if (!Array.isArray(listaSegura)) {
          throw new Error('Formato de resposta inválido');
        }

        setRegistros(listaSegura.map(normalizarRegistro));
        setUsandoMock(false);
      } catch (erro) {
        setRegistros(listaMock);
        setUsandoMock(true);
      } finally {
        setCarregando(false);
      }
    };
    carregarListaEspera();
  }, []);

  const colunas = useMemo(
    () => [
      { key: 'nomeAluno', label: 'Nome', flex: 2.2, align: 'left' },
      {
        key: 'dataContato',
        label: 'Data de Contato',
        flex: 1.2,
        align: 'center',
      },
      {
        key: 'horarioPreferencia',
        label: 'Horario de Preferencia',
        flex: 1.1,
        align: 'center',
      },
    ],
    [],
  );

  const registrosFiltrados = useMemo(() => {
    const consultaNormalizada = textoBusca.trim().toLowerCase();

    return registros.filter((registros) =>
      registros.nomeAluno.toLowerCase().includes(consultaNormalizada),
    );
  }, [registros, textoBusca]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(registrosFiltrados.length / REGISTROSPORPAGINA),
  );

  useEffect(() => {
    setPaginaAtual(1);
  }, [textoBusca]);

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, totalPaginas]);

  const inicioPagina = (paginaAtual - 1) * REGISTROSPORPAGINA;

  const registrosPagina = registrosFiltrados.slice(
    inicioPagina,
    inicioPagina + REGISTROSPORPAGINA,
  );

  const linhasVazias = Math.max(0, REGISTROSPORPAGINA - registrosPagina.length);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f3f9f9',
      }}
    >
      <AppHeader
        subtitulo={'Lista de Espera'}
        onBackPress={() => console.log('voltar pressionado')}
      />
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal: '5%',
          paddingTop: scale(16),
          paddingBottom: scale(18),
          minHeight: screenHeight * 0.82,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            marginBottom: scale(10),
          }}
        >
          <Label
            value={textoBusca}
            onChangeText={setTextoBusca}
            width='100%'
            placeholder='Nome do Aluno'
            containerStyle={{
              height: scale(38),
              borderRadius: scale(8),
              borderColor: 'rgba(0,0,0,0.6)',
            }}
            inputStyle={{
              fontSize: scale(12),
              paddingRight: scale(38),
            }}
            rightIcon={
              <Ionicons
                name='search-outline'
                size={scale(16)}
                color='#1e1919'
              />
            }
          ></Label>
          <View
            style={{
              marginTop: scale(8),
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button
              title="FILTRO"
              onPress={() => {}}
              width={scale(88)}
              height={scale(30)}
              borderRadius={scale(4)}
              backgroundColor="#ffffff"
              textColor="#286da8"
              borderWidth={1}
              borderColor="#286da8"
              fontSize={scale(10)}
              style={{
                flexDirection: 'row',
                paddingHorizontal: scale(8),
                marginRight: scale(8)
              }}
              textStyle={{
                marginRight: 0,
              }}
              rightIcon={
                <Ionicons
                  name='options-outline'
                  size={scale(12)}
                  color='#286da8'
                />
              }
            ></Button>
            <Button
              title='CADASTRAR'
              onPress={() => {}}
              width={scale(88)}
              height={scale(30)}
              borderRadius={scale(4)}
              backgroundColor='#286da8'
              textColor='#ffffff'
              fontSize={scale(9)}
              style={{
                flexDirection: 'row',
                paddingHorizontal: scale(8),
              }}
              textStyle={{
                marginRight: 0,
              }}
              rightIcon={
                <Ionicons name='add' size={scale(14)} color='#ffffff' />
              }
            ></Button>
          </View>
        </View>
        {carregando ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: scale(36),
            }}
          >
            <ActivityIndicator size='small' color='#286da8'></ActivityIndicator>
            <Text
              style={{
                marginTop: scale(10),
                fontFamily: 'Poppins_400Regular',
                fontSize: scale(13),
                color: '#0d3c53',
              }}
            >
              Carregando lista de espera...
            </Text>
          </View>
        ) : (
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              borderRadius: scale(12),
              overflow: 'hidden',
              minHeight: scale(430),
            }}
          >
            <View
              style={{
                backgroundColor: '#f3f7fb',
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,0.15)',
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: scale(9),
                paddingHorizontal: scale(10),
              }}
            >
              {colunas.map((coluna) => (
                <Text
                  key={coluna.key}
                  style={{
                    flex: coluna.flex,
                    textAlign: coluna.align,
                    fontFamily: 'Poppins_500Medium',
                    fontSize: scale(11),
                    color: '#0d3c53',
                  }}
                >
                  {coluna.label}
                </Text>
              ))}
            </View>
            {registrosPagina.map((registro, indice) => (
              <View
                key={registro.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  minHeight: scale(37),
                  paddingVertical: scale(8),
                  paddingHorizontal: scale(10),
                  backgroundColor: indice % 2 === 0 ? '#ffffff' : '#fafcff',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(0,0,0,0.8)',
                }}
              >
                <Text
                  style={{
                    flex: colunas[0].flex,
                    textAlign: 'left',
                    fontFamily: 'Poppins_400Regular',
                    fontSize: scale(11),
                    color: '#1e1919',
                  }}
                  numberOfLines={2}
                >
                  {registro.nomeAluno}
                </Text>
                <Text
                  style={{
                    flex: colunas[1].flex,
                    textAlign: 'left',
                    fontFamily: 'Poppins_400Regular',
                    fontSize: scale(11),
                    color: '#1e1919',
                  }}
                >
                  {registro.dataContato}
                </Text>
                <Text
                  style={{
                    flex: colunas[2].flex,
                    textAlign: 'left',
                    fontFamily: 'Poppins_400Regular',
                    fontSize: scale(11),
                    color: '#1e1919',
                  }}
                >
                  {registro.horarioPreferencia}
                </Text>
              </View>
            ))}
            {Array.from({ length: linhasVazias }).map((_, indiceLinha) => (
              <View
                key={`vazia-${indiceLinha}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  minHeight: scale(37),
                  paddingVertical: scale(8),
                  paddingHorizontal: scale(10),
                  backgroundColor:
                    (registrosPagina.length + indiceLinha) % 2 === 0
                      ? '#ffffff'
                      : '#fafcff',
                  borderBottomWidth: indiceLinha === linhasVazias - 1 ? 0 : 1,
                  borderBottomColor: 'rgba(0,0,0,0.8)',
                }}
              >
                <Text
                  style={{
                    flex: colunas[0].flex,
                    textAlign: 'left',
                    fontFamily: 'Poppins_400Regular',
                    fontSize: scale(11),
                    color: 'rgba(30, 25, 25, 0.35)',
                  }}
                >
                  -
                </Text>
                <Text
                  style={{
                    flex: colunas[1].flex,
                    textAlign: 'left',
                    fontFamily: 'Poppins_400Regular',
                    fontSize: scale(11),
                    color: 'rgba(30, 25, 25, 0.35)',
                  }}
                >
                  -
                </Text>
                <Text
                  style={{
                    flex: colunas[2].flex,
                    textAlign: 'left',
                    fontFamily: 'Poppins_400Regular',
                    fontSize: scale(11),
                    color: 'rgba(30, 25, 25, 0.35)',
                  }}
                >
                  -
                </Text>
              </View>
            ))}
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
            Exibindo dados de demonstração enquanto o backend não está
            disponível
          </Text>
        )}
        {!carregando && (
          <View
            style={{
              marginTop: scale(10),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() =>
                setPaginaAtual((pagina) => Math.max(1, pagina - 1))
              }
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
                name='chevron-back'
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
                setPaginaAtual((pagina) => Math.min(totalPaginas, pagina+1))
              }
              disabled={paginaAtual === totalPaginas}
              style={{
                width: scale(32),
                height: scale(28),
                borderRadius: scale(5),
                borderWidth: 1,
                borderColor:
                  paginaAtual === totalPaginas ? 'rgba(40,109,168,0.35)' : '#286da8',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: scale(10),
              }}
            >
              <Ionicons
                name='chevron-forward'
                size={scale(16)}
                color={paginaAtual === totalPaginas ? 'rgba(40,109,168,0.35)' : '#286da8'}
              />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default listaEsperaScreen;

