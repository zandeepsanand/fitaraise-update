/* eslint-disable prettier/prettier */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {BASE_URL} from '@env';
import {Linking, Platform, StyleSheet, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks/';
import api, {setAuthToken} from '../../api';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox} from '../components/';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import {Animated, Easing} from 'react-native';

import LoginContext from '../hooks/LoginContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isAndroid = Platform.OS === 'android';
// const formData = {
//   mobile_number: 8606783324,
//   customer_id: 15,
// };
const OtpPageNew = ({
  route: {
    params: {formData},
  },
}) => {
  // console.log(formData, "check otp formdata");
  const {loginSuccess} = useContext(LoginContext);
  // const parsedData = JSON.parse(data);
  // console.log(parsedData, 'checkgfhfh');

  const [otp, setOtp] = useState({1: '', 2: '', 3: '', 4: ''});
  const [isLoading, setIsLoadingVerify] = useState(false);

  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();

  const {assets, colors, gradients, sizes} = useTheme();

  const [customerId, setCustomerId] = React.useState('');

  const [otpArray, setOtpArray] = useState(['', '', '', '']);
  const [isVerifyEnabled, setIsVerifyEnabled] = useState(false);

  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();

  // Function to handle OTP input changes
  const handleOtpInputChange = (index, value) => {
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    setOtpArray(newOtpArray);

    // Check if all input boxes are filled
    const isAllFilled = newOtpArray.every((otp) => otp !== '');
    setIsVerifyEnabled(isAllFilled);
  };

  function CustomerId(res) {
    const updatedFormData = {
      ...formData,
      customer_id: res.data.data.customer_id,
    };
    setCustomerId(res.data.data.customer_id);
    // console.log(customerId);
    navigation.setParams({formData: updatedFormData});
    navigation.navigate('Frstpage', {formData: updatedFormData});
  }

  
  const otpCheck = async () => {
    setIsLoadingVerify(true); // Start loading
  
    try {
      const response = await api.get(
        `otp_checking_personal_account/${formData.customer_id}/${otpArray.join('')}`
      );
  
      if (response.data.success === true) {
        const customerId = response.data.data.customer_id;
  
        const authData = {
          token: response.data.data.token,
          formData: {
            ...formData,
            customer_id: customerId,
            // Add other new properties here
          },
        };
  
        await AsyncStorage.setItem('authData', JSON.stringify(authData));
  
        setAuthToken(response.data.data.token);



        
  
        if (formData.hasOwnProperty('first_name') && formData.hasOwnProperty('last_name')) {
          const updatedFormData = {
            ...formData,
            customer_id: customerId,
          };
          setCustomerId(customerId);
          navigation.navigate('Loading', {
            formData: updatedFormData,
          });
        } else {
          axios
            .get(`${BASE_URL}get_personal_datas/${customerId}`)
            .then((personalDataRes) => {
              if (personalDataRes.data.data.first_name === null &&
                  personalDataRes.data.data.last_name === null) {

                formData = personalDataRes.data.data;
                const authData = {
                  token: response.data.data.token,
                
                  formData: {
                    ...formData,
                    customer_id: customerId,
                    // Add other new properties here
                  },

                };
                const token = authData.token


            

                AsyncStorage.setItem('authData', JSON.stringify(authData));
                setAuthToken(authData.token);
                
                loginSuccess(customerId, formData, token);
                navigation.navigate('NameLastName', { formData : authData.formData , token : response.data.data.token  });
              } else {
                formData = personalDataRes.data.data;
                console.log('====================================');
                console.log(response.data.data.token);
                console.log('====================================');
                const authData = {
                  token: response.data.data.token,
                
                  formData: {
                    ...formData,
                    customer_id: customerId,
                    // Add other new properties here
                  },
                };
                AsyncStorage.setItem('authData', JSON.stringify(authData));
                setAuthToken(authData.token);
                const token = authData.token;
                
                // setAuthenticated(true);
                loginSuccess(customerId, formData, token);
                // navigation.navigate('Loading', { formData: authData.formData });
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Frstpage', params: { formData: authData.formData } }],
                });
              }
            })
            .catch((personalDataError) => {
              setIsLoadingVerify(false);
              console.log(personalDataError, "error message personal");
              // Handle error from the new API
            });
        }
      } else {
        alert(response.data.message);
        setIsLoadingVerify(false);
        console.log('API response indicates failure');
        // You might want to display an error message to the user or take appropriate action
      }
    } catch (error) {
      setIsLoadingVerify(false); // Stop loading
      console.log(error);
      // Handle error from the server
    }
  };
  
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(true);

  // Function to start the timer
  const startTimer = () => {
    setIsResendEnabled(false);
    setTimer(60);

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(intervalId); // Stop the timer when it reaches zero
          setIsResendEnabled(true); // Enable the Resend button
          return 0;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
  }, []);

  const handleSignUp = useCallback(() => {
    startTimer();
    api
      .get(`login_personal_customer_account/${formData.mobile_number}`)
      .then((response) => {
        // Handle response from server
      })
      .catch((error) => {
        console.log(error);
        // Handle error from server
      });
  }, [formData]);

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{zIndex: 0}}></Block>
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={sizes.height * 0.1 - sizes.l}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              // blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Text p semibold center>
                {/* {t('register.subtitle')} */}
              </Text>
              {/* social buttons */}
              <Text h4 center marginBottom={10}>
                OTP Verification
              </Text>
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
                <Text center marginHorizontal={sizes.s} primary>
                  Fitaraise
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
              <Block paddingHorizontal={sizes.sm}></Block>
              <Text style={styles.content} center>
                We will send you a one time password on this{' '}
                <Text bold>Mobile Number</Text>
                <Text style={styles.phoneNumberText}> {formData.mobile_number}</Text>
              </Text>
              <Block style={styles.otpContainer}>
                <Block style={styles.otpBox}>
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={firstInput}
                    onChangeText={(text) => {
                      handleOtpInputChange(0, text);
                      setOtp({...otp, 1: text});
                      text && secondInput.current.focus();
                    }}
                    text={otpArray[0]}
                  />
                </Block>
                <Block style={styles.otpBox}>
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={secondInput}
                    onChangeText={(text) => {
                      handleOtpInputChange(1, text);
                      setOtp({...otp, 2: text});
                      text
                        ? thirdInput.current.focus()
                        : firstInput.current.focus();
                    }}
                    text={otpArray[1]}
                  />
                </Block>
                <Block style={styles.otpBox}>
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={thirdInput}
                    onChangeText={(text) => {
                      handleOtpInputChange(2, text);
                      setOtp({...otp, 3: text});
                      text
                        ? fourthInput.current.focus()
                        : secondInput.current.focus();
                    }}
                    text={otpArray[2]}
                  />
                </Block>
                <Block style={styles.otpBox}>
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={fourthInput}
                    onChangeText={(text) => {
                      handleOtpInputChange(3, text);
                      setOtp({...otp, 4: text});
                      !text && thirdInput.current.focus();
                    }}
                    text={otpArray[3]}
                  />
                </Block>
              </Block>

              {/* checkbox terms */}
              <Block
                row
                flex={0}
                align="center"
                paddingHorizontal={sizes.sm}></Block>

              {timer !== 0 ? (
                <Text center>
                  Remaining time to resend the OTP: {timer} seconds
                </Text>
              ) : (
                <Text center>
                  Didn't receive the OTP?{' '}
                  <Text bold primary onPress={handleSignUp}>
                    RESEND
                  </Text>
                </Text>
              )}
              <Button
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                disabled={!isVerifyEnabled}
                onPress={() => {
                  otpCheck();
                }}>
                {isLoading && <ActivityIndicator size="small" color="white" />}
                {!isLoading && (
                  <Text bold white transform="uppercase">
                    Verify
                  </Text>
                )}
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  backgroundAnimation: {
    position: 'absolute',
    zIndex: -10,
    top: 170,
    left: 0,
    bottom: 0,
    right: 0,
    width: 370,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  title: {
    fontSize: 20,

    lineHeight: 20 * 1.4,
    marginTop: 50,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  content: {
    fontSize: 20,

    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  phoneNumberText: {
    fontSize: 18,

    lineHeight: 18 * 1.4,
    color: 'yellow',
  },
  otpContainer: {
    marginHorizontal: 30,
    marginBottom: 30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  otpBox: {
    margin: 10,
  },
  otpText: {
    fontSize: 25,
    color: 'black',
    padding: 0,
    textAlign: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
});

export default OtpPageNew;
