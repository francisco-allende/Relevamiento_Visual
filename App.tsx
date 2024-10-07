import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/utils/auth.context';
import Toast from 'react-native-toast-message';
import { LogBox } from 'react-native';
import MainNavigation from './src/main-navigation'; 
import { PhotoProvider } from './src/utils/photo.context';

LogBox.ignoreLogs(["ReactImageView: Image source 'null' doesn't exist", ]); // Ignora advertencias en la consola.

export default function App() {
  return (
    <AuthProvider>
      <PhotoProvider>
        <NavigationContainer>
          <MainNavigation /> 
        </NavigationContainer>
        <Toast />
      </PhotoProvider>
    </AuthProvider>
  );
}
