import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, StyleSheet, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Mohave_600SemiBold } from '@expo-google-fonts/mohave';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './src/screens/LoginScreen';
import ListaEsperaScreen from './src/screens/ListaEsperaScreen';
import MensalidadesScreen from './src/screens/MensalidadesScreen';
import TrainerAIScreen from './src/screens/TrainerAIScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Mensalidades:      'cash-outline',
  'Lista de Espera': 'people-outline',
  'Trainer AI':      'sparkles-outline',
};

function TabIcon({ routeName, focused, color }) {
  const anim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: focused ? 1 : 0,
      useNativeDriver: false,
      tension: 120,
      friction: 8,
    }).start();
  }, [focused]);

  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.30)'],
  });

  return (
    <Animated.View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
      <Ionicons name={TAB_ICONS[routeName]} size={22} color={color} />
    </Animated.View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => (
          <TabIcon routeName={route.name} focused={focused} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Mensalidades" component={MensalidadesScreen} />
      <Tab.Screen name="Lista de Espera" component={ListaEsperaScreen} />
      <Tab.Screen name="Trainer AI" component={TrainerAIScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Mohave_600SemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0d3c53',
    borderTopWidth: 0,
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  tabLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },
  iconWrapper: {
    width: 52,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
