import Config from '../config/config';
import Token from '../utils/token';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthenticationApi = () => {
    let acontroller;
    let signal;

    // Función para hacer login
    const doLogin = async (user, password) => {
        acontroller = new AbortController();
        signal = acontroller.signal;

        const data = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            signal: signal,
            body: JSON.stringify({
                username: user,
                password: password,
            }),
        };

        try {
            const response = await fetch(`${Config.API_URL}/account/authenticate`, data);
            return await response.json();
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    // Función para recuperar contraseña
    const forgotPassword = async (user) => {
        try {
            const response = await fetch(`${Config.API_URL}/account/forgotPassword?cuit=` + user);
            const json = await response.json();
            return json;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // Función para obtener información completa del usuario actual
    const getFullCurrentUserInfo = async () => {
        const data = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (await Token().getToken()),
            },
        };

        try {
            const USERINFO = await AsyncStorage.getItem('USERINFO');
            if (USERINFO) {
                return JSON.parse(USERINFO);
            }

            const response = await fetch(`${Config.API_URL}/Clientes/getFullUserInfo`, data);
            const json = await response.json();

            const userInfo = { ...json };
            await AsyncStorage.setItem('USERINFO', JSON.stringify(userInfo));

            return userInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // Función para abortar una petición
    const doAbort = () => {
        if (acontroller) {
            acontroller.abort();
        }
    };

    return {
        doLogin,
        forgotPassword,
        getFullCurrentUserInfo,
        doAbort,
    };
};

export default useAuthenticationApi;
