import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { api } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatarCPF, formatarData } from '../utils/formatters';

const NIVEIS_HABILIDADE = ['Iniciante', 'Intermediário', 'Avançado', 'Profissional'];

const STATUS_CONFIG = {
  pago: { label: 'Pago', bg: '#EAF3DE', cor: '#27500A' },
  pendente: { label: 'Pendente', bg: '#FAEEDA', cor: '#633806' },
  atrasado: { label: 'Atrasado', bg: '#FCEBEB', cor: '#791F1F' },
};


const DetalhesAlunoScreen = ({ aluno, onVoltar }) => {
  const [authToken, setAuthToken] = useState(null);
  const [alunoDetalhes, setAlunoDetalhes] = useState(null);
  const [alunoObservacoes, setAlunoObservacoes] = useState(null);
  const [historicoPagamento, setHistoricoPagamento] = useState([]);

  const { width: screenWidth } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;

  const [abaAtiva, setAbaAtiva] = useState('informacoes');

  // Futuramente virá de um GET ao backend
  const nivelHabilidade = alunoDetalhes?.nivel?.descricao ?? null;
  const observacoes = alunoObservacoes?.[0]?.descricao ?? null;

  const statusConf = STATUS_CONFIG[aluno?.status] ?? STATUS_CONFIG.pendente;

  async function getAlunoDetalhes(alunoId, authToken) {
    try {
      const response = await api.get(`/alunos/${alunoId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        }
      });
      setAlunoDetalhes(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do aluno:', error);
      throw error;
    }
  }

  async function getAlunoObservacoes(alunoId, authToken) {
    try {
      const response = await api.get(`/observacao/${alunoId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        }
      });
      setAlunoObservacoes(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar observações do aluno:', error);
      throw error;
    }
  }

  async function getHistoricoPagamento(alunoId, authToken) {
    const filtro = {
      idAluno: alunoId,
      dateFrom: null,
      dateTo: null,
    }
    try {
      const response = await api.post(`/mensalidades/historicoMensalidade`, filtro, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        }
      });
      setHistoricoPagamento(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico de pagamento:', error);
      throw error;
    }
  }

  useEffect(() => {
    const inicializarToken = async () => {
      try {
        let token = await AsyncStorage.getItem('authToken');
        setAuthToken(token);

        await getAlunoDetalhes(aluno, token);
        await getAlunoObservacoes(aluno, token);
      } catch (erro) {
        console.error('Erro ao obter token:', erro);
      }
    };

    inicializarToken();
  }, []);

  useEffect(() => {
    if (abaAtiva === 'historico') {
      getHistoricoPagamento(aluno, authToken);
    }
  }, [abaAtiva]);

  const CampoLeitura = ({ label, valor }) => (
    <View style={{ marginBottom: scale(14) }}>
      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: scale(13),
          color: '#1E1919',
          marginBottom: scale(4),
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: '100%',
          height: 40,
          backgroundColor: 'rgba(0,0,0,0.04)',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          borderRadius: 10,
          justifyContent: 'center',
          paddingHorizontal: 12,
        }}
      >
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: scale(14),
            color: valor ? '#1E1919' : 'rgba(30,25,25,0.35)',
          }}
          numberOfLines={1}
        >
          {valor || '—'}
        </Text>
      </View>
    </View>
  );

  const renderInformacoes = () => (
    <>
      {/* Dados do aluno — somente visualização */}
      <CampoLeitura label="Nome" valor={alunoDetalhes?.nome} />
      <CampoLeitura label="Nome Social" valor={alunoDetalhes?.nomeSocial} />
      <CampoLeitura label="Gênero" valor={alunoDetalhes?.genero} />
      <CampoLeitura label="Data de Nascimento" valor={formatarData(alunoDetalhes?.dataNascimento)} />
      <CampoLeitura label="Nacionalidade" valor={alunoDetalhes?.nacionalidade} />
      <CampoLeitura label="RG" valor={alunoDetalhes?.rg} />
      <CampoLeitura label="CPF" valor={formatarCPF(alunoDetalhes?.cpf)} />
      {/* <CampoLeitura label="Estado Civil" valor={alunoDetalhes?.estadoCivil} /> --> COMENTADO PQ NÃO TEM ESTADO CIVIL */}
      <CampoLeitura label="Profissão" valor={alunoDetalhes?.profissao} />
      <CampoLeitura label="Telefone" valor={alunoDetalhes?.telefone} />
      <CampoLeitura label="Celular" valor={alunoDetalhes?.celular} />
      <CampoLeitura label="Email" valor={alunoDetalhes?.email} />

      {/* Radio somente leitura */}
      <View style={{ flexDirection: 'row', gap: scale(32), marginBottom: scale(20) }}>
        <View>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(13), color: '#1E1919', marginBottom: scale(6) }}>
            Status de Presença
          </Text>
          <View style={{ flexDirection: 'row', gap: scale(14) }}>
            {[
              { label: 'Ativa', value: true },
              { label: 'Inativa', value: false }
            ].map((opt) => (
              <View key={opt.label} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: scale(16),
                    height: scale(16),
                    borderRadius: scale(8),
                    borderWidth: 2,
                    borderColor: 'rgba(0,0,0,0.2)',
                    marginRight: scale(5),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {alunoDetalhes?.ativo === opt.value && (
                    <View
                      style={{
                        width: scale(8),
                        height: scale(8),
                        borderRadius: scale(4),
                        backgroundColor: '#000',
                      }}
                    />
                  )}
                </View>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(13), color: '#1E1919' }}>
                  {opt.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ATESTADOS */}
        <View>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(13), color: '#1E1919', marginBottom: scale(6) }}>
            Atestados
          </Text>
          <View style={{ flexDirection: 'row', gap: scale(14) }}>
            {[
              { label: 'Sim', value: true },
              { label: 'Não', value: false }
            ].map((opt) => (
              <View key={opt.label} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: scale(16),
                    height: scale(16),
                    borderRadius: scale(8),
                    borderWidth: 2,
                    borderColor: 'rgba(0,0,0,0.2)',
                    marginRight: scale(5),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {alunoDetalhes?.temAtestado === opt.value && (
                    <View
                      style={{
                        width: scale(8),
                        height: scale(8),
                        borderRadius: scale(4),
                        backgroundColor: '#000',
                      }}
                    />
                  )}
                </View>

                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(13), color: '#1E1919' }}>
                  {opt.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Divisor */}
      <View
        style={{
          height: 1,
          backgroundColor: 'rgba(0,0,0,0.1)',
          marginBottom: scale(20),
        }}
      />

      {/* Seção de observações — somente visualização */}
      <Text
        style={{
          fontFamily: 'Poppins_600SemiBold',
          fontSize: scale(15),
          color: '#0D3C53',
          marginBottom: scale(16),
        }}
      >
        Observações
      </Text>

      <View style={{ marginBottom: scale(20) }}>
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(13), color: '#1E1919', marginBottom: scale(8) }}>
          Nível de Habilidade
        </Text>
        <View style={{ flexDirection: 'row', gap: scale(8), flexWrap: 'wrap' }}>
          {NIVEIS_HABILIDADE.map((nivel) => (
            <View
              key={nivel}
              style={{
                paddingHorizontal: scale(16),
                paddingVertical: scale(7),
                borderRadius: scale(20),
                borderWidth: 1.5,
                borderColor: nivelHabilidade === nivel ? '#286DA8' : 'rgba(0,0,0,0.15)',
                backgroundColor: nivelHabilidade === nivel ? 'rgba(40,109,168,0.08)' : 'rgba(0,0,0,0.03)',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: scale(13),
                  color: nivelHabilidade === nivel ? '#286DA8' : 'rgba(30,25,25,0.4)',
                }}
              >
                {nivel}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginBottom: scale(28) }}>
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(13), color: '#1E1919', marginBottom: scale(4) }}>
          Observações
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.04)',
            padding: scale(12),
            minHeight: scale(120),
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: scale(14),
              color: observacoes ? '#1E1919' : 'rgba(30,25,25,0.35)',
            }}
          >
            {observacoes || '—'}
          </Text>
        </View>
      </View>
    </>
  );

