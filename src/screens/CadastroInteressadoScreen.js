import React, { useState } from 'react';
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
import { formatDate } from '../utils/formatters';

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
  const [horarios] = useState(horariosMock);

  const camposObrigatoriosPreenchidos =
    nome.trim() !== '' &&
    cep.trim() !== '' &&
    dataContato.length === 10 &&
    dataNascimento.length === 10 &&
    email.trim() !== '' &&
    celular.trim() !== '' &&
    horarioPreferencia.trim() !== '';

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
          <Label
            value={dataContato}
            onChangeText={(text) => setDataContato(formatDate(text))}
            placeholder="DD/MM/AAAA"
          />
        </View>

        <View style={{ marginBottom: scale(14) }}>
          <FieldLabel text="Data de Nascimento" required />
          <Label
            value={dataNascimento}
            onChangeText={(text) => setDataNascimento(formatDate(text))}
            placeholder="DD/MM/AAAA"
          />
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
              style={{
                height: 40,
                color: horarioPreferencia ? '#1E1919' : 'rgba(30, 25, 25, 0.45)',
              }}
              dropdownIconColor="#0D3C53"
            >
              <Picker.Item label="Selecione um horário" value="" color="rgba(30, 25, 25, 0.45)" />
              {horarios.map((item) => (
                <Picker.Item key={item.id} label={item.label} value={item.label} color="#1E1919" />
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
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CadastroInteressadoScreen;
