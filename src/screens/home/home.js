import React from 'react';
import { View, Text, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../utils/auth.context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
    const { signOut } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleSingOut = async () => {
        await signOut();
        navigation.navigate("Login")
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Bienvenido a la pantalla principal!</Text>
            <Button title="Cerrar Sesión" onPress={handleSingOut} />
        </View>
    );
};

export default HomeScreen;
