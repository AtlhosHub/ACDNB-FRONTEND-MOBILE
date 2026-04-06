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
import { formatDate, formatCep } from '../utils/formatters';

const CadastroInteressadosScreen = ({ navigation }) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const scale = (size) => (screenWidth / 375) * size;
    const [nome, setNome] = useState('');
    const [cep, setCep] = useState('');
    const [dataContato, setDataContato] = useState('');
    const [dataNasc, setDataNasc] = useState('');
    const [email, setEmail] = useState('');
    const [celular, setCelular] = useState('');
    const [horarioPreferencia, setHorarioPreferencia] = useState('');
    const [nomeSocial, setNomeSocial] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const camposObrigatoriosPreenchidos = nome.trim() !== '' &&
        cep.trim() !== '' &&
        dataContato.length === 10 &&
        dataNasc.length === 10 &&
        email.trim() !== '' &&
        celular.trim() !== '' &&
        horarioPreferencia.trim() !== '';

    const FieldLabel = ({
        text, required, infoIcon,
    }) => (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: scale(4),
        }} >

            <Text style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: scale(13),
                color: '#1e1919',
            }}>
                {text}

            </Text>

            {required &&
                (
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: scale(13),
                        color: '#e53935',
                        marginLeft: scale(2)
                    }}>
                        *
                    </Text>
                )}

            {
                infoIcon && (
                    <TouchableOpacity onPress={() => setTooltipVisible(true)} activeOpacity={0.7} style={{
                        marginLeft: scale(4)
                    }}>
                        <Ionicons name="help-circle" size={scale(16)} color="#286da8"></Ionicons>
                    </TouchableOpacity>
                )
            }
        </View>
    );
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#ffffff'
        }}>
            <AppHeader subtitulo='Cadastro Interessado' onBackPress={() => navigation?.goBack()}>

            </AppHeader>
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
                                    Nome social é o nome pelo qual travestis, transexuais e pessoas transgênero preferem ser chamadas e reconhecidas no dia a dia, sendo diferente do nome que consta na certidão de nascimento (nome civil).
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
            <ScrollView contentContainerStyle={{
                paddingHorizontal: scale(24),
                paddingTop: scale(24),
                paddingBottom: scale(32)
            }}
                showsVerticalScrollIndicator={false}>
                <View style={{
                    marginBottom: scale(14)
                }}> 
                    <FieldLabel text="Nome" required />

                    <Label value={nome} onChangeText={setNome} />
                </View>
                <View style={{
                    marginBottom: scale(14),
                }}>
                    <FieldLabel text="CEP" required />

                    <Label value={cep} onChangeText={(text) => setCep(formatCep(text))} placeholder='00000-000' />
                </View>
                <View style={{
                    marginBottom: scale(14),
                }}>
                    <FieldLabel text="Data de Contato" required />

                    <Label value={dataContato} onChangeText={(text) => setDataContato(formatDate(text))} placeholder='DD/MM/AAAA' />
                </View>
                <View style={{
                    marginBottom: scale(14),
                }}>
                    <FieldLabel text="Data de Nascimento" required />

                    <Label value={dataNasc} onChangeText={(text) => setDataNasc(formatDate(text))} placeholder='DD/MM/AAAA' />
                </View>
                <View style={{
                    marginBottom: scale(14),
                }}>
                    <FieldLabel text="Email" required />

                    <Label value={email} onChangeText={setEmail} placeholder='exemplo@email.com' />
                </View>
                <View style={{
                    marginBottom: scale(14),
                }}>
                    <FieldLabel text="Celular" required />

                    <Label value={celular} onChangeText={setCelular} placeholder='(00) 00000-0000' />
                </View>
                <View style={{
                    marginBottom: scale(14),
                }}>
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
          ><Picker >

          </Picker>
          </View>
                </View>
                <View style={{
                    marginBottom: scale(14),
                }}>
                    <FieldLabel text="Nome Social" infoIcon />

                    <Label value={nomeSocial} onChangeText={setNomeSocial} />
                </View>
            </ScrollView>
        </View>
    );
};

export default CadastroInteressadosScreen;