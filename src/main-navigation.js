import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/splash/splash';
import LoginScreen from './screens/login/login';
import HomeScreen from './screens/home/home';
import RegisterScreen from './screens/login/register';
import CosasLindasScreen from './screens/cosaLindas/cosasLindas';
import CosasFeasScreen from './screens/cosasFeas/cosasFeas';
import MisFotosScreen from './screens/misFotos/misFotos';
import CameraScreen from './screens/camera/camera';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
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

      {/* Register */}
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}  
        options={{ headerShown: false }} 
      />

      {/* Home  */}
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />

      {/* Lindas  */}
      <Stack.Screen 
        name="CosasLindas" 
        component={CosasLindasScreen}
        options={{ headerShown: false }} 
      />

      {/* Feas  */}
      <Stack.Screen 
        name="CosasFeas" 
        component={CosasFeasScreen} 
        options={{ headerShown: false }} 
      />

      {/* Camara  */}
      <Stack.Screen 
        name="Camara" 
        component={CameraScreen} 
        options={{ headerShown: false }} 
      />

      {/* Mis fotos subidas  */}
      <Stack.Screen 
        name="MisFotos" 
        component={MisFotosScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;
