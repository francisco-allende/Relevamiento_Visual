import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { AuthContext } from '../../utils/auth.context';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import AppContainer from '../../assets/app-container/container';

const HomeScreen = () => {
    const { signOut } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleCosasLindas = () => navigation.navigate("CosasLindas", {navigation:navigation});
    const handleCosasFeas = () => navigation.navigate("CosasFeas", {navigation:navigation});

    const handleLogOut = async () => {
        await signOut();
        navigation.navigate("Login");
    }

    const handleUserPhotos = () => {
        navigation.navigate("UserPhotos"); // Suponiendo que esta es la pantalla donde ve sus fotos.
    }

    return (
        <AppContainer containerStyles={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleLogOut}>
                    <FontAwesomeIcon icon={faSignOutAlt} size={20} style={styles.iconMenu} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Relevamiento Visual</Text>
                <TouchableOpacity onPress={handleUserPhotos}>
                    <FontAwesomeIcon icon={faUser} size={20} style={styles.iconMenu} />
                </TouchableOpacity>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleCosasLindas}>
                    <ImageBackground
                        source={require('../../assets/img/cosas_lindas.png')}
                        style={styles.imageBackground}>
                        <Text style={styles.buttonText}>Cosas Lindas</Text>
                    </ImageBackground>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleCosasFeas}>
                    <ImageBackground
                        source={require('../../assets/img/cosas_feas.png')}
                        style={styles.imageBackground}>
                        <Text style={styles.buttonText}>Cosas Feas</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        </AppContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    headerContainer: {
        padding: 15,
        alignItems: 'center',
        backgroundColor: '#3F3C9B',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        textTransform: 'capitalize',
        textAlign: 'center',
        flex: 1
    },
    iconMenu: {
        color: '#FFF'
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'space-between'
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5
    }
});

export default HomeScreen;
