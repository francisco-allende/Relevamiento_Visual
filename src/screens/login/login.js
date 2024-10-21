import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {AppColors, AppButton} from '../../assets/styles/default-styles';
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

  const {doLogin} = useAuthenticationApi(
    email,
    password,
    setIsLoading,
    navigation,
  );

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('error', 'Por favor, completa todos los campos.', 3000);
      return;
    }
    await doLogin();
  };

  const easyLogin = async email => {
    await auth().signInWithEmailAndPassword(email, '12345678');
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ImageBackground
          style={{width: '100%', height: 220, transform: [{scaleX: 0.5}]}}
          imageStyle={{resizeMode: 'stretch'}}
          source={require('../../assets/img/portada.png')}
        />
      </View>

      <View style={styles.form}>
        <Text style={styles.welcomeTitle}>
          Bienvenido a Relevamiento Visual!
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Tu nombre de usuario"
            placeholderTextColor={AppColors.darklight}
            style={styles.inputStyle}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Tu contraseña"
            placeholderTextColor={AppColors.darklight}
            style={styles.inputStyle}
            secureTextEntry={showPasswordValue}
          />
          <TouchableOpacity
            style={styles.btnShowPassword}
            onPress={() => setShowPasswordValue(!showPasswordValue)}>
            <FontAwesomeIcon
              icon={faEyeSlash}
              style={{color: '#888888'}}
              size={25}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              AppButton.purple,
              !email || !password || isLoading ? AppButton.disabled : '',
            ]}
            onPress={handleLogin}
            disabled={!email || !password || isLoading}>
            <Text style={AppButton.text}>Ingresar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, AppButton.purple]}
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}>
            <Text style={AppButton.text}>Crear Cuenta</Text>
          </TouchableOpacity>

          <View style={styles.separatorContainer}>
            <View
              style={[styles.borderLine, {backgroundColor: 'white', flex: 1}]}
            />
            <Text style={styles.separatorText}></Text>
            <View
              style={[styles.borderLine, {backgroundColor: 'white', flex: 1}]}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.quickAccessButton,
              {backgroundColor: AppColors.purple},
            ]}
            onPress={() => easyLogin('adminuno@yopmail.com')}
            disabled={isLoading}>
            <Text style={styles.quickAccessText}>Inicio rápido Admin</Text>
          </TouchableOpacity>

          <View style={styles.separatorContainer}>
            <View
              style={[styles.borderLine, {backgroundColor: 'white', flex: 1}]}
            />
            <Text style={styles.separatorText}></Text>
            <View
              style={[styles.borderLine, {backgroundColor: 'white', flex: 1}]}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.quickAccessButton,
              {backgroundColor: AppColors.purple},
            ]}
            onPress={() => easyLogin('anonimo@yopmail.com')}
            disabled={isLoading}>
            <Text style={styles.quickAccessText}>Inicio rápido Anónimo</Text>
          </TouchableOpacity>

          <View style={styles.separatorContainer}>
            <View
              style={[styles.borderLine, {backgroundColor: 'white', flex: 1}]}
            />
            <Text style={styles.separatorText}></Text>
            <View
              style={[styles.borderLine, {backgroundColor: 'white', flex: 1}]}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.quickAccessButton,
              {backgroundColor: AppColors.purple},
            ]}
            onPress={() => easyLogin('tester@yopmail.com')}
            disabled={isLoading}>
            <Text style={styles.quickAccessText}>Inicio rápido Tester</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',
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
    backgroundColor: '#7B61FF',
  },
  form: {
    backgroundColor: '#1A1A40',
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  welcomeTitle: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 12,
    marginBottom: 25,
    color: '#AAB2FF',
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderColor: '#4A5EB8',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputStyle: {
    color: '#D9D9D9',
    paddingRight: 5,
    fontSize: 20,
    flex: 1,
    lineHeight: 25,
    paddingTop: 16,
    paddingBottom: 12,
  },
  btnShowPassword: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 25,
  },
  button: {
    marginTop: 10,
  },
  quickAccessTitle: {
    color: AppColors.white,
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  quickAccessButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  quickAccessText: {
    color: AppColors.white,
    fontSize: 16,
  },
  //separator:
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  borderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: AppColors.light,
  },
  separatorText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default LoginScreen;
