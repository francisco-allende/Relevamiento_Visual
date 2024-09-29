import React, { useEffect, Fragment, useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../utils/auth.context';
import Token from '../../utils/token';
import { fromUnixTime, isAfter } from 'date-fns';
import { AppBg } from '../styles/default-styles';
import { useNavigation, useFocusEffect } from '@react-navigation/native';


function AppContainer(props) {
    const navigation = useNavigation();
    const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
    const { signOut, signIn } = React.useContext(AuthContext);

    useFocusEffect(
        React.useCallback(() => {
            const doSomething = async () => {

                const obj = await Token.getDecodedToken();
                const expireTokenDate = fromUnixTime(obj.exp);

                if (isAfter(new Date(), expireTokenDate)) {
                    Alert.alert(
                        'Oops!',
                        'Se venció tu sesión. Debemos reingresar tus credenciales.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {

                                    AsyncStorage.getItem('LOGIN_INFO').then((result) => {
                                        if (result !== null) {
                                            const data = JSON.parse(result);
                                            if (data.cuit !== null && data.password !== null) {
                                                AsyncStorage.removeItem('TOKEN');
                                                AsyncStorage.removeItem('USERINFO');
                                                signIn(data.cuit, data.password, true);
                                            } else {
                                                signOut();
                                            }
                                        }
                                    });
                                },
                            },
                        ],
                        { cancelable: false },
                    );
                }
            };

            doSomething();
        }, [])
    );

    return (
        <Fragment>
            <SafeAreaView style={[styles.statusBar, AppBg.purple]} />
            <SafeAreaView style={[styles.container, AppBg.light, props.safeAreaStyles]}>
                <StatusBar barStyle="light-content" />
                <View style={[AppBg.white, props.containerStyles]}>
                    {props.children}
                </View>
            </SafeAreaView>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBar: {
        flex: 0,
    }
});

export default AppContainer;
