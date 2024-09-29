import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const Token = () => {

    // Función para obtener el token almacenado
    const getToken = async () => {
        try {
            return await AsyncStorage.getItem('TOKEN');
        } catch (error) {
            console.error("Error al obtener el token:", error);
            return null;
        }
    };

    // Función para obtener el token decodificado
    const getDecodedToken = async () => {
        try {
            const _token = await AsyncStorage.getItem('TOKEN');
            return _token ? jwt_decode(_token) : null;
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    };

    return { getToken, getDecodedToken };
};

export default Token;
