import React from 'react';
import { TouchableOpacity, Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../services/api';
import { ExitSolid } from '../assets/icons';
import SystemIcons from './systemIcons';

const ProfileButton = ({ size = 34 }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    Alert.alert(
      'Sair',
      'Deseja encerrar a sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        // backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SystemIcons
        icon={ExitSolid}
        size={size * 0.9}
        color="white"
      />
    </TouchableOpacity>
  );
};

export default ProfileButton;
