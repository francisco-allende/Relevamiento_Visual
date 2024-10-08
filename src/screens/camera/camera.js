import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Touchable, Animated, Text } from 'react-native';
import { Camera, useCameraDevice} from 'react-native-vision-camera';
import imgManager from '../../functions/imgManager';
import { usePhotoContext } from '../../utils/photo.context';
import { useAuthContext } from '../../utils/auth.context';

const CameraScreen = ({navigation}) => {

  const { addPhoto, clearPhotos } = usePhotoContext(); 
  const { user } = useAuthContext();  
  const camera = useRef(null);
  const device = useCameraDevice('back');
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false); 
  const buttonScale = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
    clearPhotos()
    imgManager.setCameraRef(camera); 
    handleAskForPermission()
  }, []);

  if (device == null) {
    console.log("No camera devices found");
    return <Text>Cargando cámara...</Text>;
  }

  const handleAskForPermission = async () =>{
    permiso = await imgManager.requestPermissions();
    setCameraPermission(permiso)
  }

  const handleTakePhoto = async () => {
    if (camera.current) {
      
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
  
      let fotos = await imgManager.takePhoto(camera);
      
      if (fotos && fotos.length > 0) {
        setPhotoTaken(true)

        // Subir cada foto y luego agregarla a las fotos temporales
        await Promise.all(fotos.map(async (photo) => {
          try {
            // Subir la imagen a Firebase Storage
            const imageUrl = await imgManager.uploadImage(photo.path);
            
            // Guardar la URL y los datos en Firestore
            await imgManager.saveImageUrlToFirestore(photo.path, imageUrl, user.email);
            
            // Una vez que la imagen esté subida y guardada, agregarla al contexto temporal
            addPhoto({
              ...photo,  // Mantener los datos originales de la foto
              imageUrl: imageUrl  // Añadir la URL de Firebase Storage
            });
  
            console.log(`Imagen subida y guardada: ${photo.path}`);
          } catch (error) {
            console.error(`Error al subir la foto ${photo.path}: `, error);
          }
        }));
  
        showToast('success', 'Fotos subidas y guardadas correctamente', 3000);
      } else {
        setPhotoTaken(false)
        showToast('error', 'No se tomaron fotos', 3000);
      }
    }
  };  

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        onInitialized={() => setIsCameraInitialized(true)}
      />

      {isCameraInitialized && (
        <>
          {/* Botón de captura */}
          <View style={styles.captureButton}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity onPress={handleTakePhoto} style={styles.innerCircle} />
            </Animated.View>
          </View>

          {/* Botón "Listo" si ya se tomó al menos una foto */}
          {photoTaken && (
            <TouchableOpacity style={styles.readyButton} onPress={() => navigation.goBack()}>
              <Text style={styles.readyButtonText}>Listo</Text>
            </TouchableOpacity>
          )}

          {/* Flecha para volver si no se ha tomado ninguna foto */}
          {!photoTaken && (
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 25,
  },
  readyButton: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    top: 10,
    center: 100,
  },
  readyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CameraScreen;
