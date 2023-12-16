/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useState} from 'react';
import {Platform, Linking, Modal, Alert, Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, Input, Text} from '../components/';
import {useData, useTheme, useTranslation} from '../hooks/';
import LoginContext from '../hooks/LoginContext';
import {TouchableOpacity, StyleSheet} from 'react-native';
import DuoToggleSwitch from 'react-native-duo-toggle-switch';
import api from '../../api';
import Ripple from 'react-native-material-ripple';
import {View} from 'react-native';
import { COLORS } from '../constants/light';

const isAndroid = Platform.OS === 'android';

const TrackProgress = () => {
  const {
    customerId,
    isLoggedIn,
    token,
    logout, // You can access the logout function
  } = useContext(LoginContext);
  const [isKg, setIsKg] = useState(true);
  const [inputValueLbs, setInputValueLbs] = useState('');
  const [inputValueKg, setInputValueKg] = useState('');
  const [showModalKg, setModalKg] = useState(false);
  const [formData, setFormData] = useState(null);
  const [showView, setShowView] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();

  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  const handleSocialLink = useCallback(
    (type: 'twitter' | 'dribbble') => {
      const url =
        type === 'twitter'
          ? `https://twitter.com/${user?.social?.twitter}`
          : `https://dribbble.com/${user?.social?.dribbble}`;

      try {
        Linking.openURL(url);
      } catch (error) {
        alert(`Cannot open URL: ${url}`);
      }
    },
    [user],
  );
  const handleLogout = () => {
    console.log('clicked');

    // Call the logout function to log the user out
    logout();
    navigation.navigate('loginNew');
  };
  const handleInputChangeKg = (text) => {
    // Remove any non-numeric characters and allow decimal points from the input
    const numericValue = text.replace(/[^0-9.]/g, '');

    // Check if the numericValue is empty (user pressed backspace to delete)
    if (numericValue === '') {
      setInputValueKg('');
      const updatedFormData = {
        ...formData,
        weight: '',
        weight_unit: 'kg',
      };
      console.log(updatedFormData, 'weight unit check');
      navigation.setParams({formData: updatedFormData});
    } else {
      // Limit the value to the maximum kilograms limit
      if (!isNaN(numericValue) && parseFloat(numericValue) <= MAX_KG_LIMIT) {
        setInputValueKg(numericValue);

        const updatedFormData = {
          ...formData,
          weight: numericValue,
          weight_unit: 'kg',
        };
        console.log(updatedFormData, 'weight unit check');
        navigation.setParams({formData: updatedFormData});
      } else {
        // Handle when the input exceeds the maximum limit or is not a valid number
        console.log('Invalid or out of range weight input');
      }
    }
  };
  const handlePrimaryPress = () => {
    setIsKg(true);
    setInputValueKg(''); // Clear the kg input field
    const updatedFormData = {
      ...formData,
      weight: '',
      weight_unit: 'kg',
    };
    navigation.setParams({formData: updatedFormData});
  };
  const handleSecondaryPress = () => {
    setIsKg(false);
    setInputValueLbs(''); // Clear the lbs input field
    const updatedFormData = {
      ...formData,
      weight: '',
      weight_unit: 'lbs',
    };
    navigation.setParams({formData: updatedFormData});
  };
  const MAX_POUNDS_LIMIT = 1000; // Set the maximum limit in pounds

  const handleInputChangeLbs = (text) => {
    // Remove any non-numeric characters and allow decimal points from the input
    const numericValue = text.replace(/[^0-9.]/g, '');

    // Check if the numericValue is empty (user pressed backspace to delete)
    if (numericValue === '' || numericValue === '.') {
      setInputValueLbs(numericValue); // Allow backspacing for empty or '.' value
      const updatedFormData = {
        ...formData,
        weight: numericValue,
        weight_unit: 'lbs',
      };
      console.log(updatedFormData, 'weight unit check');
      navigation.setParams({formData: updatedFormData});
    } else {
      // Limit the value to the maximum pounds limit
      if (
        !isNaN(numericValue) &&
        parseFloat(numericValue) <= MAX_POUNDS_LIMIT
      ) {
        setInputValueLbs(numericValue);
        const updatedFormData = {
          ...formData,
          weight: numericValue,
          weight_unit: 'lbs',
        };
        console.log(updatedFormData, 'weight unit check');
        navigation.setParams({formData: updatedFormData});
      } else {
        // Handle when the input exceeds the maximum limit or is not a valid number
        console.log('Invalid or out of range weight input');
      }
    }
  };
  const MAX_KG_LIMIT = 500; // Set the maximum limit in kilograms

  async function checkPage() {
    // Check if required fields are filled
    console.log(formData.weight);
    if (formData.weight) {
      // Create a copy of the formData object
      const formDataCopy = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => value !== null),
      );
      console.log(formDataCopy, 'form data');

      try {
        const response = await api.post('set_personal_datas', formDataCopy);
        console.log(formDataCopy, 'customer id');
        console.log(response.data, 'hello');
        alert(response.data.message);
        5;
        if (response.data.success) {
          console.log('hai testing');

          // Call the second API
          const secondApiResponse = await api.get(
            `get_daily_required_calories/${formDataCopy.customer_id}`,
          );
          // Do something with the second API response
          const data = secondApiResponse.data.data;
          console.log(data, 'the data of second apifffff');
          if (data === null) {
            console.log('first click');
            // Recursive call may not be necessary; please review if it's needed.
            // checkPage();
          } else {
            console.log('success');
            navigation.navigate('AnimationPage', {data, formDataCopy});
          }
        }
      } catch (error) {
        console.error(error, 'errorsss');
      }
    } else {
      // Alert the user to fill in all required fields
      alert('Please enter all details');
    }
  }

  return (
    <Block safe >
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          {/* profile: stats */}
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={sizes.l}
            marginHorizontal="1%"
            color="rgba(255,255,255,0.2)">
            <Block
              row
              //   blur
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              //   tint={colors.blurTint}
              justify="space-evenly"
              paddingVertical={sizes.sm}
              renderToHardwareTextureAndroid>
              <Block align="center">
                <Text bold primary>
                  Today
                </Text>
                <Text>16-12-2023</Text>
              </Block>
              <Block align="center" paddingTop={10}>
                {/* <Text h5>{(user?.stats?.followers || 0) / 1000}k</Text> */}
                <Text bold primary center>
                  Log history
                </Text>
              </Block>
              <Block align="center"></Block>
            </Block>
          </Block>
          {!showView && (
            <Block
              row
              //   blur
              marginTop={-sizes.s}
              flex={0}
              //   intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              //   tint={colors.blurTint}
              justify="space-evenly"
              paddingVertical={sizes.sm}
              renderToHardwareTextureAndroid>
              <Block align="center">{/* <Text  >16-12-2023</Text> */}</Block>
              <Block align="center" paddingTop={10}>
                {/* <Text h5>{(user?.stats?.followers || 0) / 1000}k</Text> */}
                {/* <Text bold primary center>Log history</Text> */}
              </Block>
              <Block align="center">
                <Button
                  color={colors.primary}
                  padding={10}
                  width={100}
                  onPress={() => {
                    setShowView(true);
                    setModalVisible(true);
                  }}>
                  <Text bold white>
                    Add
                  </Text>
                </Button>
              </Block>
            </Block>
          )}

         
          <Block flex={0} marginHorizontal={20} card marginTop={10}>
            <Block row center>
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
                  source={require('../assets/icons/track.png')}></Image>
              </Block>
              <Block flex={1} paddingLeft={20} paddingTop={15}>
                <Block flex={0} center>
                  <Text p semibold>
                    85.85 kg
                  </Text>
                  <Text
                    semibold
                    secondary
                    opacity={0.5}
                    paddingTop={5}
                    size={12}>
                    16-12-2023
                  </Text>
                </Block>
              </Block>
              <Block flex={0} center paddingRight={10}>
                <TouchableOpacity>
                  <Image
                    // color={'green'}
                    width={8}
                    height={35}
                    source={require('../assets/icons/dot.png')}></Image>
                </TouchableOpacity>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <Block
            card
            flex={0}
            style={styles.centeredView}
            marginTop={200}
            marginHorizontal={15}>
            <Block
              row
              justify="space-between"
              marginBottom={sizes.base}
              marginTop={sizes.sm}
              marginHorizontal={20}>
              <Button
                flex={2}
                row
                onPress={() => setModalKg(true)}
                marginRight={sizes.base}>
                <Block row align="center" justify="space-between">
                  {/* <Text dark bold transform="uppercase" marginRight={sizes.sm}>
                {kg} Kg
              </Text> */}
                  {isKg ? (
                    <Input
                      placeholder={'Kg'}
                      keyboardType="numeric"
                      maxLength={6}
                      value={inputValueKg}
                      style={{
                        height: 50,
                        width: 125,
                        flex: 1,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        borderWidth: 0,
                      }}
                      onChangeText={handleInputChangeKg}
                    />
                  ) : (
                    <Input
                      placeholder={'Lbs'}
                      keyboardType="numeric"
                      maxLength={6}
                      value={inputValueLbs}
                      style={{
                        height: 50,
                        width: 125,
                        flex: 1,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        borderWidth: 0,
                      }}
                      onChangeText={handleInputChangeLbs}
                    />
                  )}
                </Block>
              </Button>
              <Block
                flex={2}
                style={{
                  alignItems: 'center',
                  shadowRadius: 8,
                  shadowOpacity: 0.3,
                  shadowColor: '#757575',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                }}>
                <DuoToggleSwitch
                  primaryText="Kg"
                  secondaryText="Lbs"
                  onPrimaryPress={handlePrimaryPress}
                  onSecondaryPress={handleSecondaryPress}
                  TouchableComponent={Ripple}
                  primaryButtonStyle={{width: 125, height: 50}}
                  secondaryButtonStyle={{width: 90, height: 50}}
                  primaryTextStyle={{marginRight: 32}}
                  rippleColor="#fff"
                  rippleContainerBorderRadius={50}
                  activeColor="#5f9b4c"
                />
              </Block>
            </Block>

            <Block flex={0} marginTop={80} row>
              <Pressable
                style={[styles.button1, styles.buttonClose1]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setShowView(false);
                }}>
                <Text style={styles.textStyle} white bold>Update</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setShowView(false);
                }}>
                <Text style={styles.textStyle} bold >Hide </Text>
              </Pressable>
            </Block>
          </Block>
        </Modal>
        {/* <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable> */}
      </View>
    </Block>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  button1: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
   
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonClose1: {
    backgroundColor: COLORS.primary,
    marginRight:10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default TrackProgress;
