/* eslint-disable prettier/prettier */
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  SafeAreaView,
  View,
  // Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {BASE_URL} from '@env';
import * as regex from '../constants/regex';
import api, {setAuthToken} from '../../api';
import {Block, Button, Image, Input, Text} from '../components';
import {useTheme} from '../hooks';
import InputField from '../components/inputField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginContext, {loginSuccess} from '../hooks/LoginContext';
import {StackActions} from '@react-navigation/native';
import {Animated, Easing} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

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

const NameLastName = ({navigation, route}) => {
  const {formData,token} = route.params;
console.log(token , "form");

  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [buttonShow, setButtonShow] = useState(false);
  const [phoneShow, setPhoneShow] = useState(false);
  const [emailShow, setEmailShow] = useState(false);
  const [formShow, setFormShow] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const blockRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to start the animation
  const animateBlock = () => {
    if (blockRef.current) {
      blockRef.current.slideInUp(1000); // Adjust the duration as needed
    }
  };

  // Trigger the animation when the component mounts
  useEffect(() => {
    animateBlock();
  }, []);
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

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

  const {assets, colors, gradients, sizes} = useTheme();
  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
    },
    [setRegistration, registration],
  );
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

  // const signup = useCallback(() => {

  //   setIsLoading(true); // Start loading
  //   const formDataCopy = {
  //     ...formData,
  //     first_name: registration.name,
  //     last_name: registration.last_name,
  //   };
  //   console.log(formDataCopy , "check inside data form");
    
  //   const authData = {
  //     token: token,
  //     formData: formDataCopy,
  //   };
  //   //   const formData = authData.formData;
  //   console.log(authData ,"to db");

  //   // Store the authData object as a JSON string in AsyncStorage
  //   AsyncStorage.setItem('authData', JSON.stringify(authData));

  //   // Use the loginSuccess method from LoginContext
  //   // setAuthToken(token);
  //   for (const key in formDataCopy) {
  //     if (formDataCopy[key] === null) {
  //       delete formDataCopy[key];
  //     }
  //   }
   
    
  //   api
  //     .post(`set_personal_datas`, formDataCopy)
  //     .then((response) => {
  //       console.log(response.data);
        
  //       setIsLoading(false); // Stop loading
  //       console.log(formDataCopy, 'checking');
  //       navigation.setParams({formData: formDataCopy});
  //       navigation.navigate('Loading', {
  //         formData: formDataCopy,
  //       });
  //     })
  //     .catch((error) => {
  //       setIsLoading(false); // Stop loading
  //       console.log(error , "error");
  //       // Handle error from server
  //       alert(error);
  //     });
  // }, [formData, phoneNumber, navigation]);

  const signup = useCallback(() => {
    setIsLoading(true); // Start loading
  
    // Create a copy of formData
    const formDataCopy = { ...formData };
  
    // Check if "first_name" and "last_name" are provided in the registration object
    if (registration.name) {
      formDataCopy.first_name = registration.name;
    }
  
    if (registration.last_name) {
      formDataCopy.last_name = registration.last_name;
    }
  
    // Filter out null fields
    for (const key in formDataCopy) {
      if (formDataCopy[key] === null) {
        delete formDataCopy[key];
      }
    }
  
    // Create the authData object
    const authData = {
      token: token,
      formData: formDataCopy,
    };
  
    // Store the authData object as a JSON string in AsyncStorage
    AsyncStorage.setItem('authData', JSON.stringify(authData));
  
    // Make the API request
    api
      .post(`set_personal_datas`, formDataCopy)
      .then((response) => {
        console.log(response.data);
        setIsLoading(false); // Stop loading
        navigation.setParams({ formData: formDataCopy });
        // navigation.navigate('Loading', {
        //   formData: formDataCopy,
        // });
        navigation.reset({
          index: 0,
          routes: [{ name: 'Frstpage', params: { formData: formDataCopy } }],
        });
      })
      .catch((error) => {
        setIsLoading(false); // Stop loading
        console.log(error, "error");
        // Handle error from server
        alert(error);
      });
  }, [formData, registration, token, navigation]);
  
  

  return (
    <Block safe marginTop={sizes.xl} style={{backgroundColor: '#ffff'}}>
      <Block scrollEnabled>
        <Block flex={0} height={250}>
          <Image
            source={require('../assets/icons/fitaraise.png')}
            height={300}
            width={300}
            color={'gray'}
            style={{alignSelf: 'center'}}
          />
          {/* <Lottie
            style={
              {
                // position: 'relative'
              }
            }
            marginBottom={sizes.sm}
            source={require('../assets/json/bg.json')}
            progress={animationProgress.current}
          /> */}
        </Block>

        <Animatable.View
          ref={blockRef}
          animation="slideInUp"
          duration={1000} // Adjust the duration as needed
          style={{
            // marginTop: -sizes.sm,
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            position: 'relative',
            flex: 1,
          }}>
          <Block
            marginTop={-sizes.sm}
            marginLeft={-sizes.sm}
            // color={'lightgreen'}

            style={{
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              zIndex: 10,
              position: 'absolute',
            }}>
            <Block padding={20}>
              <Text center h4 primary bold>
                Welcome
              </Text>
              <Text center secondary semibold size={16} padding={10}>
                Please Enter Your Name
              </Text>

              <>
                <Block paddingHorizontal={15} paddingTop={20}>
                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    //   label='name'
                    placeholder={'Enter Your first name'}
                    success={Boolean(registration.name && isValid.name)}
                    danger={Boolean(registration.name && !isValid.name)}
                    onChangeText={(value) => handleChange({name: value})}
                  />
                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    //   label={'Last Name'}
                    placeholder={'Enter your last name'}
                    success={Boolean(
                      registration.last_name && isValid.last_name,
                    )}
                    danger={Boolean(
                      registration.last_name && !isValid.last_name,
                    )}
                    onChangeText={(value) => handleChange({last_name: value})}
                  />
                </Block>

                <Block
                  width="100%"
                  row
                  flex={1}
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
                    color={'transparent'}
                  />
                  <Text center marginHorizontal={sizes.s}></Text>
                  <Block
                    flex={0}
                    height={1}
                    width="50%"
                    end={[0, 1]}
                    start={[1, 0]}
                    color={'transparent'}
                  />
                </Block>

                <Button
                  onPress={() => {
                    signup();
                  }}
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.xxl}
                  gradient={gradients.primary}
                  disabled={!isValid.name || !isValid.last_name}>
                  {isLoading && (
                    <ActivityIndicator size="small" color="white" />
                  )}
                  {!isLoading && (
                    <Text bold white transform="uppercase">
                      Signup
                    </Text>
                  )}
                </Button>
              </>
            </Block>
          </Block>
        </Animatable.View>

        {buttonShow && (
          <Button
            gradient={gradients.primary}
            shadow={!isAndroid}
            marginVertical={sizes.s}
            marginHorizontal={sizes.sm}
            onPress={() => handleResend()}>
            <Text bold white style={{color: 'white'}}>
              Resend Link
            </Text>
          </Button>
        )}
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'green',
    borderRadius: 15,
    borderWidth: 0.3,
    padding: 15,
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
});

export default NameLastName;
