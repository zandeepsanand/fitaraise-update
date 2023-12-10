import React, {useCallback, useEffect, useState} from 'react';
import {
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  Modal,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, Text} from '../../../components/';
import {useData, useTheme, useTranslation} from '../../../hooks/';

import CircularProgress from 'react-native-circular-progress-indicator';
const workoutData = [
  {name: 'Workout 1', details: 'Details of Workout 1'},
  {name: 'Workout 2', details: 'Details of Workout 2'},
  // ... more workout data
];

const isAndroid = Platform.OS === 'android';
const screenHeight = Dimensions.get('window').height;

const ErrorModal = ({isVisible, onClose}) => {
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();

  const [isAlertVisible, setAlertVisible] = useState(false);

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  const handlePress = () => {
    setAlertVisible(true);
  };

  const handleSkip = () => {
    onClose(); // Close the popup when "Skip" button is pressed
  };

  return (
    <Modal
      animationType="slide" // You can choose different animation types
      transparent={true} // Makes the modal background transparent
      visible={isVisible} // Controls the visibility of the modal
      // Function called when the Android back button is pressed
      backdropOpacity={0.5} // Adjust backdrop opacity if needed
      onBackdropPress={onClose}
      style={[styles.modalContainer, {paddingTop: screenHeight / 2 - 100}]}>
      <View style={styles.modalContent}>
        <Text>Please select your fitness level!</Text>
        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100, // Adjust this value as needed to center the modal
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
});

export default ErrorModal;
