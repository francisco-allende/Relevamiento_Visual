import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../utils/auth.context';

const MisFotosScreen = () => {
  const [photos, setPhotos] = useState([]);
  const { user } = useContext(AuthContext); // Asegúrate de que el contexto devuelva el usuario actual

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!user?.uid) return;

      try {
        const photosSnapshot = await firestore()
          .collection('photos')
          .where('userId', '==', user.uid) // Filtrar fotos por el ID del usuario
          .orderBy('createdAt', 'desc')
          .get();

        const photosData = photosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPhotos(photosData);
      } catch (error) {
        console.error('Error al obtener las fotos: ', error);
      }
    };

    fetchPhotos();
  }, [user]);

  const renderPhotoItem = ({ item }) => (
    <View style={styles.photoItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.photo} />
    </View>
  );

  return (
    <View style={styles.container}>
      {photos.length > 0 ? (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={renderPhotoItem}
          numColumns={2} // Mostrar imágenes en 2 columnas
        />
      ) : (
        <Text style={styles.noPhotosText}>Aún no has subido fotos.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  photoItem: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  noPhotosText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    color: '#555',
  },
});

export default MisFotosScreen;
