import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAuthContext} from '../../utils/auth.context';
import GoBackScreen from '../../components/go-back';
import {AppColors} from '../../assets/styles/default-styles';
import {format} from 'date-fns';

const MisFotosScreen = ({navigation}) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);
  const {user} = useAuthContext();

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!user?.email) return;

      try {
        const photosSnapshot = await firestore()
          .collection('photos')
          .where('user', '==', user.email)
          .orderBy('createdAt', 'desc')
          .get();

        const photosData = photosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          imageLoading: true,
        }));

        setPhotos(photosData);
      } catch (error) {
        console.error('Error al obtener las fotos: ', error);
      } finally {
        setLoading(false);
        // Esperar un poco antes de mostrar el mensaje de "no hay fotos"
        setTimeout(() => {
          setShowNoPhotosMessage(true);
        }, 1000); // Espera 1 segundo
      }
    };

    fetchPhotos();
  }, [user]);

  const handleImageLoad = id => {
    setPhotos(prevPhotos =>
      prevPhotos.map(photo =>
        photo.id === id ? {...photo, imageLoading: false} : photo,
      ),
    );
  };

  const renderPhotoItem = ({item}) => (
    <View style={styles.photoItem}>
      <View style={styles.photoContainer}>
        {item.imageLoading && (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={AppColors.white}
          />
        )}
        <Image
          source={{uri: item.imageUrl}}
          style={styles.photo}
          onLoad={() => handleImageLoad(item.id)}
        />
      </View>
      <View style={styles.photoInfoContainer}>
        <Text style={styles.photoInfoText}>
          Sección: {item.tipo === 'linda' ? 'Linda' : 'Fea'}
        </Text>
        <Text style={styles.photoInfoText}>Votos: {item.votes || 0}</Text>
        <Text style={styles.photoInfoText}>
          Fecha: {format(item.createdAt.toDate(), 'dd/MM/yyyy HH:mm:ss')}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={AppColors.white} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoBackScreen navigation={navigation} />
      <Text style={styles.title}>Mis Fotos</Text>
      {photos.length > 0 ? (
        <FlatList
          data={photos}
          keyExtractor={item => item.id}
          renderItem={renderPhotoItem}
          contentContainerStyle={styles.photoList}
        />
      ) : showNoPhotosMessage ? (
        <Text style={styles.noPhotosText}>Aún no has subido fotos.</Text>
      ) : (
        <ActivityIndicator size="large" color={AppColors.white} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2A5A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    textAlign: 'center',
    marginVertical: 20,
  },
  photoList: {
    padding: 16,
  },
  photoItem: {
    backgroundColor: AppColors.darkgray,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  photoContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  photoInfoContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fondo semi-transparente para el contenedor de información
  },
  photoInfoText: {
    color: 'yellow',
    fontSize: 18,
    marginBottom: 5,
  },
  noPhotosText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    color: AppColors.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#120E29',
  },
});

export default MisFotosScreen;
