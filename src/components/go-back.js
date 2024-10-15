import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {
  AppButton,
  AppColors,
  AppFontSize,
} from '../assets/styles/default-styles';

export default function GoBackScreen({text}) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          size={21}
          style={AppButton.goBack}
        />
      </TouchableOpacity>
      <Text style={[AppFontSize.xxxl, {color: AppColors.white}]}> {text} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    color: AppColors.white,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 12,
  },
});
