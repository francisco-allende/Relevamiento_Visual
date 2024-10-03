import auth from '@react-native-firebase/auth';
import showToast from '../functions/showToast'; // Asegúrate de que esta función existe

const useAuthenticationApi = (email, password, setIsLoading, navigation) => {
    const doLogin = async () => {
        setIsLoading(true);
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);

            if (!userCredential.user.emailVerified) {
                showToast("error", "Por favor, verifica tu correo antes de iniciar sesión.", 5000);
                await auth().signOut();
                return;
            }

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
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);

            console.log('Usuario registrado exitosamente!');
            showToast("success", "Cuenta creada correctamente!", 5000);

            await userCredential.user.sendEmailVerification();
            showToast("success", "Correo de verificación enviado. Revisa tu bandeja de entrada.", 5000);
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                showToast("error", "Email ya en uso", 5000);
            } else {
                console.log(error)
                showToast("error", "Error al crear la cuenta. Inténtalo de nuevo.", 5000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { doLogin, registerUser };
};

export default useAuthenticationApi;
