import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuthContext } from '../../utils/auth.context';
import CameraScreen from '../camera/camera';
import GoBackScreen from '../../components/go-back';

const CosasLindasScreen = ({navigation}) => {
    const [images, setImages] = useState([]);
    const { user } = useAuthContext();  // Obtener el usuario actual
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const snapshot = await firestore().collection('photos').get();
                const fetchedImages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setImages(fetchedImages);
            } catch (error) {
                console.error('Error fetching images: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const handleVote = async (imageId, vote) => {
        try {
            // Check if user has already voted for this image
            const userVoteRef = firestore()
                .collection('votos')
                .doc(`${user.uid}_${imageId}`);
                
            const userVote = await userVoteRef.get();

            if (userVote.exists) {
                console.log('User has already voted for this image');
                return;
            }

            // Save the vote in Firestore
            await userVoteRef.set({
                userId: user.uid,
                imageId: imageId,
                vote: vote,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            console.log(`User voted ${vote} on image ${imageId}`);
        } catch (error) {
            console.error('Error saving vote: ', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={{ margin: 10, alignItems: 'center' }}>
            <Image source={{ uri: item.imageUrl }} style={{ width: 200, height: 200 }} />
            <Text>¿Bonito o Feo?</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Button title="Bonito" onPress={() => handleVote(item.id, 'bonito')} />
                <Button title="Feo" onPress={() => handleVote(item.id, 'feo')} />
            </View>
        </View>
    );

    if (loading) {
        return <Text>Cargando imágenes...</Text>;
    }

    return (
        <>
        <GoBackScreen/>
        <Button 
            onPress={()=> navigation.navigate("Camara", {navigation:navigation})} 
            title="Tomar foto"> Tomar foto 
        </Button>
        {/* 
        <FlatList
            data={images}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            />
        */}
            </>
    );
};

const styles = StyleSheet.create({

})

export default CosasLindasScreen;
