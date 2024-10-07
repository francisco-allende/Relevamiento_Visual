import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import { AppColors } from '../assets/styles/default-styles';

export default function GoBackInlineScreen() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faChevronLeft} size={21} style={styles.icon} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    icon: {
        color: AppColors.white,
        marginTop: 3,
        marginRight: 5,
    },
})

