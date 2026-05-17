import React from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import ProfileButton from './ProfileButton';

const backgroundImage = require('../assets/images/background.png');

const AppHeader = ({ subtitulo, onBackPress }) => {
  const { width: screenWidth } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          width: '100%',
          backgroundColor: '#286DA8',
          paddingTop: insets.top + scale(16),
          paddingBottom: scale(14),
          paddingHorizontal: scale(18),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text
            style={{
              fontFamily: 'Mohave_600SemiBold',
              fontSize: scale(32),
              lineHeight: scale(30),
              color: '#F3F9F9',
            }}
          >
            {t('appHeader.logo')}
          </Text>

                    <Text
                        style={{
                            marginLeft: scale(8),
                            fontFamily: 'Poppins_500Medium',
                            fontSize: scale(15),
                            color: '#F3F9F9',
                        }}
                    >
                        |
                    </Text>

                    <Text
                        style={{
                            marginLeft: scale(8),
                            fontFamily: 'Poppins_500Medium',
                            fontSize: scale(15),
                            color: '#FFFFFF',
                        }}
                    >
                        {subtitulo}
                    </Text>
                </View>

                <ProfileButton size={scale(34)} />
            </View>

            <Image
                source={backgroundImage}
                style={{
                    width: '100%',
                    height: scale(76),
                    resizeMode: 'cover',
                }}
            />

      <TouchableOpacity
        onPress={onBackPress}
        activeOpacity={0.7}
        style={{
          position: 'absolute',
          left: scale(10),
          top: insets.top + scale(86),
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: scale(4),
        }}
      >
        <Text
          style={{
            fontFamily: 'Poppins_500Medium',
            fontSize: scale(14),
            color: '#1e4e66',
          }}
        >
          {t('appHeader.voltar')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;