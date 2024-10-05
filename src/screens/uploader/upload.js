import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import imgManager  from '../../functions/imgManager'; 

const UploadScreen = ({ userId }) => {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleUpload = async () => {
        await imgManager.uploadImage(image, setImageUrl);
        if (imageUrl) {
            await imgManager.saveImageUrlToFirestore(imageUrl, userId);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Seleccionar imagen" onPress={() => imgManager.selectImage(setImage)} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            <Button title="Subir imagen" onPress={handleUpload} />
            {imageUrl && <Text>Imagen subida. URL: {imageUrl}</Text>}
        </View>
    );
};

export default UploadScreen;
