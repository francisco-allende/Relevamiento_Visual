import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000); // 3 segundos de duración

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/img/icono-relevamiento-invisible.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>Relevamiento Visual</Text>
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.info}>Francisco Allende</Text>
        <Text style={styles.info}>División A141-2</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3F3C9B',
    paddingVertical: 50,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  bottomSection: {
    alignItems: 'center',
  },
  info: {
    fontSize: 24,
    color: 'white',
    marginBottom: 15,
  },
});

export default SplashScreen;
