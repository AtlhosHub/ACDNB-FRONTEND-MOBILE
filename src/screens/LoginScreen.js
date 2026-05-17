import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import Label from '../components/Label';
import { login } from '../services/api';

const bolinhaImage = require('../assets/images/orange_ball.png');
const iconeImage = require('../assets/images/ACDNB_icon.png');

const LoginScreen = () => {
  const { t } = useTranslation();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigation = useNavigation();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const scale = (size) => (screenWidth / 375) * size;

  const circleWidth = Math.min(screenWidth * 0.7, 263);
  const circleHeight = (circleWidth * 242) / 263;
  const containerWidth = Math.min(screenWidth * 0.9, 340);
  const containerHeight = scale(590);
  const iconWidth = Math.min(screenWidth * 0.195, 73);
  const iconHeight = (iconWidth * 75) / 73;

  const handleLogin = async () => {
    setErro('');

    if (!usuario.trim()) {
      setErro(t('login.errors.emptyUser'));
      return;
    }
    if (!senha.trim()) {
      setErro(t('login.errors.emptyPassword'));
      return;
    }

    setCarregando(true);
    try {
      await login(usuario.trim(), senha);
      navigation.replace('Main');
    } catch (e) {
      setErro(e.message ?? t('login.errors.unexpected'));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      horizontal={false}
      bounces={false}
      overScrollMode="never"
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
      }}
    >
      <View
        style={{
            flex: 1,
            position: 'relative',
            alignItems: 'center',
            paddingHorizontal: '5%',
            paddingTop: screenHeight * 0.06,
            paddingBottom: scale(20),
          }}
        >
          <Image
            source={bolinhaImage}
            style={{
              position: 'absolute',
              width: circleWidth,
              height: circleHeight,
              top: -circleHeight * 0.2,
              right: -circleWidth * 0.34,
              resizeMode: 'contain',
            }}
          />

          <View
            style={{
              width: '100%',
              alignItems: 'flex-start',
              marginTop: screenHeight * 0.06,
              marginBottom: screenHeight * 0.03,
              paddingLeft: scale(8),
            }}
          >
            <Text
              style={{
                fontFamily: 'Mohave_600SemiBold',
                fontSize: scale(60),
                color: '#0D3C53',
                lineHeight: scale(56),
                marginBottom: scale(4),
              }}
            >
              {t('login.title')}
            </Text>

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: scale(18),
                color: '#0D3C53',
                lineHeight: scale(20),
                textAlign: 'left',
              }}
            >
              {t('login.subtitle')}
            </Text>
          </View>

          <View
            style={{
              width: containerWidth,
              minHeight: containerHeight,
              borderWidth: 2,
              borderColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: scale(20),
              paddingHorizontal: scale(20),
              paddingVertical: scale(25),
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Image
              source={iconeImage}
              style={{
                width: iconWidth,
                height: iconHeight,
                marginBottom: scale(20),
                resizeMode: 'contain',
              }}
            />

            <Text
              style={{
                fontFamily: 'Poppins_600SemiBold',
                fontSize: scale(18),
                color: '#0D3C53',
                marginBottom: scale(25),
                textAlign: 'center',
              }}
            >
              {t('login.clubName')}
            </Text>

            <View
              style={{
                width: '100%',
                marginBottom: scale(18),
                alignItems: 'flex-start',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  fontSize: scale(14),
                  color: '#0D3C53',
                  marginBottom: scale(8),
                }}
              >
                {t('login.email')}
              </Text>
              <Label value={usuario} onChangeText={setUsuario} width="100%" placeholder="" keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View
              style={{
                width: '100%',
                marginBottom: scale(12),
                alignItems: 'flex-start',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  fontSize: scale(14),
                  color: '#0D3C53',
                  marginBottom: scale(8),
                }}
              >
                {t('login.password')}
              </Text>
              <Label value={senha} onChangeText={setSenha} width="100%" placeholder="" isPassword />
            </View>

            {!!erro && (
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: scale(13),
                  color: '#C0392B',
                  textAlign: 'center',
                  marginBottom: scale(12),
                  paddingHorizontal: scale(4),
                }}
              >
                {erro}
              </Text>
            )}

            <View
              style={{
                width: '100%',
                alignItems: 'flex-end',
                marginBottom: scale(25),
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: scale(14),
                  color: '#286DA8',
                  textDecorationLine: 'underline',
                }}
              >
                {t('login.forgotPassword')}
              </Text>
            </View>

            {carregando ? (
              <ActivityIndicator size="large" color="#286DA8" style={{ marginTop: scale(8) }} />
            ) : (
              <Button
                title={t('login.submit')}
                width="100%"
                onPress={handleLogin}
              />
            )}
          </View>
        </View>
    </ScrollView>
  );
};

export default LoginScreen;
