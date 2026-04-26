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
  // horarioPreferencia.trim() !== '';


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

      const response = await api.post('/lista-espera/adicionar', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        }
      });
      alert("Interessado cadastrado com sucesso!");
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

  async function buscarCep(valorCep) {
    try {
      const cepLimpo = valorCep.replace(/\D/g, '');

      if (cepLimpo.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado', 'Digite um CEP válido.');
        return;
      }

      setLogradouro(data.logradouro);
      setBairro(data.bairro);
      setCidade(data.localidade);
      setEstado(data.uf);

    } catch (error) {
      alert('Erro', 'Não foi possível consultar o CEP.');
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

        <FieldLabel text="Nome" required />
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

        <FieldLabel text="CEP" required />
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


        <FieldLabel text="Número" required />
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
        <FieldLabel text="Email" required />
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
        <FieldLabel text="Celular" required />
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
        <FieldLabel text="Nome Social" infoIcon />
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
