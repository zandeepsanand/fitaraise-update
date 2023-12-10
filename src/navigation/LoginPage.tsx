/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import api, {setAuthToken} from '../../api';
import {BASE_URL} from '@env';
import {
  Linking,
  Platform,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox} from '../components/';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';

const isAndroid = Platform.OS === 'android';

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

const LoginPage = ({route}) => {
  const {country} = route.params;
  // console.log(country);

  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerId, setCustomerId] = React.useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const togglePasswordVisibility = () => {
  //   setIsPasswordVisible((prevIsPasswordVisible) => !prevIsPasswordVisible);
  // };
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    last_name: false,
    email: false,
    number: false,
    password: false,
  });
  const [registration, setRegistration] = useState<IRegistration>({
    name: '',
    last_name: '',
    email: '',
    number: '',
    password: '',
  });
  console.log(registration);

  const [formData, setFormData] = useState({});

  const {assets, colors, gradients, sizes} = useTheme();
  console.log(
    'disabled:',
    !isValid.email || !isValid.password || !isValid.name || !isValid.last_name,
  );

  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
      setFormData({
        ...formData,
        first_name: registration.name,
        last_name: registration.last_name,
        mobile_number: value.number,
        email: registration.email,
        password: registration.password,
      });
      console.log(formData);
    },
    [setRegistration, formData, registration],
  );

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSignUp = useCallback(() => {
    if (
      isValid.number ||
      isValid.password ||
      isValid.name ||
      isValid.last_name
    ) {
      setIsLoading(true); // Start loading

      axios
        .get(`${BASE_URL}login_personal_customer_account/${phoneNumber}`)
        .then((response) => {
          setIsLoading(false); // Stop loading

          // Handle response from server
          setCustomerId(response.data.data.customer_id);

          const id = response.data.data.customer_id;
          const formDataCopy = {
            first_name :registration.name,
            last_name: registration.last_name,
            customer_id: id,
            mobile_number: phoneNumber,
          }
          console.log(formDataCopy ,"checking");
          

          const updatedFormData = {
            ...formData,
            customer_id: id,
            mobile_number: phoneNumber,
          };
          navigation.setParams({formData: formDataCopy});
          navigation.navigate('OtpPage', {
            formData: formDataCopy,
          });
        })
        .catch((error) => {
          setIsLoading(false); // Stop loading
          console.log(error);
          // Handle error from server
          alert(error);
        });
    }
  }, [formData, phoneNumber, navigation]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      last_name: regex.last_name.test(registration.last_name),
      email: regex.email.test(registration.email),
      number: regex.number.test(registration.number),
      password: regex.password.test(registration.password),
    }));
  }, [registration, setIsValid]);

  const handleLogin = () => {
    setIsLoading(true); // Set loading to true

    const first_name = registration.name;
    const last_name = registration.last_name;
    const email = registration.email;
    const password = registration.password;

    // Make the login request
    api
      .post('register_user', {first_name, last_name, email, password})
      .then((response) => {
        setIsLoading(false); // Set loading back to false

        console.log(response.data, 'email register');

        // Assuming the server responds with a token on successful login

        if (response.data.success === false) {
          const errorMessage = response.data.data.email[0]; // Extract the error message for the email field
          alert(errorMessage);
        } else {
          // navigation.setParams({ formData: registration });
          navigation.navigate('LoginScreenNewRegister', {
            formData: registration,
          });
          console.log({formData: registration}, 'checking');
        }

        // Set the token for future requests

        // You can navigate to another screen or perform other actions here
      })
      .catch((error) => {
        setIsLoading(false); // Set loading back to false
        // Handle login errors here
        console.error('Login Error:', error);
      });
  };

  // const [isPasswordVisible, setPasswordVisible] = useState(false);
  console.log(registration.password);
  const iconPosition = useRef(new Animated.Value(0)).current;
  const passw = registration.password;
  console.log(passw.length !== null, 'true');

  // Define an animated value for the icon position
  // const iconPosition = new Animated.Value(0);

  Animated.timing(iconPosition, {
    toValue: registration.password ? 1 : 0, // Slide the icon to the right when text is entered, or back to the left when empty
    duration: 200, // Animation duration in milliseconds
    useNativeDriver: false, // Important for Android
  }).start();

  return (
    <Block safe marginTop={sizes.xl}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{zIndex: 0}}></Block>
        {/* register form */}
        <Block keyboard behavior={!isAndroid ? 'padding' : 'height'}>
          {/* <Image
            source={require('../assets/images/bg1.png')}
            style={{position: 'absolute'}}
            width="100%"
            height="30%"
            radius={10}
            blurRadius={10}
            color={isDark ? colors.icon : undefined}
          /> */}
          <Lottie
            style={{position: 'absolute'}}
            marginBottom={sizes.sm}
            source={require('../assets/json/bg.json')}
            progress={animationProgress.current}
          />
          <Block
            // marginTop={90}
            flex={1}
            radius={sizes.sm}
            marginHorizontal="1%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          marginBottom={10}
          >
            <Block
              card
              // blur
              padding={0}
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Text p semibold center>
                {t('register.subtitle')}
              </Text>
              {/* social buttons */}
              <Block row center justify="space-evenly" marginVertical={sizes.m}>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.facebook}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.apple}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.google}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
              </Block>
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[1, 0]}
                  start={[0, 1]}
                  gradient={gradients.divider}
                />
                <Text center marginHorizontal={sizes.s}>
                  {t('common.or')}
                </Text>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.name')}
                  placeholder={'Enter Your first name'}
                  success={Boolean(registration.name && isValid.name)}
                  danger={Boolean(registration.name && !isValid.name)}
                  onChangeText={(value) => handleChange({name: value})}
                />
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={'Last Name'}
                  placeholder={'Enter your last name'}
                  success={Boolean(registration.last_name && isValid.last_name)}
                  danger={Boolean(registration.last_name && !isValid.last_name)}
                  onChangeText={(value) => handleChange({last_name: value})}
                />
                {country !== 'IN' && (
                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label={t('common.email')}
                    keyboardType="email-address"
                    placeholder={t('common.emailPlaceholder')}
                    success={Boolean(registration.email && isValid.email)}
                    danger={Boolean(registration.email && !isValid.email)}
                    onChangeText={(value) => handleChange({email: value})}
                  />
                )}
                {country !== 'IN' && (
                  <View style={styles.inputContainer}>
                    <Block style={styles.input} padding={0}>
                      <Input
                        secureTextEntry={!isPasswordVisible}
                        autoCapitalize="none"
                        marginBottom={sizes.m}
                        label={t('common.password')}
                        placeholder={t('common.passwordPlaceholder')}
                        // onChangeText={(value) => handleChange({password: value})}
                        onChangeText={(value) =>
                          handleChange({password: value})
                        }
                        success={Boolean(
                          registration.password && isValid.password,
                        )}
                        danger={Boolean(
                          registration.password && !isValid.password,
                        )}
                      />
                    </Block>
                    <Block flex={0}>
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
                                source={require('../assets/icons/show.png')}
                                style={styles.toggleButton}
                              />
                            ) : (
                              <Image
                                source={require('../assets/icons/hide.png')}
                                style={styles.toggleButton}
                              />
                            )}
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                    </Block>
                  </View>
                )}

                {country === 'IN' && (
                  <Input
                    marginBottom={sizes.m}
                    label="Phone Number"
                    placeholder="Enter phone number"
                    keyboardType="numeric"
                    maxLength={10}
                    // onChangeText={(value) => {{setPhoneNumber(value)}}}
                    onChangeText={(value) => {
                      {
                        {
                          {
                            setPhoneNumber(value);
                          }
                        }
                        handleChange({number: value});
                      }
                    }}
                    value={phoneNumber}
                    success={Boolean(registration.number && isValid.number)}
                    danger={Boolean(registration.number && !isValid.number)}
                  />
                )}
              </Block>

              {/* checkbox terms */}
              {/* <Block row flex={0} align="center" paddingHorizontal={sizes.sm}>
                <Checkbox
                  marginRight={sizes.sm}
                  checked={registration?.agreed}
                  onPress={(value) => handleChange({agreed: value})}
                />
                <Text paddingRight={sizes.s}>
                  {t('common.agree')}
                  <Text
                    semibold
                    onPress={() => {
                      Linking.openURL('https://www.creative-tim.com/terms');
                    }}>
                    {t('common.terms')}
                  </Text>
                </Text>
              </Block> */}
              {/* <Button
               marginVertical={sizes.s}
               marginHorizontal={sizes.sm}
               gradient={gradients.primary}

  onPress={() => {
    axios.get(`http://128.199.17.216/step_one_application/public/api/login_personal_customer_account/${ phoneNumber }`)
      .then(response => {
        console.log(response.data);
        // Handle response from server
        navigation.navigate('OtpPage' , {phoneNumber , response} );
      })
      .catch(error => {
        console.log(error);
        // Handle error from server
      });
  }}
><Text bold white transform="uppercase">
                  Next
                </Text>

</Button> */}
              {country !== 'IN' && (
                <Button
                  onPress={() => {
                    handleLogin();
                  }}
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  gradient={gradients.primary}
                  disabled={
                    !isValid.email ||
                    !isValid.password ||
                    !isValid.name ||
                    !isValid.last_name
                  }
                  >
                  {isLoading && (
                    <ActivityIndicator size="small" color="white" />
                  )}
                  {!isLoading && (
                    <Text bold white transform="uppercase">
                      Signup
                    </Text>
                  )}
                </Button>
              )}

              {country === 'IN' && (
                <Button
                  onPress={() => {
                    handleSignUp();
                  }}
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  gradient={gradients.primary}
                  disabled={
                    !isValid.number || !isValid.name || !isValid.last_name
                  }>
                  {isLoading && (
                    <ActivityIndicator size="small" color="white" />
                  )}
                  {!isLoading && (
                    <Text bold white transform="uppercase">
                      Signup
                    </Text>
                  )}
                </Button>
              )}
              <Block
                align="center"
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}>
                <Text primary>All ready have account?</Text>
              </Block>

              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={() => navigation.navigate('loginNew')}>
                <Text bold primary transform="uppercase">
                  {t('common.signin')}
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    // padding: 8,
  },
  input: {
    flex: 0.9,
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

export default LoginPage;
