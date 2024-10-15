import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEyeSlash, faUser} from '@fortawesome/free-solid-svg-icons';
import {AppColors, AppTxt, AppButton} from '../../assets/styles/default-styles';
import useAuthenticationApi from '../../api/authentication';
import showToast from '../../functions/showToast';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordValue, setShowPasswordValue] = useState(true);

  const {registerUser} = useAuthenticationApi(
    email,
    password,
    setIsLoading,
    navigation,
  );

  const handleRegister = async () => {
    if (!email || !password) {
      showToast('error', 'Por favor, completa todos los campos.', 3000);
      return;
    }
    await registerUser();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesomeIcon icon={faUser} size={60} color={AppColors.white} />
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>Crear Usuario</Text>

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
            placeholder="Contraseña"
            placeholderTextColor={AppColors.darklight}
            style={styles.inputStyle}
            secureTextEntry={showPasswordValue}
          />
          <TouchableOpacity
            style={styles.btnShowPassword}
            onPress={() => setShowPasswordValue(!showPasswordValue)}>
            <FontAwesomeIcon
              icon={faEyeSlash}
              style={{color: AppColors.darklight}}
              size={25}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, AppButton.purple]}
          onPress={handleRegister}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Crear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, AppButton.purple]}
          onPress={() => navigation.navigate('Login')}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A40',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: '#3F3C9B',
  },
  form: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: AppColors.darklight,
    marginBottom: 20,
  },
  inputStyle: {
    flex: 1,
    color: AppColors.white,
    fontSize: 18,
    paddingVertical: 10,
  },
  btnShowPassword: {
    padding: 10,
  },
  button: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
