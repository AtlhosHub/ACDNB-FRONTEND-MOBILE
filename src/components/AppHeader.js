import React from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';

const backgroundImage = require('../assets/images/background.png');

const AppHeader = ({ subtitle, onBackPress }) => {
  const { width: screenWidth } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;

  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          width: '100%',
          backgroundColor: '#286DA8',
          paddingTop: scale(16),
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
            SMASH
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
            {subtitle}
          </Text>
        </View>

        <View
          style={{
            width: scale(34),
            height: scale(34),
            borderRadius: scale(17),
            backgroundColor: '#D9D9D9',
          }}
        />
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
          top: scale(86),
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: scale(4),
        }}
      >
        <Text
          style={{
            fontFamily: 'Poppins_500Medium',
            fontSize: scale(14),
            color: '#0D3C53',
          }}
        >
          ← Voltar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;