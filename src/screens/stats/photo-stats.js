import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
} from 'victory-native';
import firestore from '@react-native-firebase/firestore';
import {AppColors} from '../../assets/styles/default-styles';

const screenWidth = Dimensions.get('window').width;

const PhotoStats = ({type}) => {
  const [data, setData] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTopPhotos();
  }, []);

  const fetchTopPhotos = async () => {
    try {
      const snapshot = await firestore()
        .collection('photos')
        .where('tipo', '==', type)
        .orderBy('votes', 'desc')
        .limit(5)
        .get();

      const topPhotos = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          x: data.userName.split(' ')[0],
          y: data.votes || 0,
        };
      });

      console.log(`Top photos for ${type}:`, topPhotos);
      setData(topPhotos);
    } catch (error) {
      console.error('Error fetching top photos:', error);
    }
  };

  const handleSelectDataPoint = (event, datum) => {
    console.log('Selected datum:', datum);
    setLoading(true);
    const selectedData = datum.datum || datum;
    setSelectedPhoto(selectedData);
    setLoading(false);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Top 5 Fotos ${
        type === 'linda' ? 'Lindas' : 'Feas'
      }`}</Text>
      {type === 'linda' ? (
        <VictoryPie
          data={data}
          x="x"
          y="y"
          width={screenWidth}
          height={300}
          colorScale="qualitative"
          labels={({datum}) => `${datum.x}: ${datum.y}`}
          style={{
            labels: {fill: 'white', fontSize: 12, fontWeight: 'bold'},
          }}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPress: handleSelectDataPoint,
              },
            },
          ]}
        />
      ) : (
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={20}
          width={screenWidth}
          height={300}>
          <VictoryAxis
            tickFormat={x => x}
            style={{
              tickLabels: {fill: 'white', fontSize: 12},
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={x => `${x}`}
            style={{
              tickLabels: {fill: 'white', fontSize: 12},
            }}
          />
          <VictoryBar
            data={data}
            x="x"
            y="y"
            labels={({datum}) => `${datum.y}`}
            style={{
              data: {fill: '#c43a31'},
              labels: {fill: 'white'},
            }}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPress: (evt, targetProps) => {
                    const {datum} = targetProps;
                    handleSelectDataPoint(null, {datum});
                  },
                },
              },
            ]}
          />
        </VictoryChart>
      )}
      <Modal
        visible={selectedPhoto !== null}
        transparent={true}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loading ? (
              <ActivityIndicator size="large" color={AppColors.purple} />
            ) : selectedPhoto ? (
              <>
                {console.log('Modal photo data:', selectedPhoto)}
                {selectedPhoto.imageUrl ? (
                  <Image
                    source={{uri: selectedPhoto.imageUrl}}
                    style={styles.modalImage}
                    onError={e =>
                      console.log('Image load error:', e.nativeEvent.error)
                    }
                  />
                ) : (
                  <Text style={styles.errorText}>No hay imagen disponible</Text>
                )}
                <Text
                  style={
                    styles.modalText
                  }>{`Subida por: ${selectedPhoto.userName}`}</Text>
                <Text style={styles.modalText}>{`Votos: ${
                  selectedPhoto.votes || 0
                }`}</Text>
              </>
            ) : (
              <Text style={styles.errorText}>
                No se pudo cargar la información de la foto
              </Text>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.purple,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: AppColors.white,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    color: AppColors.dark,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: AppColors.purple,
    borderRadius: 5,
  },
  closeButtonText: {
    color: AppColors.white,
    fontWeight: 'bold',
  },
});

export default PhotoStats;
