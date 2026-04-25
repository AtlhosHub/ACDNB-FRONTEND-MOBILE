import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY } from './src/services/api';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});