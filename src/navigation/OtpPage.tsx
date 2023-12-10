/* eslint-disable prettier/prettier */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {BASE_URL} from '@env';
import {Linking, Platform, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox} from '../components/';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';
import LoginContext from '../hooks/LoginContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {getHash, startOtpListener, useOtpVerify} from 'react-native-otp-verify';



const isAndroid = Platform.OS === 'android';

interface IRegistration {
  name: string;
  email: string;
  password: string;
  agreed: boolean;
}
interface IRegistrationValidation {
  name: boolean;
  email: boolean;
  password: boolean;
  agreed: boolean;
}

const OtpPage = ({
  route: {
    params: {phoneNumber, data, formData},
  },
}) => {
  
  
  const {loginSuccess} = useContext(LoginContext);
  const parsedData = JSON.parse(data);
  // console.log(parsedData, 'checkgfhfh');
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const [otp, setOtp] = useState({1: '', 2: '', 3: '', 4: ''});

  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();

  const {assets, colors, gradients, sizes} = useTheme();

  const [otpArray, setOtpArray] = useState(['', '', '', '']);
  const [customerId, setCustomerId] = React.useState('');

  const handleOtpInputChange = (index, value) => {
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    setOtpArray(newOtpArray);
    const otpString = otpArray.join('');
    console.log(otpString);
  };
  function CustomerId(res) {
    const updatedFormData = {
      ...formData,
      customer_id: res.data.data.customer_id,
    };
    setCustomerId(res.data.data.customer_id);
    console.log(customerId);
    navigation.setParams({formData: updatedFormData});
    navigation.navigate('Frstpage', {formData: updatedFormData});
  }
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);


  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{zIndex: 0}}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.greeny}
            height={sizes.height * 0.3}>
            {/* <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              <Text p white marginLeft={sizes.s}>
                {t('common.goBack')}
              </Text>
            </Button> */}

            <Text h4 center white marginBottom={sizes.md}>
              {/* {t('register.title')} */}
            </Text>
          </Image>
        </Block>
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.2 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
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
              <Text style={styles.content}>
                Enter the OTP number just sent you at{' '}
                <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
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
              <Button
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                onPress={() => {
                  // console.log(otpArray.join(''));
                  axios
                    .get(
                      `${BASE_URL}otp_checking_personal_account/${
                        parsedData.data.data.customer_id
                      }/${otpArray.join('')}`,
                    )
                    .then((res) => {
                      // console.log(res.data.token);
                   
                      if (res.data.success === true) {
                        // const customerId = res.data.data.customer_id;
                        // console.log(customerId);


                        // const updatedFormData = {
                        //   ...formData,
                        //   customer_id: customerId,
                        // };

                        // setCustomerId(customerId);



                        // navigation.navigate('Frstpage', {
                        //   formData: updatedFormData,
                        // });
                        const customerId = res.data.data.customer_id;
                        const token = res.data.data.token;
                        console.log(token);
                        

                        // Check if formData has "first name" and "last name" properties
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
                          // Check the new API for "first_name" and "last_name" properties
                          axios
                            .get(`${BASE_URL}/get_personal_datas/${customerId}`)
                            .then((personalDataRes) => {
                              console.log(personalDataRes, "api of personal datas");
                              
                              if (
                                personalDataRes.data.hasOwnProperty('first_name') &&
                                personalDataRes.data.hasOwnProperty('last_name')
                              ) {
                                // "first_name" and "last_name" properties are present in the new API response
                                const updatedFormData = {
                                  ...formData,
                                  customer_id: customerId,
                                };
                                setCustomerId(customerId);
                                navigation.navigate('Frstpage', {
                                  formData: updatedFormData,
                                });
                              } else {
                                // "first_name" and "last_name" properties are missing, navigate to FillPage
                                setCustomerId(customerId);
                                navigation.navigate('NameLastName',{formData,token});
                              }
                            })
                            .catch((personalDataError) => {
                              console.log(personalDataError);
                              // Handle error from the new API
                            });
                        }


                      } else {
                        // Handle the case where the response is not successful
                        console.log('API response indicates failure');
                        // You might want to display an error message to the user or take appropriate action
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      // Handle error from server
                    });
                }}>
                <Text bold white transform="uppercase">
                  Verify
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
      <Lottie
        style={styles.backgroundAnimation}
        marginBottom={sizes.sm}
        source={require('../assets/json/launch.json')}
        // progress={animationProgress.current}
        autoPlay
        loop
      />
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

export default OtpPage;
