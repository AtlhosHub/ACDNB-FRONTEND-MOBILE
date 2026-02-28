import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({ title, width = '100%', backgroundColor = '#286DA8', onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: width,
        height: 40,
        backgroundColor: backgroundColor,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
      }}
    >
      <Text
        style={{
          fontFamily: 'Poppins_500Medium',
          fontSize: 18,
          color: '#F5F5F5',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
