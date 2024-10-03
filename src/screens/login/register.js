import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Keyboard,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEyeSlash, faLock, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import VersionInfo from 'react-native-version-info';
import { AppColors, AppTxt, AppButton } from '../../assets/styles/default-styles';
import useAuthenticationApi from '../../api/authentication';
import showToast from '../../functions/showToast';

const RegisterScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordValue, setShowPasswordValue] = useState(true);
    const [keyboardShown, setKeyboardShown] = useState(false);

    const { registerUser } = useAuthenticationApi(email, password, setIsLoading, navigation);

    //Manejo de teclado
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const _keyboardDidShow = () => setKeyboardShown(true);
    const _keyboardDidHide = () => setKeyboardShown(false);

    // Validación de email y contraseña
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const isValidPassword = (password) => password.length >= 6;

    // Lógica de autenticación
    const handleRegister = async () => {
        if (!isValidEmail(email)) {
            showToast("error", "Por favor, ingresa un email válido.", 5000);
            return;
        }

        if (!isValidPassword(password)) {
            showToast("error", "La contraseña debe tener al menos 6 caracteres.", 5000);
            return;
        }

        await registerUser();
    };

    return (
        <View onPress={() => Keyboard.dismiss} style={styles.container}>
            <View style={[styles.form]}>

                <ScrollView>
                    <Text style={styles.welcomeTitle}>Crear Usuario</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholder="Email"
                            placeholderTextColor={AppColors.darklight}
                            style={styles.inputStyle} />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Contraseña"
                            placeholderTextColor={AppColors.darklight}
                            style={styles.inputStyle}
                            secureTextEntry={showPasswordValue}
                            onChangeText={(text) => setPassword(text)} />

                        <TouchableOpacity style={styles.btnShowPassword} onPress={() => { setShowPasswordValue(!showPasswordValue) }} >
                            <FontAwesomeIcon icon={faEyeSlash} style={{ color: '#888888' }} size={25} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ justifyContent: "center", marginTop: 25 }}>
                        <TouchableOpacity
                            style={[AppButton.purple]}
                            onPress={handleRegister}
                            disabled={(isLoading)}>
                            <Text style={AppButton.text}>Crear</Text>
                        </TouchableOpacity>

                    </View>

                </ScrollView>

            </View>

            <View style={styles.versionContainer}>
                <Text style={AppTxt.darklight}>v{VersionInfo.appVersion}</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.white
    },
    form: {
        backgroundColor: 'white',
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 30
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderColor: "#D9D5DC",
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    inputStyle: {
        color: "#000",
        paddingRight: 5,
        fontSize: 20,
        alignSelf: "stretch",
        flex: 1,
        lineHeight: 25,
        paddingTop: 16,
        paddingBottom: 12
    },
    welcomeTitle: {
        textAlign: 'center',
        fontSize: 24,
        marginTop: 12,
        marginBottom: 25,
        color: '#333333'
    },
    switchContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnShowPassword: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    versionContainer: {
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        height: 200,
        width: '100%',
        transform: [{ scaleX: 2 }],
        borderBottomStartRadius: 200,
        borderBottomEndRadius: 200,
        overflow: 'hidden',
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: AppColors.purple
    },
})

export default RegisterScreen;
