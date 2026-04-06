import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Mohave_600SemiBold } from '@expo-google-fonts/mohave';
import LoginScreen from './src/screens/LoginScreen';
import ListaEsperaScreen from './src/screens/ListaEsperaScreen';
import MensalidadesScreen from './src/screens/MensalidadesScreen';
import CadastroInteressadoScreen from './src/screens/CadastroInteressadoScreen';

const TELAS = [
  { key: 'login',       label: 'Login',        component: CadastroInteressadoScreen },
  { key: 'listaEspera', label: 'Lista Espera',  component: ListaEsperaScreen },
  { key: 'mensalidades',label: 'Mensalidades',  component: MensalidadesScreen },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Mohave_600SemiBold,
  });

  const [telaAtual, setTelaAtual] = useState('login');

  if (!fontsLoaded) return null;

  const Tela = TELAS.find((t) => t.key === telaAtual).component;

  return (
    <View style={styles.container}>
      <Tela />

      {/* ── Barra de navegação temporária para apresentação ── */}
      <View style={styles.navBar}>
        {TELAS.map((t) => {
          const ativa = t.key === telaAtual;
          return (
            <TouchableOpacity
              key={t.key}
              onPress={() => setTelaAtual(t.key)}
              style={[styles.navBtn, ativa && styles.navBtnAtivo]}
            >
              <Text style={[styles.navLabel, ativa && styles.navLabelAtivo]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#0d3c53',
    paddingVertical: 8,
    paddingHorizontal: 6,
    gap: 6,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  navBtnAtivo: {
    backgroundColor: '#286da8',
  },
  navLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
  },
  navLabelAtivo: {
    color: '#ffffff',
  },
});