const renderHistoricoPagamento = () => (
  <View style={{ paddingTop: scale(8) }}>
    {historicoPagamento?.map((pagamento) => (
      <View
        key={pagamento.id}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: scale(16),
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.08)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
          marginBottom: scale(10),
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(6) }}>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: scale(13), color: '#1a1a1a' }}>
            {alunoDetalhes?.nome}
          </Text>
          <View
            style={{
              backgroundColor: statusConf.bg,
              paddingHorizontal: scale(10),
              paddingVertical: scale(3),
              borderRadius: 20,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: scale(11), color: statusConf.cor }}>
              {statusConf.label}
            </Text>
          </View>
        </View>

        {pagamento?.dataPagamento ? (
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(12), color: '#777777' }}>
            {pagamento.dataPagamento}{pagamento.formaPagamento ? `  •  ${pagamento.formaPagamento}` : ''}
          </Text>
        ) : (
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(12), color: '#777777' }}>
            Sem pagamento registrado - {formatarData(pagamento.dataVencimento)}
          </Text>
        )}
      </View>
    ))}
    <Text
      style={{
        fontFamily: 'Poppins_400Regular',
        fontSize: scale(12),
        color: 'rgba(0,0,0,0.4)',
        textAlign: 'center',
        marginTop: scale(16),
      }}
    >
      Histórico completo disponível após integração com o backend
    </Text>

  </View>
);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <AppHeader subtitulo="Detalhes Ficha Aluno" onBackPress={onVoltar} />

      {/* Tabs + Editar */}
      <View
        style={{
          paddingHorizontal: scale(24),
          paddingTop: scale(12),
          paddingBottom: scale(6),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <View style={{ flexDirection: 'row', gap: scale(16) }}>
          <TouchableOpacity
            onPress={() => setAbaAtiva('informacoes')}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: scale(6),
              paddingBottom: scale(6),
              borderBottomWidth: abaAtiva === 'informacoes' ? 2 : 0,
              borderBottomColor: '#286DA8',
            }}
          >
            <Ionicons
              name="person-circle-outline"
              size={scale(18)}
              color={abaAtiva === 'informacoes' ? '#286DA8' : '#777777'}
            />
            <Text
              style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: scale(13),
                color: abaAtiva === 'informacoes' ? '#286DA8' : '#777777',
              }}
            >
              Informações
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setAbaAtiva('historico')}
            activeOpacity={0.7}
            style={{
              paddingBottom: scale(6),
              borderBottomWidth: abaAtiva === 'historico' ? 2 : 0,
              borderBottomColor: '#286DA8',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: scale(13),
                color: abaAtiva === 'historico' ? '#286DA8' : '#777777',
              }}
            >
              Histórico de pagamento
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: scale(24),
          paddingTop: scale(8),
          paddingBottom: scale(32),
        }}
        showsVerticalScrollIndicator={false}
      >
        {abaAtiva === 'informacoes' ? renderInformacoes() : renderHistoricoPagamento()}
      </ScrollView>
    </View>
  );
};

export default DetalhesAlunoScreen;
