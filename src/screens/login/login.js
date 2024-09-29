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
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEyeSlash, faLock, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import VersionInfo from 'react-native-version-info';
import { AuthContext } from '../../utils/auth.context';
import MySwitch from '../../components/MySwitch';
import ForgotPasswordScreen from './forgot-password';
import { AppColors, AppTxt, AppButton } from '../../assets/styles/default-styles';

const LoginScreen = ({ navigation }) => {
    const { signIn } = useContext(AuthContext);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [rememberLoginInfo, setRememberLoginInfo] = useState(false);
    const [autoLogin, setAutoLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordValue, setShowPasswordValue] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [orientation, setOrientation] = useState('');
    const [keyboardShown, setKeyboardShown] = useState(false);

    useEffect(() => {


        AsyncStorage.getItem('LOGIN_INFO').then((result) => {
            if (result !== null) {
                const _loginInfo = JSON.parse(result);
                setUsername(_loginInfo.username);
                setPassword(_loginInfo.password);

                if (_loginInfo.autoLogin) {
                    doLogin();
                }
            }
        });

        getOrientation();

        Dimensions.addEventListener('change', () => {
            getOrientation();
        });

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const doLogin = async () => {
        setIsLoading(true);

        const _loginInfo = {
            username: rememberLoginInfo ? username : null,
            password: autoLogin ? password : null,
            rememberLoginInfo,
            autoLogin,
        };

        AsyncStorage.setItem('LOGIN_INFO', JSON.stringify(_loginInfo));

        signIn(username, password);

        setTimeout(() => {
            setIsLoading(false);
        }, 10000);
    };

    const rememberLoginInfoHandler = (value) => {
        setRememberLoginInfo(value);
    };

    const autoLoginHandler = (value) => {
        setAutoLogin(value);
    };

    const getOrientation = () => {
        if (Dimensions.get('window').width < Dimensions.get('window').height) {
            setOrientation('portrait');
        } else {
            setOrientation('landscape');
        }
    };

    const _keyboardDidShow = () => {
        setKeyboardShown(true);
    };

    const _keyboardDidHide = () => {
        setKeyboardShown(false);
    };

    return (
        <View onPress={() => Keyboard.dismiss} style={styles.container}>
            <View
                style={[
                    styles.titleContainer,
                    orientation === 'landscape' ? styles.titleContainer_landscape : null,
                    Platform.OS === 'android' && keyboardShown ? styles.titleContainer_landscape : null,
                ]}
            >
                <ImageBackground
                    style={{ width: '100%', height: 220, transform: [{ scaleX: 0.5 }] }}
                    imageStyle={{ resizeMode: 'stretch' }}
                    source={require('../../assets/img/imgLoginBackground.png')}
                >
                    <View
                        style={[
                            styles.titleTextContainer,
                            orientation === 'landscape' ? styles.titleTextContainer_landscape : null,
                            Platform.OS === 'android' && keyboardShown ? styles.titleTextContainer_landscape : null,
                        ]}
                    >
                        <Image style={styles.logo} source={require('../../assets/img/logo.png')} />
                    </View>
                </ImageBackground>
            </View>

            <View style={[styles.form, (orientation == 'landscape') ? styles.form_landscape : null]}>

                <ScrollView>
                    <Text style={styles.welcomeTitle}>Bienvenido a Scan And Share!</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={username}
                            onChangeText={(text) => setUsername(text)}
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
                        <TouchableOpacity style={[AppButton.purple, (!username?.length || !password?.length || isLoading) ? AppButton.disabled : '']} onPress={doLogin} disabled={(!username?.length || !password?.length || isLoading)}>
                            <Text style={AppButton.text}>Ingresar</Text>
                        </TouchableOpacity>
                    </View>



                </ScrollView>

            </View>

            <View style={styles.versionContainer}>
                <Text style={AppTxt.darklight}>v{VersionInfo.appVersion}</Text>
            </View>

            <View style={styles.footer}>

                <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowModal(true)}>
                    <View style={styles.forgotPasswordContainer}>
                        <FontAwesomeIcon icon={faLock} style={styles.footerIcon} size={16} />
                        <Text style={styles.btnFooterText}>Olvidé mi contraseña</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('ContactInfo')}>
                    <View style={styles.contactContainer}>
                        <FontAwesomeIcon icon={faPhoneAlt} style={styles.footerIcon} size={16} />
                        <Text style={styles.btnFooterText}>Contactanos</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => {
                    console.log("Modal has been closed.");
                }}>
                <View style={styles.modalCenteredView}>
                    <View style={styles.modalView}>
                        <ForgotPasswordScreen onClose={() => setShowModal(false)} />
                    </View>

                </View>
            </Modal>
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
    forgotPasswordContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: "#ddd"
    },
    contactContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerIcon: {
        color: '#673AB7',
        marginRight: 10
    },
    modalCenteredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'rgba(0,0,0,.4)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
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
