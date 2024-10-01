import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ImageBackground,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
    Keyboard,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEyeSlash, faLock, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import VersionInfo from 'react-native-version-info';
import MySwitch from '../../components/MySwitch';
import { AppColors, AppTxt, AppButton } from '../../assets/styles/default-styles';
import { AuthContext } from '../../utils/auth.context';
import useAuthenticationApi from '../../api/authentication';
import showToast from '../../functions/showToast';

const LoginScreen = ({ navigation }) => {

    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberLoginInfo, setRememberLoginInfo] = useState(false);
    const [autoLogin, setAutoLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordValue, setShowPasswordValue] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [keyboardShown, setKeyboardShown] = useState(false);

    const { doLogin, registerUser } = useAuthenticationApi(email, password, setIsLoading, navigation);

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
    const handleLogin = async () => {
        if (!isValidEmail(email)) {
            showToast("error", "Por favor, ingresa un email válido.", 5000);
            return;
        }

        if (!isValidPassword(password)) {
            showToast("error", "La contraseña debe tener al menos 6 caracteres.", 5000);
            return;
        }

        await doLogin();
    };

    return (
        <View onPress={() => Keyboard.dismiss} style={styles.container}>
            <View style={[styles.titleContainer]}>
                <ImageBackground
                    style={{ width: '100%', height: 220, transform: [{ scaleX: 0.5 }] }}
                    imageStyle={{ resizeMode: 'stretch' }}
                    source={require('../../assets/img/imgLoginBackground.png')}
                >
                    <View style={[styles.titleTextContainer]}>
                        <Image style={styles.logo} source={require('../../assets/img/logo.png')} />
                    </View>
                </ImageBackground>
            </View>

            <View style={[styles.form]}>

                <ScrollView>
                    <Text style={styles.welcomeTitle}>Bienvenido a Relevamiento Visual!</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholder="Tu nombre de usuario"
                            placeholderTextColor={AppColors.darklight}
                            style={styles.inputStyle} />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Tu contraseña"
                            placeholderTextColor={AppColors.darklight}
                            style={styles.inputStyle}
                            secureTextEntry={showPasswordValue}
                            onChangeText={(text) => setPassword(text)} />

                        <TouchableOpacity style={styles.btnShowPassword} onPress={() => { setShowPasswordValue(!showPasswordValue) }} >
                            <FontAwesomeIcon icon={faEyeSlash} style={{ color: '#888888' }} size={25} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.switchContainer}>
                        <MySwitch value={rememberLoginInfo} onSwitchValueChange={(value) => rememberLoginInfoHandler(value)} />
                        <Text style={styles.recordarDatos}>Recordar tu usuario</Text>
                    </View>

                    <View style={styles.switchContainer}>
                        <MySwitch value={autoLogin} onSwitchValueChange={(value) => autoLoginHandler(value)} />
                        <Text style={styles.recordarDatos}>Iniciar sesión automáticamente</Text>
                    </View>

                    <View style={{ justifyContent: "center", marginTop: 25 }}>
                        <TouchableOpacity
                            style={[AppButton.purple, (!email?.length || !password?.length || isLoading) ? AppButton.disabled : '']}
                            onPress={handleLogin}
                            disabled={(!email?.length || !password?.length || isLoading)}>
                            <Text style={AppButton.text}>Ingresar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[AppButton.purple]}
                            onPress={registerUser}
                            disabled={(isLoading)}>
                            <Text style={AppButton.text}>Crear Cuenta</Text>
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
    logo: {
        resizeMode: 'contain',
        width: 200,
        flex: 1,
    },
    form: {
        backgroundColor: 'white',
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 30
    },
    form_landscape: {
        paddingHorizontal: 80
    },
    statusBar: {
        flex: 0,
        backgroundColor: AppColors.purple
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
    btnFooterText: {
        color: "#673AB7",
        fontSize: 14
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
    footer: {
        height: Platform.OS === 'ios' ? 80 : 50,
        backgroundColor: '#eee',
        flexDirection: 'row',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0

    },
    footerIcon: {
        color: '#673AB7',
        marginRight: 10
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
    titleTextContainer: {
        flex: 1,
        // transform : [ { scaleX : 0.5 } ],
        alignItems: 'center',
        paddingTop: 10,
    },
    titleContainer_landscape: {
        height: 100
    },
    titleTextContainer_landscape: {
        paddingTop: 0
    }
})

export default LoginScreen;
