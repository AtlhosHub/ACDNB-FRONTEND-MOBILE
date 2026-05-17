import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import Label from '../components/Label';
import Button from '../components/Button';
import { horariosMock } from '../mocks/horariosMock';
import { formatDate, formatDisplayDate, formatToApiDateTime, formatToApiDate } from '../../utils/formatters';
import { api } from '../../api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

const CadastroInteressadoScreen = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;
  const { t } = useTranslation();

  const [nome, setNome] = useState('');
  const [cep, setCep] = useState('');
  const [dataContato, setDataContato] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [horarioPreferencia, setHorarioPreferencia] = useState('');
  const [nomeSocial, setNomeSocial] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [showContatoPicker, setShowContatoPicker] = useState(false);
  const [showNascimentoPicker, setShowNascimentoPicker] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [numero, setNumero] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const camposObrigatoriosPreenchidos =
    nome.trim() !== '' &&
    cep.trim() !== '' &&
    dataContato.length === 10 &&
    dataNascimento.length === 10 &&
    email.trim() !== '' &&
    celular.trim() !== '' &&
    horarioPreferencia !== '';


  async function adicionarInteressado() {
    try {
      const payload = {
        nome: nome,
        email: email,
        dataInteresse: formatToApiDateTime(dataContato),
        celular: celular,
        nomeSocial: nomeSocial,
        genero: null,
        dataNascimento: formatToApiDate(dataNascimento),
        telefone: null,
        dataInclusao: new Date().toISOString().slice(0, 10) + 'T00:00:00',
        usuarioInclusao: 1, // substituir pelo id do usuário logado
        horarioPrefId: horarioPreferencia,
        endereco: {
          logradouro: logradouro,
          numLog: numero,
          bairro: bairro,
          cidade: cidade,
          estado: estado,
          cep: {
            value: cep
          }
        }
      };

      const response = await api.post('/lista-espera/adicionar', payload);
      console.log('Sucesso:', response.data);
      alert(t('cadastroInteressado.alerts.sucesso'));
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  }

  async function getHorarioPreferencia() {
    try {
      const response = await api.get('/horario-preferencia');
      setHorarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
    }
  }

  useEffect(() => {
    getHorarioPreferencia();
  }, []);

  async function buscarCep(valorCep) {
    try {
      const cepLimpo = valorCep.replace(/\D/g, '');

      if (cepLimpo.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert(t('cadastroInteressado.alerts.cepNaoEncontrado'), t('cadastroInteressado.alerts.cepInvalido'));
        return;
      }

      setLogradouro(data.logradouro);
      setBairro(data.bairro);
      setCidade(data.localidade);
      setEstado(data.uf);

    } catch (error) {
      alert(t('cadastroInteressado.alerts.erro'), t('cadastroInteressado.alerts.erroCep'));
      console.error(error);
    }
  }

  const FieldLabel = ({ text, required, infoIcon }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: scale(4) }}>
      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: scale(13),
          color: '#1E1919',
        }}
      >
        {text}
      </Text>
      {required && (
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: scale(13),
            color: '#E53935',
            marginLeft: scale(2),
          }}
        >
          *
        </Text>
      )}
      {infoIcon && (
        <TouchableOpacity
          onPress={() => setTooltipVisible(true)}
          activeOpacity={0.7}
          style={{ marginLeft: scale(4) }}
        >
          <Ionicons name="help-circle" size={scale(16)} color="#286DA8" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <AppHeader
        subtitulo={t('cadastroInteressado.headerSubtitle')}
        onBackPress={() => navigation?.goBack()}
      />

      <Modal
        transparent
        visible={tooltipVisible}
        animationType="fade"
        onRequestClose={() => setTooltipVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setTooltipVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: scale(32),
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: scale(12),
                  padding: scale(20),
                  width: '100%',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: scale(10) }}>
                  <Ionicons name="help-circle" size={scale(20)} color="#286DA8" />
                  <Text
                    style={{
                      fontFamily: 'Poppins_500Medium',
                      fontSize: scale(14),
                      color: '#0D3C53',
                      marginLeft: scale(6),
                    }}
                  >
                    {t('cadastroInteressado.nomeSocialTooltip.title')}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: scale(13),
                    color: '#1E1919',
                    lineHeight: scale(20),
                  }}
                >
                  {t('cadastroInteressado.nomeSocialTooltip.body')}
                  {'\n\n'}
                  {t('cadastroInteressado.nomeSocialTooltip.body2')}
                </Text>
                <TouchableOpacity
                  onPress={() => setTooltipVisible(false)}
                  activeOpacity={0.7}
                  style={{ alignSelf: 'flex-end', marginTop: scale(16) }}
                >
                  <Text
                    style={{
                      fontFamily: 'Poppins_500Medium',
                      fontSize: scale(14),
                      color: '#286DA8',
                    }}
                  >
                    {t('cadastroInteressado.nomeSocialTooltip.button')}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: scale(24),
          paddingTop: scale(24),
          paddingBottom: scale(32),
        }}
        showsVerticalScrollIndicator={false}
      >

        <FieldLabel text={t('cadastroInteressado.fields.nome')} required />
        <TextInput
          value={nome}
          onChangeText={setNome}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.7)',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: scale(14)
          }}
        />

        <FieldLabel text={t('cadastroInteressado.fields.cep')} required />
        <TextInput
          value={cep}
          onChangeText={(text) => {
            setCep(text);
            buscarCep(text);
          }}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.7)',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: scale(14)
          }}
        />


        <FieldLabel text={t('cadastroInteressado.fields.numero')} required />
        <TextInput
          value={numero}
          onChangeText={setNumero}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.7)',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: scale(14)
          }}
        />

        <View style={{ marginBottom: scale(14) }}>
          <FieldLabel text={t('cadastroInteressado.fields.dataContato')} required />
          <TouchableOpacity
            onPress={() => setShowContatoPicker(true)}
            style={{
              height: 40,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.7)',
              borderRadius: 10,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: dataContato ? '#1E1919' : '#999' }}>
              {dataContato || t('cadastroInteressado.fields.selecionarData')}
            </Text>
          </TouchableOpacity>

          {showContatoPicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                setShowContatoPicker(false);
                if (selectedDate) {
                  setDataContato(formatDisplayDate(selectedDate));
                }
              }}
            />
          )}
        </View>

        <View style={{ marginBottom: scale(14) }}>
          <FieldLabel text={t('cadastroInteressado.fields.dataNascimento')} required />

          <TouchableOpacity
            onPress={() => setShowNascimentoPicker(true)}
            style={{
              height: 40,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.7)',
              borderRadius: 10,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: dataNascimento ? '#1E1919' : '#999' }}>
              {dataNascimento || t('cadastroInteressado.fields.selecionarData')}
            </Text>
          </TouchableOpacity>

          {showNascimentoPicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowNascimentoPicker(false);
                if (selectedDate) {
                  setDataNascimento(formatDisplayDate(selectedDate));
                }
              }}
            />
          )}
        </View>
        <FieldLabel text={t('cadastroInteressado.fields.email')} required />
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.7)',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: scale(14)
          }}
        />
        <FieldLabel text={t('cadastroInteressado.fields.celular')} required />
        <TextInput
          value={celular}
          onChangeText={setCelular}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.7)',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: scale(14)
          }}
        />
        <View style={{ marginBottom: scale(14) }}>
          <FieldLabel text={t('cadastroInteressado.fields.horarioPreferencia')} required />
          <View
            style={{
              width: '100%',
              height: 40,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: 10,
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Picker
              selectedValue={horarioPreferencia}
              onValueChange={(value) => setHorarioPreferencia(value)}
            >
              <Picker.Item label={t('cadastroInteressado.fields.selecioneHorario')} value="" />

              {horarios.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={`${item.horarioAulaInicio} - ${item.horarioAulaFim}`}
                  value={item.id}
                />
              ))}

            </Picker>
          </View>
        </View>
        <FieldLabel text={t('cadastroInteressado.fields.nomeSocial')} infoIcon />
        <TextInput
          value={nomeSocial}
          onChangeText={setNomeSocial}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.7)',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: scale(14)
          }}
        />

        <View style={{ flexDirection: 'row', gap: scale(12) }}>
          <Button
            title={t('cadastroInteressado.buttons.cancelar')}
            width="48%"
            backgroundColor="#FFFFFF"
            textColor="#E53935"
            borderWidth={1}
            borderColor="#E53935"
            onPress={() => navigation?.goBack()}
          />
          <Button
            title={t('cadastroInteressado.buttons.concluir')}
            width="48%"
            backgroundColor={camposObrigatoriosPreenchidos ? '#286DA8' : '#D9D9D9'}
            textColor="#FFFFFF"
            disabled={!camposObrigatoriosPreenchidos}
            onPress={() => { adicionarInteressado() }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CadastroInteressadoScreen;
