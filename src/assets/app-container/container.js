import React, { useEffect, Fragment, useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { AppBg } from '../styles/default-styles';

function AppContainer(props) {

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
