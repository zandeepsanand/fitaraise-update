/* eslint-disable prettier/prettier */

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {Block, Button, Image, Input, Text} from '../../components';
import {Alert, TextInput, TouchableOpacity} from 'react-native';
import LoginContext from '../../hooks/LoginContext';
import {CommonActions} from '@react-navigation/native';
import {MealContext} from '../../hooks/useMeal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {signOut} from '../../constants/GoogleSignInUtil.js.js';
import GoogleContext from '../../hooks/GoogleContext';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as regex from '../../constants/regex';
import api from '../../../api';
import {useTheme} from '../../hooks';
import {TouchableWithoutFeedback} from 'react-native';

interface IRegistration {
  name: string;
  last_name: string;
  email: string;
  number: string;
  password: string;
}
interface IRegistrationValidation {
  name: boolean;
  last_name: boolean;
  email: boolean;
  number: boolean;
  password: boolean;
}

export default function EditProfile({route, navigation}) {
  const {icons, colors, gradients, sizes} = useTheme();
  const [formData, setFormData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    email: false,
    password: false,
  });
  const [registration, setRegistration] = useState<IRegistration>({
    email: '',
    password: '',
    name: '',
    last_name: '',
  });
  // const {formData} = route.params ?? {};
  const [isValidname, setIsValidname] = useState<IRegistrationValidation>({
    name: false,
    last_name: false,
  });
  useEffect(() => {
    setIsValid((state) => ({
      ...state,

      email: regex.email.test(registration.email),

      password: regex.password.test(registration.password),
    }));
    setIsValidname((state) => ({
      ...state,

      name: regex.name.test(registration.name),

      last_name: regex.last_name.test(registration.last_name),
    }));
  }, [registration, setIsValid]);
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
  // const {formData} = route.params ?? {};

  const {
    customerId,
    isLoggedIn,
    token,

    logout,
  } = useContext(LoginContext);

  const {userInfo} = useContext(GoogleContext);

  // console.log('====================================');
  // console.log(userInfo, 'google data from account');
  // console.log('====================================');
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
  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
      setFormData({
        email: registration.email,
        password: registration.password,
      });
      console.log(formData);
    },
    [setRegistration, registration],
  );
  console.log(registration.password, 'email console');
  const handleSignUp = async () => {
    if (isValid.email || isValid.password) {
      setIsLoading(true); // Start loading

      try {
        const response = await api.post('set_personal_datas', {
          email: registration.email,
          password: registration.password,
          customer_id: customerId,
        });

        setIsLoading(false); // Stop loading

        // Handle response from server
        console.log(response.data);
        if (response.data.success) {
          Alert.alert(response.data.message);
          navigation.goBack();
        }

        // const updatedFormData = {
        //   ...formData,
        //   customer_id: id,
        //   mobile_number: phoneNumber,
        // };
        // navigation.setParams({formData: formDataCopy});
        // navigation.navigate('OtpPage', {
        //   formData: formDataCopy,
        // });
      } catch (error) {
        setIsLoading(false); // Stop loading
        console.error(error);
        // Handle error from server
        alert(error.message || 'An error occurred');
      }
    }
  };
  const handleFullName = async ()=>{
    if (isValidname.name || isValidname.last_name) {
      setIsLoading(true); // Start loading

      try {
        const response = await api.post('set_personal_datas', {
          first_name: registration.name,
          last_name: registration.last_name,
          customer_id: customerId,
        });

        setIsLoading(false); // Stop loading

        // Handle response from server
        console.log(response.data);
        if (response.data.success) {
          const userDataResponse = await api.get(
            `get_personal_datas/${customerId}`,
          );
          const user = userDataResponse.data.data;
    
          console.log(user, 'user data ');
          const authData = {
            token,
            formData: user
          };
          await AsyncStorage.setItem("authData", JSON.stringify(authData));
           
          const authDataJSON = await AsyncStorage.getItem('authData');
          if (authDataJSON) {
            const authData = JSON.parse(authDataJSON);
  
            const authToken = authData.token;
            const customerId = authData.formData.customer_id;
            const formData = authData.formData;
            const token = authData.token;
            setFormData(formData);
          }



          Alert.alert(response.data.message);
          navigation.goBack();
        }

        // const updatedFormData = {
        //   ...formData,
        //   customer_id: id,
        //   mobile_number: phoneNumber,
        // };
        // navigation.setParams({formData: formDataCopy});
        // navigation.navigate('OtpPage', {
        //   formData: formDataCopy,
        // });
      } catch (error) {
        setIsLoading(false); // Stop loading
        console.error(error);
        // Handle error from server
        alert(error.message || 'An error occurred');
      }
    }
  }

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
  const uploadImage = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        type: 'image/jpeg', // Change the type based on your image type
        name: 'photo.jpg',
      });

      const response = await api.post('set_personal_datas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Sorry, we need camera roll permission to upload images.',
      );
    } else {
      try {
        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result.cancelled) {
          // Upload the image and get the URL
          const imageUrl = await uploadImage(result.uri);

          // Now you can use imageUrl as needed (e.g., update personal data)
          updatePersonalData({image: imageUrl});

          // Clear any previous errors
          setError(null);
        }
      } catch (error) {
        console.error('Image picking error:', error);
        // Handle error as needed
      }
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleChangeName = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
      setFormData({
        ...formData,
        first_name: registration.name,
        last_name: registration.last_name,
      });
      console.log(formData);
    },
    [setRegistration, formData, registration],
  );
  const iconPosition = useRef(new Animated.Value(0)).current;
  Animated.timing(iconPosition, {
    toValue: registration.password ? 1 : 0, // Slide the icon to the right when text is entered, or back to the left when empty
    duration: 200, // Animation duration in milliseconds
    useNativeDriver: false, // Important for Android
  }).start();
  return (
    <Block safe marginTop={25} card color={'#f2f8fc'}>
      <Block
        scroll
        paddingHorizontal={15}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 10}}>
        <Block paddingTop={15} align="stretch" row>
          <Button onPress={() => navigation.goBack()}>
            <Image
              radius={0}
              width={10}
              height={18}
              color={colors.icon}
              source={icons.arrow}
              transform={[{rotate: '180deg'}]}
            />
          </Button>
          {/* <Block flex={0}>
        <Text h5  center >Edit Profile</Text>
        </Block> */}
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
          {formData.image ? (
            <Image
              width={90}
              height={90}
              source={{uri: formData.image}}
              radius={50}></Image>
          ) : (
            <Image
              width={90}
              height={90}
              source={require('../../assets/icons/male.png')}
              radius={50}></Image>
          )}
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
        {!nameVisible && (
           <Text center bold padding={10}>
           {formData.first_name} {formData.last_name}
         </Text>
        )}
         
        </Block>
        <Block></Block>
        {/* <View>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>

         
          {file ? (
         
            <View style={styles.imageContainer}>
              <Image source={{uri: file}} style={styles.image} />
            </View>
          ) : (
           
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View> */}

        {/* second block */}
        <Block card flex={1} marginTop={20}>
          <Block flex={0} height={85}>
            <TouchableWithoutFeedback onPress={() => setNameVisible(true)}>
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
                      Edit Name
                    </Text>
                    <Text
                      semibold
                      secondary
                      opacity={0.5}
                      paddingTop={5}
                      size={12}>
                      Edit your name
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
            </TouchableWithoutFeedback>
          </Block>
          {nameVisible && (
            <Block flex={0} paddingHorizontal={10}>
              <Input
                autoCapitalize="none"
                marginBottom={sizes.m}
                label={'Name'}
                placeholder={"First Name"}
                success={Boolean(registration.name && isValidname.name)}
                danger={Boolean(registration.name && !isValidname.name)}
                onChangeText={(value) => handleChangeName({name: value})}
              />
              <Input
                autoCapitalize="none"
                marginBottom={sizes.m}
                label={'Last Name'}
                placeholder={"Last name"}
                success={Boolean(
                  registration.last_name && isValidname.last_name,
                )}
                danger={Boolean(
                  registration.last_name && !isValidname.last_name,
                )}
                onChangeText={(value) => handleChangeName({last_name: value})}
              />
              <Block row center>
                <Button
                  onPress={() => {
                    handleFullName();
                  }}
                  width={150}
                  marginVertical={10}
                  marginHorizontal={10}
                  gradient={gradients.primary}
                  disabled={!isValidname.name || !isValidname.last_name}>
                  {isLoading && (
                    <ActivityIndicator size="small" color="white" />
                  )}
                  {!isLoading && (
                    <Text bold white transform="uppercase">
                      Update
                    </Text>
                  )}
                </Button>
                <Button
                  onPress={() => {
                    setNameVisible(false);
                  }}
                  marginVertical={10}
                  marginHorizontal={10}
                  gradient={gradients.primary}
                  // disabled={!isValidname.name || !isValidname.last_name}
                >
                 
                
                    <Text bold white transform="uppercase">
                      Hide
                    </Text>
                
                </Button>
              </Block>
            </Block>
          )}
          <TouchableWithoutFeedback onPress={() => setPasswordVisible(true)}>
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
                      Change Email & Password
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
          </TouchableWithoutFeedback>
          {passwordVisible && (
          <Block card flex={1} marginTop={20}>
            <Block flex={0}>
              <Input
                autoCapitalize="none"
                marginBottom={10}
                label={'Email'}
                keyboardType="email-address"
                placeholder={'enter email'}
                success={Boolean(registration.email && isValid.email)}
                danger={Boolean(registration.email && !isValid.email)}
                onChangeText={(value) => handleChange({email: value})}
              />
            </Block>
            <Block row>
              <Block style={styles.input} padding={0}>
                <Input
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  marginBottom={10}
                  label={'Password'}
                  placeholder={'Enter new password'}
                  // onChangeText={(value) => handleChange({password: value})}
                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
              </Block>
              <Block flex={0} center paddingTop={15}>
                {registration.password.length > 0 && (
                  <Animated.View
                    style={{
                      transform: [
                        {
                          translateX: iconPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-30, 0],
                          }),
                        },
                      ],
                    }}>
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                      {!isPasswordVisible ? (
                        <Image
                          source={require('../../assets/icons/show.png')}
                          style={styles.toggleButton}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/icons/hide.png')}
                          style={styles.toggleButton}
                        />
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </Block>
            </Block>
            <Block row center>
              <Button
                onPress={() => {
                  handleSignUp();
                }}
                width={150}
                marginVertical={10}
                marginHorizontal={10}
                gradient={gradients.primary}
                disabled={!isValid.password || !isValid.email}>
                {isLoading && <ActivityIndicator size="small" color="white" />}
                {!isLoading && (
                  <Text bold white transform="uppercase">
                    Update
                  </Text>
                )}
              </Button>
              <Button
                onPress={() => {
                  setPasswordVisible(false);
                }}
                marginVertical={10}
                marginHorizontal={10}
                gradient={gradients.primary}
                //  disabled={!isValid.password || !isValid.email}
              >
              
               
                  <Text bold white transform="uppercase">
                    Hide
                  </Text>
             
              </Button>
            </Block>
          </Block>
        )}
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
                  width={8}
                  height={15}
                  source={require('../../assets/icons/arrow.png')}></Image>
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

  toggleButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 10,
    tintColor: 'gray',
  },
  toggleButtonContainer: {
    position: 'absolute',
    right: 10, // Adjust the position based on your layout
    top: 10, // Adjust the position based on your layout
    zIndex: 1, // Make sure it's above the input field
  },
});
