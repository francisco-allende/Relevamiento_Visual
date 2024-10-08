import { launchImageLibrary } from 'react-native-image-picker';
import { Alert, Platform } from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import showToast from './showToast';
import { Camera } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';

const imgManager = {
    cameraRef: null,
    fotosTomadas: [],
  
    setCameraRef(ref) {
      this.cameraRef = ref;
    },
  
    clearPhotos() {
      this.fotosTomadas = [];
    },
  
    async takePhoto() {
      if (!this.cameraRef || !this.cameraRef.current) {
        console.log("Camera reference is null");
        return;
      }
      
      const photo = await this.cameraRef.current.takePhoto({
        flash: 'off',
        qualityPrioritization: 'speed',
      });
      
      // Guardar la foto en el almacenamiento local
      const fileName = `photo_${Date.now()}.jpg`;
      const localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
      await RNFS.moveFile(photo.path, localPath);
      
      console.log("Local path:", localPath);
      
      showToast('success', 'Foto tomada con éxito', 1000);
      
      const newPhoto = { ...photo, path: localPath };
      this.fotosTomadas.push(newPhoto);
      
      return newPhoto;
    },
  
    async uploadImage(imageUri) {
      if (!imageUri) {
        console.error("No hay imagen seleccionada");
        return null;
      }
  
      const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const reference = storage().ref(`/images/${fileName}`);
  
      try {
        const task = reference.putFile(imageUri);
        await task;
        console.log('Imagen subida a Firebase Storage!');
        const downloadUrl = await reference.getDownloadURL();
        return downloadUrl;
      } catch (error) {
        console.error('Error al subir imagen: ', error);
        throw error;
      }
    },
  
    async saveImageUrlToFirestore(imageUrl, user, estado = 'confirmada', tipo = 'linda') {
      if (!imageUrl || !user) {
        console.error("Faltan datos para guardar la imagen");
        return null;
      }
  
      try {
        const docRef = await firestore().collection('photos').add({
          imageUrl: imageUrl,
          user: user.email || 'Usuario desconocido',
          userName: user.displayName || user.email.split('@')[0] || 'Usuario',
          estado: estado,
          tipo: tipo,
          createdAt: firestore.FieldValue.serverTimestamp(),
          votes: 0,
        });
        console.log('URL guardada en Firestore con ID:', docRef.id);
        return docRef.id;
      } catch (error) {
        console.error('Error al guardar la URL en Firestore: ', error);
        throw error;
      }
    },

  async voteForPhoto(photoId, userId) {
    const photoRef = firestore().collection('photos').doc(photoId);
    const userVotesRef = firestore().collection('userVotes').doc(userId);

    try {
      await firestore().runTransaction(async (transaction) => {
        const photoDoc = await transaction.get(photoRef);
        const userVotesDoc = await transaction.get(userVotesRef);

        if (!photoDoc.exists) {
          throw "La foto no existe";
        }

        const photoData = photoDoc.data();
        const userVotes = userVotesDoc.exists ? userVotesDoc.data().votes || {} : {};

        // Verificar si el usuario ya votó por esta foto
        if (userVotes[photoId]) {
          throw "Ya has votado por esta foto";
        }

        // Actualizar los votos de la foto
        transaction.update(photoRef, {
          votes: firestore.FieldValue.increment(1)
        });

        // Registrar el voto del usuario
        transaction.set(userVotesRef, {
          votes: { ...userVotes, [photoId]: true }
        }, { merge: true });
      });

      console.log('Voto registrado con éxito');
      return true;
    } catch (error) {
      console.error('Error al votar:', error);
      return false;
    }
  },

  async requestPermissions() {
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