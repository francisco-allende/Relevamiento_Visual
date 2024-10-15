import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import showToast from '../../functions/showToast';
import firestore from '@react-native-firebase/firestore';
import {useAuthContext} from '../../utils/auth.context';
import GoBackScreen from '../../components/go-back';
import imgManager from '../../functions/imgManager';
import {AppColors} from '../../assets/styles/default-styles';
import {useFocusEffect} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faThumbsDown,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import PhotoStats from '../stats/photo-stats';
import {format} from 'date-fns';

const {width} = Dimensions.get('window');

const CosasFeasScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [confirmedImages, setConfirmedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [showStats, setShowStats] = useState(false);

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
    }, []),
  );

  const handleConfirmImage = async () => {
    setLoading(true);
    try {
      for (const photo of imgManager.fotosTomadas) {
        const imageUrl = await imgManager.uploadImage(photo.path);
        await imgManager.saveImageUrlToFirestore(
          imageUrl,
          user,
          'confirmada',
          'fea',
        );
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
    navigation.navigate('Camara', {navigation});
  };

  const handleVote = async photoId => {
    const success = await imgManager.voteForPhoto(photoId, user.uid);
    if (success) {
      showToast('success', 'Voto registrado con éxito', 2000);
      // Actualizar la lista de imágenes para reflejar el nuevo voto
      const updatedImages = confirmedImages.map(img =>
        img.id === photoId ? {...img, votes: (img.votes || 0) + 1} : img,
      );
      setConfirmedImages(updatedImages);
    } else {
      showToast('error', 'Ya votaste por esta foto', 2000);
    }
  };

  const renderImageItem = ({item}) => (
    <View style={styles.imageContainer}>
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      <View style={styles.imageInfo}>
        <Text style={styles.userName}>{item.userName} subió esta foto</Text>
        <Text style={styles.dateText}>
          {format(item.createdAt.toDate(), 'dd/MM/yyyy HH:mm:ss')}
        </Text>
        <Text style={styles.voteCount}>Votos: {item.votes || 0}</Text>
        <TouchableOpacity
          style={styles.voteButton}
          onPress={() => handleVote(item.id)}>
          <FontAwesomeIcon
            icon={faThumbsDown}
            size={20}
            color={AppColors.white}
          />
          <Text style={styles.voteButtonText}>Votar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPendingImageItem = ({item}) => (
    <View style={styles.imageContainer}>
      <Image source={{uri: `file://${item.path}`}} style={styles.image} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GoBackScreen />
        <TouchableOpacity
          onPress={() => setShowStats(true)}
          style={styles.statsIcon}>
          <FontAwesomeIcon
            icon={faChartBar}
            size={24}
            color={AppColors.white}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {pendingImages.length > 0 ? (
          <>
            <Text style={styles.previewTitle}>Vista previa</Text>
            <FlatList
              data={pendingImages}
              renderItem={renderPendingImageItem}
              keyExtractor={(item, index) => `pending-${index}`}
              style={styles.previewList}
              contentContainerStyle={styles.previewListContent}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmImage}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={handleRejectImage}>
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
                keyExtractor={item => item.id}
                style={styles.confirmedList}
              />
            ) : (
              <Text style={styles.noImagesText}>
                ¡Sé el primero en subir una cosa fea!
              </Text>
            )}
          </>
        )}
      </View>

      {pendingImages.length === 0 && (
        <TouchableOpacity style={styles.takePhotoButton} onPress={handleCamera}>
          <FontAwesomeIcon icon={faCamera} size={24} color={AppColors.white} />
        </TouchableOpacity>
      )}

      <Modal
        visible={showStats}
        animationType="slide"
        onRequestClose={() => setShowStats(false)}>
        <PhotoStats type="fea" />
        <TouchableOpacity
          style={styles.closeStatsButton}
          onPress={() => setShowStats(false)}>
          <Text style={styles.closeStatsButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C', // Fondo más oscuro para cosas feas
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: AppColors.darkgray,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.lightgray,
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: AppColors.lightgray,
  },
  previewList: {
    flex: 1,
  },
  previewListContent: {
    paddingBottom: 20,
  },
  pendingImageContainer: {
    width: '100%',
    marginBottom: 20,
  },
  pendingImage: {
    width: '100%',
    height: width * 0.6,
    borderRadius: 10,
  },
  confirmedList: {
    flex: 1,
  },
  imageContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: width * 0.6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  imageInfo: {
    padding: 10,
  },
  userName: {
    color: AppColors.lightgray,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    color: AppColors.lightgray,
    fontSize: 14,
    marginTop: 5,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: 'rgba(40, 167, 69, 0.7)', // Verde apagado
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: 'rgba(220, 53, 69, 0.7)', // Rojo apagado
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  takePhotoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1A1A1A', // Gris oscuro fijo
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1,
    borderWidth: 2,
    borderColor: AppColors.black, // Mantenemos el borde negro
  },
  noImagesText: {
    color: AppColors.lightgray,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  statsIcon: {
    padding: 10,
  },
  closeStatsButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: AppColors.darkgray,
    padding: 10,
    borderRadius: 5,
  },
  closeStatsButtonText: {
    color: AppColors.white,
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2C', // Fondo gris oscuro
  },
  previewDateText: {
    color: AppColors.lightgray,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  dateText: {
    color: AppColors.lightgray,
    fontSize: 14,
    marginTop: 5,
  },
});

export default CosasFeasScreen;
