import React from "react";
import {
  TouchableOpacity,
  Text,
  useWindowDimensions,
  View,
  Image,
} from "react-native";

const backgroundImg = require("../assets/images/background.png");

const AppHeader = ({ subtitulo, onBackPress }) => {
  const { width: screenWidth } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          width: "100%",
          backgroundColor: "#286DA8",
          paddingTop: scale(16),
          paddingBottom: scale(14),
          paddingHorizontal: scale(18),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text
            style={{
              fontFamily: "Mohave_600SemiBold",
              fontSize: scale(32),
              lineHeight: scale(30),
              color: "#f3f9f9",
            }}
          >
            SMASH
          </Text>
          <Text
            style={{
              marginLeft: scale(8),
              fontFamily: "Poppins_500Medium",
              fontSize: scale(15),
              color: "#f3f9f9",
            }}
          >
            |
          </Text>
          <Text
            style={{
              marginLeft: scale(8),
              fontFamily: "Poppins_500Medium",
              fontSize: scale(15),
              color: "#f3f9f9",
            }}
          >
            {subtitulo}
          </Text>
        </View>
        <View
          style={{
            width: scale(34),
            height: scale(34),
            borderRadius: scale(17),
            backgroundColor: "#d9d9d9",
          }}
        ></View>
        <Image
          source={backgroundImg}
          style={{ width: "100%", height: scale(76), resizeMode: "cover" }}
        ></Image>
        <TouchableOpacity
          onPress={onBackPress}
          activeOpacity={0.7}
          style={{
            position: "absolute",
            left: scale(10),
            top: scale(86),
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: scale(4),
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: scale(14),
              color: "#0D3C53",
            }}
          >
            ← Voltar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppHeader;