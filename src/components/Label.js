import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Label = ({
  value,
  onChangeText,
  width = '100%',
  placeholder = '',
  secureTextEntry = false,
  isPassword = false,
  containerStyle,
  inputStyle,
  rightIcon,
  onRightPress,
}) => {
  const [passwordHidden, setPasswordHidden] = useState(secureTextEntry || isPassword);
  const showToggle = isPassword;
  const showCustomRightIcon = !showToggle && !!rightIcon;
  const shouldHideText = showToggle ? passwordHidden : secureTextEntry;

  return (
    <View
      style={{
        width: width,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 10,
        justifyContent: 'center',
        ...(containerStyle || {}),
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={shouldHideText}
        placeholderTextColor={'rgba(30, 25, 25, 0.45)'}
        autoCapitalize="none"
        style={{
          height: '100%',
          textAlignVertical: 'center',
          paddingLeft: 12,
          paddingRight: showToggle || showCustomRightIcon ? 42 : 12,
          fontFamily: 'Poppins_400Regular',
          fontSize: 16,
          color: '#1E1919',
          ...(inputStyle || {}),
        }}
      />

      {showToggle && (
        <TouchableOpacity
          onPress={() => setPasswordHidden((previousValue) => !previousValue)}
          style={{
            position: 'absolute',
            right: 12,
            height: '100%',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={passwordHidden ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#0D3C53"
          />
        </TouchableOpacity>
      )}

      {showCustomRightIcon && (
        <TouchableOpacity
          onPress={onRightPress}
          style={{
            position: 'absolute',
            right: 12,
            height: '100%',
            justifyContent: 'center',
          }}
          activeOpacity={onRightPress ? 0.7 : 1}
          disabled={!onRightPress}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Label;