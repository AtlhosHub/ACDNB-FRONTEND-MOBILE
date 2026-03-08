import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({
  title,
  width = '100%',
  backgroundColor = '#286DA8',
  onPress,
  height = 40,
  borderRadius = 10,
  fontSize = 18,
  textColor = '#F5F5F5',
  borderWidth = 0,
  borderColor = 'transparent',
  style,
  textStyle,
  disabled = false,
  rightIcon,
  iconGap = 4,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        width: width,
        height: height,
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
        borderWidth: borderWidth,
        borderColor: borderColor,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
        ...(style ||  {}),
      }}
    >
      <Text
        style={{
          fontFamily: 'Poppins_500Medium',
          fontSize: fontSize,
          color: textColor,
          marginRight: rightIcon ? iconGap : 0,
          ...(textStyle || {}),
        }}
      >
        {title}
      </Text>
      {rightIcon}
    </TouchableOpacity>
  );
};

export default Button;