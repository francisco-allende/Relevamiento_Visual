import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import showToast from '../../functions/showToast';
import firestore from '@react-native-firebase/firestore';
import { useAuthContext } from '../../utils/auth.context';
import CameraScreen from '../camera/camera';
import GoBackScreen from '../../components/go-back';
import imgManager from '../../functions/imgManager';
import { AppColors } from '../../assets/styles/default-styles';
import { usePhotoContext } from '../../utils/photo.context';

const CosasLindasScreen = ({navigation}) => {

    const { tempImages } = usePhotoContext(); 
    const [images, setImages] = useState([]);
    const { user } = useAuthContext();  // Obtener el usuario actual
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
          try {
            // Obtén todos los IDs de las imágenes temporales
            const tempImageIds = tempImages.map(image => image.path); // Suponiendo que `path` es el ID que usas
      
            // Si hay imágenes temporales, haz la consulta
            if (tempImageIds.length > 0) {
              const snapshot = await firestore()
                .collection('photos')
                .where('id', 'in', tempImageIds) // Filtrar por IDs
                .get();
      
              const fetchedImages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
      
              setImages(fetchedImages); // Establecer solo las imágenes temporales
            }
          } catch (error) {
            console.error('Error fetching images: ', error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchImages();
      }, [tempImages]);
    
      const handleUploadAll = async () => {
        try {
          await Promise.all(tempImages.map(async (image) => {
            const imageUrl = await imgManager.uploadImage(image.path);
            await imgManager.saveImageUrlToFirestore(imageUrl, user.email);
          }));
          showToast('success', 'Todas las imágenes han sido subidas', 3000);
        } catch (error) {
          console.error('Error uploading images: ', error);
        }
      };
    
      // Muestra la vista de fotos temporales
      const renderTempImages = () => (
        <View style={{ margin: 10 }}>
          <Text>Fotos tomadas: {tempImages.length}</Text>
          <FlatList
            data={tempImages}
            renderItem={({ item }) => (
              <Image source={{ uri: item.uri }} style={{ width: 100, height: 100, margin: 5 }} />
            )}
            keyExtractor={(item) => item.id}
            horizontal
          />
          <Button 
            title="Subir todas las fotos" 
            onPress={handleUploadAll} 
          />
        </View>
      );
    

    if (loading) {
        return <Text>Cargando imágenes...</Text>;
    }

    return (
        <>
        <GoBackScreen />
        <View style={styles.container}>
          <FlatList
            data={images}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
            {tempImages.length === 0 ? (
                <Text style={styles.noPhotosText}>No has tomado fotos todavía.</Text>
            ) : (
                <View>
                    {tempImages.length === 1 ? (
                    <Text style={styles.photoCountText}>Has tomado una foto.</Text>
                    ) : (
                    <Text style={styles.photoCountText}>Has tomado {tempImages.length} fotos.</Text>
                    )}
                    {renderTempImages()} 
                </View>
            )}
          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={styles.takePhotoButton} 
              onPress={() => navigation.navigate("Camara", {navigation})}
            >
              <Text style={styles.takePhotoButtonText}>Tomar foto</Text>
            </TouchableOpacity>
          </View>
        </View>
        </>
    );
};
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8', // Fondo gris claro
      },
      imageContainer: {
        margin: 10,
        alignItems: 'center',
      },
      image: {
        width: 200,
        height: 200,
        borderRadius: 10,
      },
      voteButtons: {
        flexDirection: 'row',
        marginTop: 10,
      },
      photoCountText: {
        textAlign: 'center',
        margin: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: AppColors.dark
      },
      noPhotosText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
      },
      tempImagesContainer: {
        margin: 10,
        alignItems: 'center',
      },
      tempImage: {
        width: 100,
        height: 100,
        margin: 5,
      },
      bottomContainer: {
        marginTop: 'auto',
        padding: 20,
        alignItems: 'center',
      },
      takePhotoButton: {
        backgroundColor: '#007BFF', // Color azul
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        elevation: 2,
      },
      takePhotoButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
    });

export default CosasLindasScreen;
