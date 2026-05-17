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
import { formatarCPF, formatarData } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';

const NIVEIS_HABILIDADE = ['iniciante', 'intermediario', 'avancado', 'profissional'];

const STATUS_CONFIG = {
  pago: { key: 'pago', bg: '#EAF3DE', cor: '#27500A' },
  pendente: { key: 'pendente', bg: '#FAEEDA', cor: '#633806' },
  atrasado: { key: 'atrasado', bg: '#FCEBEB', cor: '#791F1F' },
};


const DetalhesAlunoScreen = ({ aluno, onVoltar }) => {
  const [alunoDetalhes, setAlunoDetalhes] = useState(null);
  const [alunoObservacoes, setAlunoObservacoes] = useState(null);
  const [historicoPagamento, setHistoricoPagamento] = useState([]);

  const { width: screenWidth } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;
  const { t } = useTranslation();

  const [abaAtiva, setAbaAtiva] = useState('informacoes');

  const nivelHabilidade = alunoDetalhes?.nivel?.descricao ?? null;
  const observacoes = alunoObservacoes?.[0]?.descricao ?? null;


  async function getAlunoDetalhes(alunoId) {
    try {
      const response = await api.get(`/alunos/${alunoId}`);
      setAlunoDetalhes(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do aluno:', error);
      throw error;
    }
  }

  async function getAlunoObservacoes(alunoId) {
    try {
      const response = await api.get(`/observacao/${alunoId}`);
      setAlunoObservacoes(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar observações do aluno:', error);
      throw error;
    }
  }

  async function getHistoricoPagamento(alunoId) {
    const filtro = {
      idAluno: alunoId,
      dateFrom: null,
      dateTo: null,
    };
    try {
      const response = await api.post(`/mensalidades/historicoMensalidade`, filtro);
      setHistoricoPagamento(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico de pagamento:', error);
      throw error;
    }
  }

  useEffect(() => {
    const carregarDados = async () => {
      try {
        await getAlunoDetalhes(aluno);
        await getAlunoObservacoes(aluno);
      } catch (erro) {
        console.error('Erro ao carregar dados do aluno:', erro);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (abaAtiva === 'historico') {
      getHistoricoPagamento(aluno);
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
      <CampoLeitura label={t('detalhesAluno.fields.nome')} valor={alunoDetalhes?.nome} />
      <CampoLeitura label={t('detalhesAluno.fields.nomeSocial')} valor={alunoDetalhes?.nomeSocial} />
      <CampoLeitura label={t('detalhesAluno.fields.genero')} valor={alunoDetalhes?.genero} />
      <CampoLeitura label={t('detalhesAluno.fields.dataNascimento')} valor={formatarData(alunoDetalhes?.dataNascimento)} />
      <CampoLeitura label={t('detalhesAluno.fields.nacionalidade')} valor={alunoDetalhes?.nacionalidade} />
      <CampoLeitura label={t('detalhesAluno.fields.rg')} valor={alunoDetalhes?.rg} />
      <CampoLeitura label={t('detalhesAluno.fields.cpf')} valor={formatarCPF(alunoDetalhes?.cpf)} />
      {/* <CampoLeitura label="Estado Civil" valor={alunoDetalhes?.estadoCivil} /> --> COMENTADO PQ NÃO TEM ESTADO CIVIL */}
      <CampoLeitura label={t('detalhesAluno.fields.profissao')} valor={alunoDetalhes?.profissao} />
      <CampoLeitura label={t('detalhesAluno.fields.telefone')} valor={alunoDetalhes?.telefone} />
      <CampoLeitura label={t('detalhesAluno.fields.celular')} valor={alunoDetalhes?.celular} />
      <CampoLeitura label={t('detalhesAluno.fields.email')} valor={alunoDetalhes?.email} />

      {/* Radio somente leitura */}
      <View style={{ flexDirection: 'row', gap: scale(32), marginBottom: scale(20) }}>
        <View>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(13), color: '#1E1919', marginBottom: scale(6) }}>
            {t('detalhesAluno.fields.statusPresenca')}
          </Text>
          <View style={{ flexDirection: 'row', gap: scale(14) }}>
            {[
              { labelKey: 'statusPresenca.ativa', value: true },
              { labelKey: 'statusPresenca.inativa', value: false }
            ].map((opt) => (
              <View key={opt.labelKey} style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                  {t(`detalhesAluno.${opt.labelKey}`)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ATESTADOS */}
        <View>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(13), color: '#1E1919', marginBottom: scale(6) }}>
            {t('detalhesAluno.fields.atestados')}
          </Text>
          <View style={{ flexDirection: 'row', gap: scale(14) }}>
            {[
              { labelKey: 'atestados.sim', value: true },
              { labelKey: 'atestados.nao', value: false }
            ].map((opt) => (
              <View key={opt.labelKey} style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                  {t(`detalhesAluno.${opt.labelKey}`)}
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
        {t('detalhesAluno.fields.observacoes')}
      </Text>

      <View style={{ marginBottom: scale(20) }}>
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(13), color: '#1E1919', marginBottom: scale(8) }}>
          {t('detalhesAluno.fields.nivelHabilidade')}
        </Text>
        <View style={{ flexDirection: 'row', gap: scale(8), flexWrap: 'wrap' }}>
          {NIVEIS_HABILIDADE.map((nivelKey) => (
            <View
              key={nivelKey}
              style={{
                paddingHorizontal: scale(16),
                paddingVertical: scale(7),
                borderRadius: scale(20),
                borderWidth: 1.5,
                borderColor: nivelHabilidade === t(`detalhesAluno.nivelHabilidade.${nivelKey}`) ? '#286DA8' : 'rgba(0,0,0,0.15)',
                backgroundColor: nivelHabilidade === t(`detalhesAluno.nivelHabilidade.${nivelKey}`) ? 'rgba(40,109,168,0.08)' : 'rgba(0,0,0,0.03)',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: scale(13),
                  color: nivelHabilidade === t(`detalhesAluno.nivelHabilidade.${nivelKey}`) ? '#286DA8' : 'rgba(30,25,25,0.4)',
                }}
              >
                {t(`detalhesAluno.nivelHabilidade.${nivelKey}`)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginBottom: scale(28) }}>
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(13), color: '#1E1919', marginBottom: scale(4) }}>
          {t('detalhesAluno.fields.observacoes')}
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
    {historicoPagamento?.map((pagamento) => {
      let statusPagamento;
      if (pagamento.dataPagamento) {
        statusPagamento = 'pago';
      } else if (pagamento.dataVencimento && new Date(pagamento.dataVencimento) < new Date()) {
        statusPagamento = 'atrasado';
      } else {
        statusPagamento = String(pagamento.status ?? 'pendente').toLowerCase();
      }
      const statusConf = STATUS_CONFIG[statusPagamento] ?? STATUS_CONFIG.pendente;
      return (
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
              {t(`detalhesAluno.statusPagamento.${statusConf.key}`)}
            </Text>
          </View>
        </View>

        {pagamento?.dataPagamento ? (
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(12), color: '#777777' }}>
            {formatarData(pagamento.dataPagamento)}{pagamento.formaPagamento ? `  •  ${pagamento.formaPagamento}` : ''}
          </Text>
        ) : (
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: scale(12), color: '#777777' }}>
            {t('detalhesAluno.statusPagamento.semPagamento')}{formatarData(pagamento.dataVencimento)}
          </Text>
        )}
      </View>
      );
    })}
  </View>
);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <AppHeader subtitulo={t('detalhesAluno.headerSubtitle')} onBackPress={onVoltar} />

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
              {t('detalhesAluno.tabs.informacoes')}
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
              {t('detalhesAluno.tabs.historicoPagamento')}
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
