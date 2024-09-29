import 'react-native-gesture-handler';
import * as React from 'react';
import { useEffect } from 'react';
import UsersApi from './src/api/users';
import { Button, Text, TextInput, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './src/screens/splash/splash';
import LoginScreen from './src/screens/login/login';
import MainNavigation from './src/main-navigation';
import ContactUsScreen from './src/screens/login/contact-us';
import { AuthContext } from './src/utils/auth.context';
import useAuthenticationApi from './src/api/authentication';
import Toast from 'react-native-toast-message';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([]); // Ignora advertencias en la consola.

const Stack = createStackNavigator();

export default function App() {

  const usersApi = UsersApi();

  useEffect(() => {
      const fetchItems = async () => {
          const items = await usersApi.getItems();
          console.log(items); // Aquí puedes hacer algo con los elementos obtenidos
      };

      fetchItems();
  }, []);


  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            isLoading: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        case 'RE_LOGIN':
          return {
            ...prevState,
            isLoading: true,
            userToken: null
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null
    }
  );

  // Efecto para restaurar el token desde AsyncStorage (autologin).
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        const loginInfo = await AsyncStorage.getItem('LOGIN_INFO');
        if (loginInfo) {
          const _LOGININFO = JSON.parse(loginInfo);
          const { doLogin, doAbort } = useAuthenticationApi();

          if (_LOGININFO.autoLogin) {
            // Intentamos un nuevo login si autoLogin está activado.
            const result = await doLogin(_LOGININFO.username, _LOGININFO.password);
            if (result) {
              userToken = result.auth_token;
              await AsyncStorage.setItem("USER_TOKEN", userToken);
            }
          }
        }
      } catch (e) {
        console.error("Error during token restoration", e);
      }

      // Finalmente, restauramos el token en el estado de la app.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  // Contexto de autenticación que se pasa a los componentes.
  const authContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        const { doLogin } = useAuthenticationApi();
        const result = await doLogin(username, password);
        const userToken = result.auth_token;
        await AsyncStorage.setItem("USER_TOKEN", userToken);
        dispatch({ type: 'SIGN_IN', token: userToken });
      },
      signOut: async () => {
        await AsyncStorage.removeItem("USER_TOKEN");
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // Pantalla de carga mientras se verifica el token
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          ) : state.userToken == null ? (
            // Pantallas de autenticación
            <>
              <Stack.Screen name="SignIn" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen
                name="ContactInfo"
                component={ContactUsScreen}
                options={{
                  title: 'Contactanos',
                  headerStyle: { backgroundColor: '#3F3C9B' },
                  headerTintColor: 'white',
                  headerBackTitle: 'Atrás',
                }}
              />
            </>
          ) : (
            // Navegación principal después de iniciar sesión
            <Stack.Screen name="MainNavigation" component={MainNavigation} options={{ headerShown: false }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </AuthContext.Provider>
  );
}
