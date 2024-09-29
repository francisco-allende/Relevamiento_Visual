import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { AppColors } from '../../assets/styles/default-styles';
import useAuthenticationApi from '../../api/authentication';

const ForgotPasswordScreen = ({ onClose }) => {
    const [cuit, setCuit] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { forgotPassword } = useAuthenticationApi();  // Adjusted to match your functional API component

    const doForgotPassword = () => {
        setIsLoading(true);

        forgotPassword(cuit)
            .then(result => {
                setIsLoading(false);
                let message;

                if (result) {
                    if (result.login_changepassword_failure !== undefined) {
                        message = result.login_changepassword_failure.errors[0].errorMessage;
                    } else if (result.result !== undefined && result.result === 'ok') {
                        message = "Te enviamos un correo electrónico con el instructivo para restablecer tu contraseña.";
                    }

                    Alert.alert(
                        'Restablecer Contraseña',
                        message,
                        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                        { cancelable: false }
                    );
                }
            })
            .catch(error => {
                setIsLoading(false);
                console.error(error);
            });
    };

    return (
        <View>
            <FontAwesomeIcon icon={faLock} style={styles.icon} size={26} />
            <Text>¡Tranquil@! Cambiar tu contraseña es fácil. Te enviaremos un enlace por correo electrónico para que puedas restablecerla.</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    value={cuit}
                    placeholder="Tu número de CUIT"
                    placeholderTextColor={AppColors.darklight}
                    keyboardType='numeric'
                    maxLength={11}
                    style={styles.inputStyle}
                    onChangeText={(text) => setCuit(text)}
                />
            </View>

            <View style={styles.actionsContainer}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                        <Text style={styles.btnTextCancel}>Cancelar</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 2, marginLeft: 15 }}>
                    <TouchableOpacity
                        onPress={doForgotPassword}
                        style={[styles.btn, ((!cuit?.length || cuit?.length < 11) || isLoading) ? styles.btnDisabled : '']}
                        disabled={(!cuit?.length || cuit?.length < 11) || isLoading}
                    >
                        <Text style={styles.btnText}>Restablecer Contraseña</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        borderBottomWidth: 1,
        borderColor: "#D9D5DC",
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 35,
        marginTop: 5
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
    actionsContainer: {
        flexDirection: 'row'
    },
    btn: {
        backgroundColor: "#673AB7",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 2,
        paddingVertical: 10,
        borderRadius: 11,
    },
    btnCancel: {
        backgroundColor: "#ddd",
        alignItems: "center",
        elevation: 2,
        paddingVertical: 10,
        borderRadius: 11,
    },
    btnDisabled: {
        opacity: .4
    },
    btnText: {
        color: "#fff",
        fontSize: 14
    },
    btnTextCancel: {
        color: "#444",
        fontSize: 14
    },
    icon: {
        alignSelf: 'center',
        color: '#673AB7',
        marginBottom: 20
    }
});

export default ForgotPasswordScreen;
