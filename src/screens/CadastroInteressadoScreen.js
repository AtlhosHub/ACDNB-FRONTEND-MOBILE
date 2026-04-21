import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import Label from '../components/Label';
import Button from '../components/Button';
import { horariosMock } from '../mocks/horariosMock';
import { formatDate, formatDisplayDate, formatToApiDateTime, formatToApiDate } from '../utils/formatters';
import { api } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const CadastroInteressadoScreen = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;

  const [nome, setNome] = useState('');
  const [cep, setCep] = useState('');
  const [dataContato, setDataContato] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [horarioPreferencia, setHorarioPreferencia] = useState('');
  const [nomeSocial, setNomeSocial] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  // const [horarios] = useState(horariosMock);
  const [authToken, setAuthToken] = useState(null);
  const [showContatoPicker, setShowContatoPicker] = useState(false);
  const [showNascimentoPicker, setShowNascimentoPicker] = useState(false);
  const [horarios, setHorarios] = useState([]);

  const camposObrigatoriosPreenchidos =
    nome.trim() !== '' &&
    cep.trim() !== '' &&
    dataContato.length === 10 &&
    dataNascimento.length === 10 &&
    email.trim() !== '' &&
    celular.trim() !== '' &&
    horarioPreferencia.trim() !== '';


  async function adicionarInteressado(authToken) {
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
        dataInclusao: new Date().toISOString().slice(0, 19),
        usuarioInclusao: 1, // substituir pelo id do usuário logado
        horarioPrefId: horarioPreferencia
      };

      const response = await api.post('/lista-espera/adicionar', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        }
      });

      console.log('Sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  }

  async function getHorarioPreferencia(token) {
    try {
      const response = await api.get('/horario-preferencia', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setHorarios(response.data);

    } catch (error) {
      console.error("Erro ao buscar horários:", error);
    }
  }

  useEffect(() => {
    const inicializarToken = async () => {
      try {
        let token = await AsyncStorage.getItem('authToken');
        setAuthToken(token);
        if (token) {
          getHorarioPreferencia(token);
        }
      } catch (erro) {
        console.error('Erro ao obter token:', erro);
      }
    };

    inicializarToken();
  }, []);

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
        subtitulo="Cadastro Interessado"
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
                    Nome Social
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
                  O nome social é o nome pelo qual uma pessoa prefere ser chamada no dia a dia,
                  podendo ser diferente do nome registrado em documentos oficiais.
                  {'\n\n'}
                  Preencha este campo caso queira ser identificado(a) de forma diferente do seu nome legal.
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
                    Entendi
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
        <View style={{ marginBottom: scale(14) }}>
          <FieldLabel text="Nome" required />
          <Label value={nome} onChangeText={setNome} />
        </View>

        <View style={{ marginBottom: scale(14) }}>
          <FieldLabel text="CEP" required />
          <Label value={cep} onChangeText={setCep} />
        </View>

        <View style={{ marginBottom: scale(14) }}>
          <FieldLabel text="Data de Contato" required />
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
              {dataContato || 'Selecionar data'}
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
          <FieldLabel text="Data de Nascimento" required />

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
              {dataNascimento || 'Selecionar data'}
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

        <View style={{ marginBottom: scale(14) }}>
          <FieldLabel text="Email" required />
          <Label value={email} onChangeText={setEmail} />
        </View>

        <View style={{ marginBottom: scale(14) }}>
          <FieldLabel text="Celular" required />
          <Label value={celular} onChangeText={setCelular} />
        </View>

        <View style={{ marginBottom: scale(14) }}>
          <FieldLabel text="Horário de Preferência" required />
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
              <Picker.Item label="Selecione um horário" value="" />

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

        <View style={{ marginBottom: scale(32) }}>
          <FieldLabel text="Nome Social" infoIcon />
          <Label value={nomeSocial} onChangeText={setNomeSocial} />
        </View>

        <View style={{ flexDirection: 'row', gap: scale(12) }}>
          <Button
            title="Cancelar"
            width="48%"
            backgroundColor="#FFFFFF"
            textColor="#E53935"
            borderWidth={1}
            borderColor="#E53935"
            onPress={() => navigation?.goBack()}
          />
          <Button
            title="Concluir"
            width="48%"
            backgroundColor={camposObrigatoriosPreenchidos ? '#286DA8' : '#D9D9D9'}
            textColor="#FFFFFF"
            disabled={!camposObrigatoriosPreenchidos}
            onPress={() => { adicionarInteressado(authToken) }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CadastroInteressadoScreen;
