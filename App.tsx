import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/splash/splash';
import LoginScreen from './src/screens/login/login';
import MainNavigation from './src/main-navigation';
import { AuthProvider } from './src/utils/auth.context';
import Toast from 'react-native-toast-message';
import { LogBox } from 'react-native';
import HomeScreen from './src/screens/home/home';

LogBox.ignoreLogs([]); // Ignora advertencias en la consola.

const Stack = createStackNavigator();

export default function App() {

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          {/* Splash al iniciar la app */}
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen} 
            options={{ headerShown: false }} 
          />
          
          {/* Login */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />

          {/* MainNavigation */}
          <Stack.Screen 
            name="MainNavigation" 
            component={MainNavigation} 
            options={{ headerShown: false }} 
          />

          {/* Home  */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} 
          />


        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </AuthProvider>
  );
}
