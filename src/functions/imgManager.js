import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const selectImage = (setImage) => {
    const options = {
        mediaType: 'photo',
        quality: 0.7,
    };

    launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('Usuario canceló la selección de imagen');
        } else if (response.error) {
            console.error('Error al seleccionar imagen: ', response.error);
        } else {
            const uri = response.assets[0].uri;
            setImage(uri);
        }
    });
};

const uploadImage = async (imageUri, setImageUrl) => {
    if (!imageUri) {
        console.error("No hay imagen seleccionada");
        return;
    }

    const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const reference = storage().ref(`/images/${fileName}`);

    const task = reference.putFile(imageUri);

    try {
        await task;
        console.log('Imagen subida a Firebase Storage!');
        const downloadUrl = await reference.getDownloadURL();
        setImageUrl(downloadUrl);  // Guardar la URL para usarla más tarde
        console.log('URL de la imagen:', downloadUrl);
    } catch (error) {
        console.error('Error al subir imagen: ', error);
    }
};

const saveImageUrlToFirestore = async (imageUrl, userId) => {
    try {
        await firestore().collection('photos').add({
            userId: userId,
            imageUrl: imageUrl,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
        console.log('URL guardada en Firestore');
    } catch (error) {
        console.error('Error al guardar la URL en Firestore: ', error);
    }
};

const imgManager = {
    selectImage,
    uploadImage,
    saveImageUrlToFirestore,
};

export default imgManager;



