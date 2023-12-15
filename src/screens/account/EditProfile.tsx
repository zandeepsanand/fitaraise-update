/* eslint-disable prettier/prettier */

import React, {useContext, useEffect, useState} from 'react';

import {Block, Button, Image, Text} from '../../components';
import {Alert, TextInput, TouchableOpacity} from 'react-native';
import LoginContext from '../../hooks/LoginContext';
import {CommonActions} from '@react-navigation/native';
import {MealContext} from '../../hooks/useMeal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {signOut} from '../../constants/GoogleSignInUtil.js.js';
import GoogleContext from '../../hooks/GoogleContext';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfile({route, navigation}) {
  const [formData, setFormData] = useState('');

  // const {formData} = route.params ?? {};

  const {
    customerId,
    isLoggedIn,
    token,

    logout,
  } = useContext(LoginContext);

  const {userInfo} = useContext(GoogleContext);

  console.log('====================================');
  console.log(userInfo, 'google data from account');
  console.log('====================================');
  const {clearContextData} = useContext(MealContext);
  // const handleSignOut = () => {
  //   // Call the signOut function from GoogleSignInUtil
  //   signOut();
  //   // You can navigate back to the previous screen or navigate to another screen
  //   // This example assumes you are using React Navigation for navigation
  //   navigation.goBack();
  // };

  const handleLogout = () => {
    console.log('clicked');

    // Call the logout function to log the user out
    // logout();
    clearContextData();
    logout();
    signOut();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'FirstPageCountrySelect'}],
      }),
    );
  };
  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      try {
        const authDataJSON = await AsyncStorage.getItem('authData');
        if (authDataJSON) {
          const authData = JSON.parse(authDataJSON);

          const authToken = authData.token;
          const customerId = authData.formData.customer_id;
          const formData = authData.formData;
          const token = authData.token;
          setFormData(formData);
          // Store the authData object as a JSON string in AsyncStorage
          // await AsyncStorage.setItem('authData', JSON.stringify(authData));

          // Use the loginSuccess method from LoginContext
          // setAuthToken(authData.token); // Set the token for future requests
        }
      } catch (error) {
        console.error('Authentication Status Error:', error);

        navigation.reset({
          index: 0,
          routes: [{name: 'FirstPageCountrySelect'}],
        });
      }
    };

    checkAuthenticationStatus();
  }, [navigation]);
  const [file, setFile] = useState(null);

  // Stores any error message
  const [error, setError] = useState(null);

  // Function to pick an image from
  //the device's media library
  const pickImage = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      // If permission is denied, show an alert
      Alert.alert(
        'Permission Denied',
        `Sorry, we need camera  
               roll permission to upload images.`,
      );
    } else {
      // Launch the image library and get
      // the selected image
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.cancelled) {
        // If an image is selected (not cancelled),
        // update the file state variable
        setFile(result.uri);

        // Clear any previous errors
        setError(null);
      }
    }
  };
  return (
    <Block safe marginTop={15} card color={'#f2f8fc'}>
      <Block
        scroll
        paddingHorizontal={15}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 10}}>
       
        <Block paddingHorizontal={5}>
          {/* <Text h5>Edit Profile</Text> */}
        </Block>
        <Block
          height={100}
          marginTop={10}
          center
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            position: 'relative',
          }}>
          <Image
            width={90}
            height={90}
            source={require('../../assets/icons/male.png')}
            radius={50}></Image>
          <Block flex={0} style={{position: 'absolute', bottom: 0, right: 0}}>
            <Image
              width={20}
              height={20}
              source={require('../../assets/icons/edit1.png')}
              radius={50}
              color={'green'}></Image>
          </Block>
        </Block>
        <Block>
          <Text center bold padding={10}>
            Sandeep S Anand
          </Text>
        </Block>
        <Block></Block>
        <View>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>

          {/* Conditionally render the image  
            or error message */}
          {file ? (
            // Display the selected image
            <View style={styles.imageContainer}>
              <Image source={{uri: file}} style={styles.image} />
            </View>
          ) : (
            // Display an error message if there's
            // an error or no image selected
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        {/* second block */}
        <Block card flex={1} marginTop={20}>
          <Block flex={0}>
            <Text padding={10}>Email address</Text>
            <View style={styles.inputContainer}>
              <Image
                source={require('../../assets/icons/Message.png')} // Replace with your icon source
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder="Enter text"
                // value={email}
                // onChangeText={(text) => setEmail(text)}
                placeholder="Email"
              />
            </View>
          </Block>
          <Block flex={0} paddingTop={10}>
            <Text padding={10}>Password</Text>
            <View style={styles.inputContainer}>
              <Image
                source={require('../../assets/icons/Message.png')} // Replace with your icon source
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder="Enter text"
                // value={email}
                // onChangeText={(text) => setEmail(text)}
                placeholder="Password"
              />
            </View>
          </Block>
          <Block flex={0}>
            <Text padding={10}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Image
                source={require('../../assets/icons/Message.png')} // Replace with your icon source
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder="Enter text"
                // value={email}
                // onChangeText={(text) => setEmail(text)}
                placeholder="Password"
              />
            </View>
          </Block>
        </Block>

        {/* third block */}
        <Block marginTop={40} paddingHorizontal={5}>
          <Text h5>More</Text>
        </Block>
        <Block card flex={1} marginTop={20} height={190}>
          <Block flex={0} height={85}>
            <Block row height={85} center>
              <Block
                flex={0}
                center
                width={60}
                height={60}
                radius={50}
                color={'#f0f0f8'}
                paddingLeft={18}
                marginTop={10}>
                <Image
                  color={'green'}
                  width={25}
                  height={25}
                  source={require('../../assets/icons/user.png')}></Image>
              </Block>
              <Block flex={1} paddingLeft={20} paddingTop={15}>
                <Block flex={0} center>
                  <Text p semibold>
                    Share App
                  </Text>
                  <Text
                    semibold
                    secondary
                    opacity={0.5}
                    paddingTop={5}
                    size={12}>
                    Share to your friends
                  </Text>
                </Block>
              </Block>
              <Block flex={0} center paddingRight={10}>
                <TouchableOpacity>
                  <Image
                    color={'green'}
                    width={8}
                    height={15}
                    source={require('../../assets/icons/arrow.png')}></Image>
                </TouchableOpacity>
              </Block>
            </Block>
          </Block>
          <Block flex={0} height={85}>
            <Block row>
              <Block
                flex={0}
                center
                width={60}
                height={60}
                radius={50}
                color={'#f0f0f8'}
                paddingLeft={18}
                marginTop={10}>
                <Image
                  color={'green'}
                  width={25}
                  height={25}
                  source={require('../../assets/icons/support.png')}></Image>
              </Block>
              <Block flex={1} paddingLeft={20} paddingTop={15}>
                <Block flex={0} center>
                  <Text p semibold paddingTop={15}>
                    Contact Us
                  </Text>
                </Block>
              </Block>
              <Block flex={0} center paddingRight={10}>
                <TouchableOpacity>
                  <Image
                    color={'green'}
                    width={8}
                    height={15}
                    source={require('../../assets/icons/arrow.png')}></Image>
                </TouchableOpacity>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'green',
    borderRadius: 15,
    borderWidth: 0.5,
    padding: 10,
    marginBottom: 10,
    paddingRight: 0,
  },
  icon: {
    width: 20, // Adjust icon width as needed
    height: 20, // Adjust icon height as needed
    marginRight: 10, // Adjust spacing between icon and input field as needed
  },
  input: {
    flex: 1, // Allow input field to expand to fill available space
  },
  ontainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
