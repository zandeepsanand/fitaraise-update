/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { Button } from 'react-native-elements';
import Lottie from 'lottie-react-native';

const NotFoundPage = ({ navigation }) => {
  const handleHomeButtonPress = () => {
    // Navigate to the home screen or any other appropriate screen
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Lottie
        source={require('../../assets/json/4042.json')} // Replace with the path to your animation JSON file
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.title}>404 - Page Not Found</Text>
      <Text style={styles.subtitle}>Oops! The page you're looking for doesn't exist.</Text>
      {/* <Button
        title="Go Home"
        onPress={handleHomeButtonPress}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 200, // Adjust the width and height to fit your animation
    height: 200,
  },
  title: {
    fontSize: 24,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
  },
});

export default NotFoundPage;
