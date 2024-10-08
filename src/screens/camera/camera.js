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
  const [fotosTomadas, setFotosTomadas] = useState([])

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
  
      let foto = await imgManager.takePhoto(camera);
      fotosTomadas.push(foto)
      setPhotoTaken(true)
    }
  };  

  async function handleUpload(){
    imgManager.clearPhotos()

    if (!Array.isArray(fotosTomadas)) {
      console.error('fotosTomadas no está definido o no es un array');
      return;
  }
    if (fotosTomadas) {
      setPhotoTaken(true)
      fotosTomadas.forEach(x=> imgManager.fotosTomadas.push(x))
    }
    setPhotoTaken(false)
    navigation.goBack()
  }

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
            <TouchableOpacity style={styles.readyButton} onPress={() => handleUpload()}>
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
