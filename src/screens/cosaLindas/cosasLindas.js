import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import showToast from '../../functions/showToast';
import firestore from '@react-native-firebase/firestore';
import { useAuthContext } from '../../utils/auth.context';
import GoBackScreen from '../../components/go-back';
import imgManager from '../../functions/imgManager';
import { AppColors } from '../../assets/styles/default-styles';
import { usePhotoContext } from '../../utils/photo.context';

const CosasLindasScreen = ({navigation}) => {

    const { tempImages, clearPhotos } = usePhotoContext(); 
    const [images, setImages] = useState([]);
    const { user } = useAuthContext();  
    const [loading, setLoading] = useState(true);
    const [confirmedImages, setConfirmedImages] = useState([])

    useEffect(() => {
        const fetchConfirmedImages = async () => {
          try {
            const snapshot = await firestore()
              .collection('photos')
              .where('estado', '==', 'confirmadas') // Fetch only confirmed images
              .get();
            
            const fetchedConfirmedImages = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
    
            setConfirmedImages(fetchedConfirmedImages); // Store confirmed images
          } catch (error) {
            console.error('Error fetching confirmed images: ', error);
          }
        };
      
        fetchConfirmedImages();
      }, []); // Fetch confirmed images once
    

    useEffect(() => {
        const fetchPendingImages = async () => {
          try {
            const snapshot = await firestore()
              .collection('photos')
              .where('user', '==', user.email)
              .where('estado', '==', 'pendiente') // Only fetch pending images
              .get();
            
            const fetchedPendingImages = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
    
            setImages(fetchedPendingImages); // Only pending images
          } catch (error) {
            console.error('Error fetching pending images: ', error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchPendingImages();
      }, [tempImages]); 

      const handleConfirmImage = async (imageId) => {
        try {
            await firestore().collection('photos').doc(imageId).update({
                estado: 'confirmadas', // Mark image as confirmed
            });
            showToast('success', 'Imagen confirmada', 3000);
            setImages(images.filter(image => image.id !== imageId)); // Remove from pending images
        } catch (error) {
            console.error('Error confirming image: ', error);
        }
    };
    
    const handleRejectImage = async (imageId) => {
        try {
            await firestore().collection('photos').doc(imageId).update({
                estado: 'rechazadas', // Mark image as rejected
            });
            showToast('warning', 'Imagen rechazada', 3000);
            setImages(images.filter(image => image.id !== imageId)); // Remove from pending images
        } catch (error) {
            console.error('Error rejecting image: ', error);
        }
    };
    
    const renderPendingImages = () => (
        <>
            <FlatList
                data={images}
                renderItem={({ item, index }) => (
                    <View style={styles.imageContainer}>
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                    </View>
                )}
                keyExtractor={(item, index) => `${item.id}-${index}`}  
            />
            <Button 
                title="Confirmar" 
                onPress={() => handleConfirmImage()} 
            />
            <Button 
                title="Rechazar" 
                onPress={() => handleRejectImage()} 
            />
        </>
      );
      
       
      
    const handleCamera = () => {
        clearPhotos();
        navigation.navigate("Camara", {navigation})
    }
    
    if (loading) {
        return <Text>Cargando imágenes...</Text>;
    }

    return (
        <>
        <GoBackScreen />
        <View style={styles.container}>
        <FlatList
            data={confirmedImages}
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
                    {renderPendingImages()} 
                </View>
            )}
          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={styles.takePhotoButton} 
              onPress={() => handleCamera()}
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
