import { launchImageLibrary } from 'react-native-image-picker';
import { Alert } from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import showToast from './showToast';
import { Camera } from 'react-native-vision-camera';
import { useRef } from 'react';

function getRef() {
    const camera = useRef(null);
    return camera
}

const imgManager = {
    cameraRef: null, 
    fotosTomadas:[],

    setCameraRef(ref) {
      this.cameraRef = ref;
    },

    async takePhoto(){

        if (!this.cameraRef || !this.cameraRef.current) {
            console.log("Camera reference is null");
            return;
        }
        
          const photo = await imgManager.cameraRef.current.takePhoto({
            flash: 'off',
            qualityPrioritization: 'speed',
          });
          console.log("Photo taken: ", photo);
          this.fotosTomadas.push(photo)

          return this.fotosTomadas;
        
          //await this.uploadImage(photo.path);
          showToast('success', 'Foto tomada con éxito', 3000);
    },
    
    selectImage(setImage){
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
    },
    
    async uploadImage(imageUri){
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
            return downloadUrl;
        } catch (error) {
            console.error('Error al subir imagen: ', error);
        }
    },
    
    async saveImageUrlToFirestore(imageUrl, userId){
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
    },
    
    async requestPermissions(){
        const permission = await Camera.requestCameraPermission();
    
        if (permission === 'denied') {
          Alert.alert(
            'Permiso de cámara requerido',
            'La aplicación necesita acceso a la cámara para tomar fotos. Ve a la configuración y habilita el permiso.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Abrir Configuración', onPress: () => Camera.openSettings() },
            ]
          );
        }
    
        return permission;
      }


};

export default imgManager;



