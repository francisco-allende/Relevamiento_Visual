import auth from '@react-native-firebase/auth';
import showToast from '../functions/showToast'; // Asegúrate de que esta función existe

const useAuthenticationApi = (email, password, setIsLoading, navigation) => {
    const doLogin = async () => {
        setIsLoading(true);
        try {
            await auth().signInWithEmailAndPassword(email, password);
            console.log('Login exitoso');
            navigation.navigate("Home");
        } catch (error) {
            console.error('Login failed: ', error.message);
            showToast("error", "Credenciales inválidas", 5000);
        } finally {
            setIsLoading(false);
        }
    };

    const registerUser = async () => {
        setIsLoading(true);
        try {
            await auth().createUserWithEmailAndPassword(email, password);
            console.log('Usuario registrado exitosamente!');
            showToast("success", "Cuenta creada correctamente!", 5000);
            doLogin();
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                showToast("error", "Email ya en uso", 5000);
            } else {
                showToast("error", "Error al crear la cuenta. Inténtalo de nuevo.", 5000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { doLogin, registerUser };
};

export default useAuthenticationApi;
