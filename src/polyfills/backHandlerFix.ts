// src/polyfills/backHandlerFix.ts
import { BackHandler } from 'react-native';

if (!BackHandler.removeEventListener) {
  BackHandler.removeEventListener = (_eventName, _handler) => {
    // Polyfill vazio — apenas para evitar erro
  };
}
