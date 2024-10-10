import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEyeSlash,
  faLock,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';
import {AppColors, AppTxt, AppButton} from '../../assets/styles/default-styles';
import {AuthContext} from '../../utils/auth.context';
import useAuthenticationApi from '../../api/authentication';
import showToast from '../../functions/showToast';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const {signIn} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordValue, setShowPasswordValue] = useState(true);
  const [keyboardShown, setKeyboardShown] = useState(false);

  const {doLogin, registerUser} = useAuthenticationApi(
    email,
    password,
    setIsLoading,
    navigation,
  );

  //Manejo de teclado
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const _keyboardDidShow = () => setKeyboardShown(true);
  const _keyboardDidHide = () => setKeyboardShown(false);

  // Validación de email y contraseña
  const isValidEmail = email => /\S+@\S+\.\S+/.test(email);
  const isValidPassword = password => password.length >= 6;

  // Lógica de autenticación
  const handleLogin = async isEasyLogin => {
    if (!isValidEmail(email)) {
      showToast('error', 'Por favor, ingresa un email válido.', 5000);
      return;
    }

    if (!isValidPassword(password)) {
      showToast(
        'error',
        'La contraseña debe tener al menos 6 caracteres.',
        5000,
      );
      return;
    }

    await doLogin();
  };

  const easyLogin = async () => {
    await auth().signInWithEmailAndPassword('test@yopmail.com', '12345678');
    navigation.navigate('Home');
  };

  return (
    <View onPress={() => Keyboard.dismiss} style={styles.container}>
      <View style={[styles.titleContainer]}>
        <ImageBackground
          style={{width: '100%', height: 220, transform: [{scaleX: 0.5}]}}
          imageStyle={{resizeMode: 'stretch'}}
          source={require('../../assets/img/portada.png')}></ImageBackground>
      </View>

      <View style={[styles.form]}>
        <Text style={styles.welcomeTitle}>
          Bienvenido a Relevamiento Visual!
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="Tu nombre de usuario"
            placeholderTextColor={AppColors.darklight}
            style={styles.inputStyle}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Tu contraseña"
            placeholderTextColor={AppColors.darklight}
            style={styles.inputStyle}
            secureTextEntry={showPasswordValue}
            onChangeText={text => setPassword(text)}
          />

          <TouchableOpacity
            style={styles.btnShowPassword}
            onPress={() => {
              setShowPasswordValue(!showPasswordValue);
            }}>
            <FontAwesomeIcon
              icon={faEyeSlash}
              style={{color: '#888888'}}
              size={25}
            />
          </TouchableOpacity>
        </View>

        <View style={{justifyContent: 'center', marginTop: 25}}>
          <TouchableOpacity
            style={[
              AppButton.purple,
              !email?.length || !password?.length || isLoading
                ? AppButton.disabled
                : '',
            ]}
            onPress={handleLogin}
            disabled={!email?.length || !password?.length || isLoading}>
            <Text style={AppButton.text}>Ingresar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{marginTop: 10}, AppButton.purple]}
            onPress={() =>
              navigation.navigate('Register', {navigation: navigation})
            }
            disabled={isLoading}>
            <Text style={AppButton.text}>Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{marginTop: 10}, AppButton.purple]}
            onPress={() => easyLogin()}
            disabled={isLoading}>
            <Text style={AppButton.text}>Inicio rápido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C', // Fondo oscuro
  },
  form: {
    backgroundColor: '#1A1A40', // Fondo del formulario oscuro
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderColor: '#4A5EB8', // Borde azul tenue
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputStyle: {
    color: '#D9D9D9', // Texto gris claro
    paddingRight: 5,
    fontSize: 20,
    alignSelf: 'stretch',
    flex: 1,
    lineHeight: 25,
    paddingTop: 16,
    paddingBottom: 12,
  },
  welcomeTitle: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 12,
    marginBottom: 25,
    color: '#AAB2FF', // Azul claro para destacar el título
  },
  btnShowPassword: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    height: 200,
    width: '100%',
    transform: [{scaleX: 2}],
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7B61FF', // Morado vibrante
  },
  buttonStyle: {
    backgroundColor: '#7B61FF', // Botón morado vibrante
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 15,
  },
  buttonText: {
    color: '#D9D9D9', // Texto gris claro en los botones
    textAlign: 'center',
    fontSize: 18,
  },
});

export default LoginScreen;
