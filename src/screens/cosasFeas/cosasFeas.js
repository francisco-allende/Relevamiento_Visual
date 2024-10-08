import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import showToast from '../../functions/showToast';
import firestore from '@react-native-firebase/firestore';
import { useAuthContext } from '../../utils/auth.context';
import GoBackScreen from '../../components/go-back';
import imgManager from '../../functions/imgManager';
import { AppColors } from '../../assets/styles/default-styles';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const CosasFeasScreen = ({ navigation }) => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [confirmedImages, setConfirmedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchImages = async () => {
        try {
          const confirmedSnapshot = await firestore()
            .collection('photos')
            .where('estado', '==', 'confirmada')
            .where('tipo', '==', 'fea')
            .orderBy('createdAt', 'desc')
            .get();

          const confirmedImages = confirmedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setConfirmedImages(confirmedImages);
          setPendingImages(imgManager.fotosTomadas);
        } catch (error) {
          console.error('Error fetching images: ', error);
        } finally {
          setLoading(false);
        }
      };

      fetchImages();
    }, [])
  );

  const handleConfirmImage = async () => {
    setLoading(true);
    try {
      for (const photo of imgManager.fotosTomadas) {
        const imageUrl = await imgManager.uploadImage(photo.path);
        await imgManager.saveImageUrlToFirestore(imageUrl, user, 'confirmada', 'fea');
      }
      imgManager.clearPhotos();
      setPendingImages([]);
      showToast('success', 'Imágenes subidas con éxito', 3000);
      // Actualizar la lista de imágenes confirmadas
      const newConfirmedSnapshot = await firestore()
        .collection('photos')
        .where('estado', '==', 'confirmada')
        .where('tipo', '==', 'fea')
        .orderBy('createdAt', 'desc')
        .get();

      const newConfirmedImages = newConfirmedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setConfirmedImages(newConfirmedImages);
    } catch (error) {
      console.error('Error confirming images: ', error);
      showToast('error', 'Error al subir las imágenes', 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectImage = () => {
    imgManager.clearPhotos();
    setPendingImages([]);
    showToast('info', 'Imágenes descartadas', 3000);
  };

  const handleCamera = () => {
    navigation.navigate("Camara", { navigation });
  };

  const handleVote = async (photoId) => {
    const success = await imgManager.voteForPhoto(photoId, user.uid);
    if (success) {
      showToast('success', 'Voto registrado con éxito', 2000);
      // Actualizar la lista de imágenes para reflejar el nuevo voto
      const updatedImages = confirmedImages.map(img => 
        img.id === photoId ? { ...img, votes: (img.votes || 0) + 1 } : img
      );
      setConfirmedImages(updatedImages);
    } else {
        showToast('error', 'Ya votaste por esta foto', 2000);
    }
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.imageInfo}>
        <Text style={styles.userName}>{item.userName} subió esta foto</Text>
        <Text style={styles.voteCount}>Votos: {item.votes || 0}</Text>
        <TouchableOpacity style={styles.voteButton} onPress={() => handleVote(item.id)}>
          <FontAwesomeIcon icon={faThumbsDown} size={20} color={AppColors.white} />
          <Text style={styles.voteButtonText}>Votar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPendingImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: `file://${item.path}` }} style={styles.image} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={AppColors.darkgray} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoBackScreen />
      <View style={styles.content}>
        {pendingImages.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Vista previa</Text>
            <FlatList
              data={pendingImages}
              renderItem={renderPendingImageItem}
              keyExtractor={(item, index) => `pending-${index}`}
              horizontal
              style={styles.previewList}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmImage}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={handleRejectImage}>
                <Text style={styles.buttonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Imágenes Confirmadas</Text>
            {confirmedImages.length > 0 ? (
              <FlatList
                data={confirmedImages}
                renderItem={renderImageItem}
                keyExtractor={(item) => item.id}
                style={styles.confirmedList}
              />
            ) : (
              <Text style={styles.noImagesText}>Se el primero en subir una cosa fea!</Text>
            )}
          </>
        )}
      </View>

      <TouchableOpacity style={styles.takePhotoButton} onPress={handleCamera}>
        <FontAwesomeIcon icon={faCamera} size={24} color={AppColors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',  // Fondo gris oscuro para cosas feas
  },
  content: {
    flex: 1,
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: AppColors.lightgray,
  },
  imageContainer: {
    margin: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  previewList: {
    marginBottom: 10,
  },
  confirmedList: {
    flex: 1,
  },
  noImagesText: {
    color: AppColors.lightgray,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  confirmButton: {
    backgroundColor: AppColors.darkgray,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: AppColors.gray,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  takePhotoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: AppColors.darkgray,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderWidth: 2,
    borderColor: AppColors.lightgray,
  },
  imageInfo: {
    padding: 10,
  },
  userName: {
    color: AppColors.lightgray,
    fontSize: 16,
    fontWeight: 'bold',
  },
  voteCount: {
    color: AppColors.lightgray,
    fontSize: 14,
    marginTop: 5,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.darkgray,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  voteButtonText: {
    color: AppColors.white,
    marginLeft: 10,
    fontSize: 16,
  },
});

export default CosasFeasScreen;