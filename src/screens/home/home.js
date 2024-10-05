import React from 'react';
import { View, Text, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../utils/auth.context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import UploadScreen from '../uploader/upload';

const HomeScreen = () => {
    const { signOut } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogOut = async () => {
        await signOut();
        navigation.navigate("Login")
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Bienvenido a la pantalla principal!</Text>
            <Button title="Cerrar Sesión" onPress={handleLogOut} />
            <UploadScreen />
        </View>
    );
};

export default HomeScreen;
