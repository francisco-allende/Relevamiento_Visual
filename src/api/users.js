import firestore from '@react-native-firebase/firestore';

const UsersApi = () => {
    let acontroller;
    let signal;

    const saveItem = async () => {
        try {
            await firestore().collection('users').add({
                name: 'Item Name',
                description: 'Item Description',
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            console.log('Item added!');
        } catch (error) {
            console.error('Error adding item: ', error);
        }
    };

    const getItems = async () => {
        try {
            const snapshot = await firestore().collection('users').get();
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log('Items retrieved: ', items);
        } catch (error) {
            console.error('Error getting items: ', error);
        }
    };

    return {
        saveItem,
        getItems
    };
};

export default UsersApi;
