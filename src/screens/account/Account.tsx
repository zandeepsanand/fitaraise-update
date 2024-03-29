/* eslint-disable prettier/prettier */

import React, {useContext, useEffect, useState} from 'react';

import {Block, Image, Text} from '../../components';
import {TouchableOpacity} from 'react-native';
import LoginContext from '../../hooks/LoginContext';
import {CommonActions} from '@react-navigation/native';
import {MealContext} from '../../hooks/useMeal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {signOut} from '../../constants/GoogleSignInUtil.js';
import GoogleContext from '../../hooks/GoogleContext';
import { useWorkoutPathContext } from '../../hooks/WorkoutPathContext';



export default function Account({route, navigation}) {
  const [formData, setFormData] = useState('');
  const {selectedWorkoutPath, setWorkoutPath} = useWorkoutPathContext();
 console.log(selectedWorkoutPath, "www..");
 
  const {
    customerId,
    isLoggedIn,
    token,

    logout,
  } = useContext(LoginContext);

  const {userInfo,logoutGoogle} = useContext(GoogleContext);


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
    logoutGoogle();
    setWorkoutPath(null)
    

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

  const handleLogin = () => {
    setIsLoading(true); // Set loading to true

    const email = registration.email;
    const password = registration.password;

    // Make the login request
    api
      .post('set_personal_datas', {email, password})
      .then((response) => {
        setIsLoading(false); // Set loading back to false

        console.log(response.data, 'email register');

        // Assuming the server responds with a token on successful login

        if (response.data.success === false) {
           // Extract the error message for the email field
         console.log(response.data,  "error report");
         
        } else {
          // navigation.setParams({ formData: registration });
          navigation.goBack()
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

  return (
    <Block safe marginTop={15}>
      <Block
        scroll
        paddingHorizontal={15}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 10}}>
        <Block paddingHorizontal={5}>
          <Text h5>Profile</Text>
        </Block>
        <Block card flex={1} height={100} marginTop={10} color={'lightgreen'}>
          <Block row>
            <Block flex={0} center>
              {formData.image ? (
                <Image
                  width={60}
                  height={60}
                  source={{uri: formData.image}}
                  radius={50}></Image>
              ) : (
                <Image
                  width={60}
                  height={60}
                  source={require('../../assets/icons/male.png')}
                  radius={50}></Image>
              )}
            </Block>
            <Block flex={1} paddingLeft={20} paddingTop={15}>
              <Text h5 semibold white>
                {formData.first_name} {formData.last_name}
              </Text>
              {/* <Text p semibold white secondary size={13}>
                @gmail.com
              </Text> */}
            </Block>
            <Block flex={0} center paddingRight={10}>
              <TouchableOpacity>
                {/* <Image
                  color={'white'}
                  width={25}
                  height={25}
                  source={require('../../assets/icons/pencil.png')}></Image> */}
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
        {/* second block */}
        <Block card flex={1} marginTop={20} >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditProfile');
            }}>
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
                      My Account
                    </Text>
                    <Text
                      semibold
                      secondary
                      opacity={0.5}
                      paddingTop={5}
                      size={12}>
                      Make Changes to your account
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
          </TouchableOpacity>
<TouchableOpacity onPress={()=>navigation.navigate("EnableNotificationOnOff")}>
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
                  source={require('../../assets/icons/bell2.png')}></Image>
              </Block>
              <Block flex={1} paddingLeft={20} paddingTop={15}>
                <Block flex={0} center>
                  <Text p semibold>
                    Notification
                  </Text>
                  <Text
                    semibold
                    secondary
                    opacity={0.5}
                    paddingTop={5}
                    size={12}>
                    Make Changes to your notifictations
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
</TouchableOpacity>
        

          {/* <Block flex={0} height={85}>

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
                  source={require('../../assets/icons/settings1.png')}></Image>
              </Block>
              <Block flex={1} paddingLeft={20} paddingTop={15}>
                <Block flex={0} center>
                  <Text p semibold>
                    Settings
                  </Text>
                  <Text
                    semibold
                    secondary
                    opacity={0.5}
                    paddingTop={5}
                    size={12}>
                    Make Changes to your settings
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
          </Block> */}
          <TouchableOpacity
            onPress={() => {
              handleLogout();
            }}>
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
                    source={require('../../assets/icons/exit.png')}></Image>
                </Block>

                <Block flex={1} paddingLeft={20} paddingTop={15}>
                  <Block flex={0} center>
                    <Text p semibold paddingTop={15}>
                      Logout
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
          </TouchableOpacity>
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
