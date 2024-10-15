import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './src/utils/auth.context';
import Toast from 'react-native-toast-message';
import {LogBox} from 'react-native';
import MainNavigation from './src/main-navigation';
import {PhotoProvider} from './src/utils/photo.context';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
]);

LogBox.ignoreAllLogs();

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
