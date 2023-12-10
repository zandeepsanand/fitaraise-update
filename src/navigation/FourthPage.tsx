/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {FlatList, Platform, TouchableOpacity} from 'react-native';
import {RadioButton} from 'react-native-paper';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks/';
import {Block, Button, Input, Image, Modal, Text} from '../components/';
import DuoToggleSwitch from 'react-native-duo-toggle-switch';
import Ripple from 'react-native-material-ripple';
import {Ionicons} from '@expo/vector-icons';
import TypingText from 'react-native-typing-text';
import axios from 'axios';
import {BASE_URL} from '@env';
import api from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
const isAndroid = Platform.OS === 'android';

// buttons example
const Buttons = () => {
  const [showModal, setModal] = useState(false);
  const [quantity, setQuantity] = useState('01');
  const {assets, colors, gradients, sizes} = useTheme();

  return (
    <Block paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Buttons
      </Text>
      <Block>
        <Button flex={1} gradient={gradients.primary} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            Primary
          </Text>
        </Button>
        <Button
          flex={1}
          gradient={gradients.secondary}
          marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            Secondary
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.info} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            info
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.success} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            success
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.warning} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            warning
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.danger} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            danger
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.light} marginBottom={sizes.base}>
          <Text bold transform="uppercase">
            light
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.dark} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            dark
          </Text>
        </Button>
        <Block row justify="space-between" marginBottom={sizes.base}>
          <Button
            flex={1}
            row
            gradient={gradients.dark}
            onPress={() => setModal(true)}>
            <Block
              row
              align="center"
              justify="space-between"
              paddingHorizontal={sizes.sm}>
              <Text white bold transform="uppercase" marginRight={sizes.sm}>
                {quantity}
              </Text>
              <Image
                source={assets.arrow}
                color={colors.white}
                transform={[{rotate: '90deg'}]}
              />
            </Block>
          </Button>
          <Button flex={1} gradient={gradients.dark} marginHorizontal={sizes.s}>
            <Text white bold transform="uppercase" marginHorizontal={sizes.s}>
              Delete
            </Text>
          </Button>
          <Button gradient={gradients.dark}>
            <Text white bold transform="uppercase" marginHorizontal={sizes.sm}>
              Save for later
            </Text>
          </Button>
        </Block>
      </Block>
      <Modal visible={showModal} onRequestClose={() => setModal(false)}>
        <FlatList
          keyExtractor={(index) => `${index}`}
          data={['01', '02', '03', '04', '05']}
          renderItem={({item}) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() => {
                setQuantity(item);
                setModal(false);
              }}>
              <Text p white semibold transform="uppercase">
                {item}
              </Text>
            </Button>
          )}
        />
      </Modal>
    </Block>
  );
};

const Cards = ({route, navigation}) => {
  const {formData} = route.params;
  const {assets, colors, gradients, sizes} = useTheme();
  const [showModal, setModal] = useState(false);
  const [showModalCm, setModalCm] = useState(false);
  const [showModalFeet, setModalFeet] = useState(false);
  const [feetView, setFeetView] = useState(false);
  const [showModalKg, setModalKg] = useState(false);
  const [age, setAge] = useState('');
  const [kg, setKg] = useState('');
  const [lbs, setLbs] = useState('');
  const [cm, setCm] = useState('');
  const [feet, setFeet] = useState('');
  const [checked, setChecked] = React.useState('');
  const [activity, setActivity] = React.useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputValueInch, setInputValueInch] = useState('');
  const [inputValueFeet, setInputValueFeet] = useState('');
  const [inputValueCm,setInputValueCm] =useState('');
  const [inputValueLbs , setInputValueLbs] =useState('');
  const [inputValueKg , setInputValueKg] =useState('');
  const [isKg, setIsKg] = useState(true);
  const [selectedData, setSelectedData] = useState(''); // state to store selected data
  const [isCm, setIsCm] = useState(true); // state to track if CM is selected
  const [selectedUnit, setSelectedUnit] = useState('cm');
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [gender, setGender] = useState('');
  
  const handleInputChange = (value) => {
    if (isKg && value <= 200) {
      setInputValue(value);
      const updatedFormData = {
        ...formData,
        weight: value,
        weight_unit: 'kg',
      };
      navigation.setParams({formData: updatedFormData});
      console.log(updatedFormData);
    } else if (!isKg && value <= 440) {
      setInputValue(value);
      const updatedFormData = {
        ...formData,
        weight: value,
        weight_unit: 'lbs',
      };
      navigation.setParams({formData: updatedFormData});
      console.log(updatedFormData);
    }
  };

  const handleInputChangeFeet = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue >= 0 && numericValue <= 11) {
      setInputValueFeet(numericValue);
      const updatedFormData = {
        ...formData,
        feet: numericValue,
        inches: formData.inches, // Preserve the existing inches value
        height: numericValue + '.' + formData.inches, // Combine feet and inches
        height_unit: 'ft',
      };
      navigation.setParams({ formData: updatedFormData });
      console.log(updatedFormData);
    }
  };
  
  const handleInputChangeInches = (text) => {
    // Remove any non-numeric characters and allow decimal points from the input
    const numericValue = text.replace(/[^0-9.]/g, '');
    if (!isNaN(numericValue) && numericValue <= 12) {
      setInputValueInch(numericValue);
      // Calculate the height in feet and inches as a decimal number
      const heightInFeet = parseFloat(formData.feet);
      const heightInInches = parseFloat(numericValue);
      const updatedHeight = (heightInFeet + heightInInches / 12).toFixed(2);
      const updatedFormData = {
        ...formData,
        inches: numericValue,
        height: updatedHeight,
        height_unit: 'ft',
      };
      navigation.setParams({ formData: updatedFormData });
      console.log(updatedFormData, 'height unit check');
    } else {
      // Handle when the input exceeds the maximum limit or is not a valid number
      console.log('Invalid or out of range height input');
    }
  };
  
  const handleInputChangeCm = (text) => {
    // Remove any non-numeric characters and allow decimal points from the input
    const numericValue = text.replace(/[^0-9.]/g, '');
  
    // Check if the numericValue is empty (user pressed backspace to delete)
    if (numericValue === '') {
      setInputValueCm('');
      const updatedFormData = {
        ...formData,
        inches: '',
        feet: '',
        height: '',
        height_unit: 'cm',
      };
      console.log(updatedFormData, 'height unit check');
      navigation.setParams({ formData: updatedFormData });
    } else {
      // Limit the value to a maximum of 220 cm
      const maxCmValue = 220;
      if (!isNaN(numericValue) && parseFloat(numericValue) <= maxCmValue) {
        setInputValueCm(numericValue);
        const updatedFormData = {
          ...formData,
          inches: '',
          feet: '',
          height: numericValue,
          height_unit: 'cm',
        };
        console.log(updatedFormData, 'height unit check');
        navigation.setParams({ formData: updatedFormData });
      } else {
        // Handle when the input exceeds the maximum value or is not a valid number
        console.log('Invalid or out of range height input');
      }
    }
  };
  
  
  const MAX_POUNDS_LIMIT = 1000; // Set the maximum limit in pounds

  const handleInputChangeLbs = (text) => {
    // Remove any non-numeric characters and allow decimal points from the input
    const numericValue = text.replace(/[^0-9.]/g, '');
  
    // Limit the value to the maximum pounds limit
    if (!isNaN(numericValue) && parseFloat(numericValue) <= MAX_POUNDS_LIMIT) {
      setInputValueLbs(numericValue);
      const updatedFormData = {
        ...formData,
        weight: numericValue,
        weight_unit: 'lbs',
      };
      console.log(updatedFormData, 'weight unit check');
      navigation.setParams({ formData: updatedFormData });
    } else {
      // Handle when the input exceeds the maximum limit or is not a valid number
      console.log('Invalid or out of range weight input');
    }
  };
  const MAX_KG_LIMIT = 500; // Set the maximum limit in kilograms

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
      navigation.setParams({ formData: updatedFormData });
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
        navigation.setParams({ formData: updatedFormData });
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
    weight:'',
    weight_unit: 'kg',
  };
  navigation.setParams({ formData: updatedFormData });
};

const handleSecondaryPress = () => {
  setIsKg(false);
  setInputValueLbs(''); // Clear the lbs input field
  const updatedFormData = {
    ...formData,
    weight:'',
    weight_unit: 'lbs',
  };
  navigation.setParams({ formData: updatedFormData });
};

  const handleOptionSelect = (option) => {
    const updatedFormData = {
      ...formData,
      gender: option,
    };
    setGender(option);
    navigation.setParams({formData: updatedFormData});
    console.log(updatedFormData, 'height unit check');
    // navigation.navigate('Demo1', {formData: updatedFormData});
  };
  const handleActivitySelect = (option) => {
    setActivity(option); // This sets the 'acitivity_level' in the state with the latest 'option'
    const updatedFormData = {
      ...formData,
      acitivity_level: option,
    };
    console.log(option, 'new checking'); // Log the 'option', which is the latest 'acitivity_level'

    navigation.setParams({formData: updatedFormData});
  };
  const handleAgeSelect = (item) => {
    const updatedFormData = {
      ...formData,
      age: item,
    };
    setAge(item);
    navigation.setParams({formData: updatedFormData});
    // navigation.navigate('Demo1', {formData: updatedFormData});
  };
  const handleHeightSelect = (item) => {
    setSelectedData(item);
    console.log(selectedData, 'height selected');
    setCm(item);

    const updatedFormData = {
      ...formData,
      height: item,
      height_unit: 'cm',
      feet: '',
      inches: '',
    };

    navigation.setParams({formData: updatedFormData});
    // navigation.navigate('Demo1', {formData: updatedFormData});
    console.log(formData, 'testing');
  };

  const handleUnitSelect = (unit) => {
    const updatedFormData = {
      ...formData,
      height_unit: unit,
    };
    setSelectedUnit(unit);
    navigation.setParams({formData: updatedFormData})
  };

  const handleKgSelect = (item) => {
    const updatedFormData = {
      ...formData,
      weight: item,
    };
    setKg(item);
    navigation.setParams({formData: updatedFormData});

    // navigation.navigate('Demo1', {formData: updatedFormData});
  };

async function checkPage() {
  // Check if required fields are filled
  console.log(
    formData.gender,
    formData.weight,
    formData.height,
    formData.acitivity_level
  );
  if (
    formData.gender &&
    formData.weight &&
    formData.height &&
    formData.acitivity_level
  ) {
    // Create a copy of the formData object
    const formDataCopy = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== null)
    );
    console.log(formDataCopy, 'form data');


    try {
      const response = await api.post('set_personal_datas', formDataCopy);
      console.log(formDataCopy, 'customer id');
      console.log(response.data, 'hello');
      alert(response.data.message);

      if (response.data.success) {
        console.log('hai testing');

        // Call the second API
        const secondApiResponse = await api.get(
          `get_daily_required_calories/${formDataCopy.customer_id}`
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
          navigation.navigate('AnimationPage', { data, formDataCopy });
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
    <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
      <Block marginTop={sizes.m}>
        <Block card padding={0}>
          <Image
            background
            padding={15}
            blurRadius={10}
            resizeMode="cover"
            source={require('../assets/images/bg111.jpg')}
            radius={sizes.cardRadius}>
            <Block flex={1} center>
              <Text center h5 bold paddingTop={10}>
                Height & Weight
              </Text>
            </Block>
            <Block
              row
              justify="space-between"
              marginBottom={sizes.base}
              marginTop={sizes.m}>
              {feetView === true ? (
                <Button
                  flex={2}
                  row
                  onPress={() => setModalKg(true)}
                  marginRight={sizes.base}>
                  <Block row align="center" justify="space-around">
                    <Input
                      placeholder={'Foot'}
                      keyboardType="numeric"
                      maxLength={2}
                      value={inputValueFeet}
                      style={{
                        height: 50,
                        width: 60,

                        borderRadius: 10,
                        backgroundColor: 'white',
                        borderWidth: 0,
                      }}
                      onChangeText={handleInputChangeFeet}
                    />
                    <Input
                      placeholder={'Inches'}
                      keyboardType="numeric"
                      maxLength={6}
                      value={inputValueInch}
                      style={{
                        height: 50,
                        width: 60,
                        flex: 0.5,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        borderWidth: 0,
                        marginLeft: 10,
                      }}
                      onChangeText={handleInputChangeInches}
                    />
                  </Block>
                </Button>
              ) : (
                // <Button
                //   flex={2}
                //   row
                //   gradient={gradients.light}
                //   onPress={() => setModalCm(true)}
                //   marginRight={sizes.base}>
                //   <Block
                //     row
                //     align="center"
                //     justify="space-between"
                //     paddingHorizontal={sizes.sm}>
                //     <Text
                //       dark
                //       bold
                //       transform="uppercase"
                //       marginRight={sizes.sm}>
                //       {selectedData} {isCm ? 'CM' : 'FEET'}
                //     </Text>
                //     <Image
                //       source={assets.arrow}
                //       color={colors.white}
                //       transform={[{rotate: '90deg'}]}
                //     />
                //   </Block>
                // </Button>
                <Button
                  flex={2}
                  row
                  onPress={() => setModalKg(true)}
                  marginRight={sizes.base}
                  >
                  <Block row align="center">
                  <Input
                      placeholder={'Cm'}
                      keyboardType="numeric"
                      maxLength={5}
                      value={inputValueCm}
                      style={{
                        height: 50,
                        width: 125,
                        flex: 1,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        borderWidth: 0,
                      }}
                      onChangeText={handleInputChangeCm}
                    />
                  </Block>
                </Button>
              
                
              )}

              <Block
                flex={4}
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
                  primaryText="Cm"
                  secondaryText="Feet"
                  onPrimaryPress={() => {
                    // setModalCm(true);
                    // setIsCm(true);
                    setFeetView(false);
                    setInputValueFeet('');
                    setInputValueInch('');
                    const updatedFormData = {
                      ...formData,
                      height:'',
                      height_unit: 'cm',
                    };
                    navigation.setParams({formData: updatedFormData});
                  }}
                  onSecondaryPress={() => {
                    // setModalFeet(true);
                    setFeetView(true);
                    setIsCm(false);
                    setInputValueCm('');
                    const updatedFormData = {
                      ...formData,
                      height:'',
                      height_unit: 'ft',
                    };
                    navigation.setParams({formData: updatedFormData});
                  }}
                  TouchableComponent={Ripple}
                  primaryButtonStyle={{width: 125, height: 50}}
                  secondaryButtonStyle={{width: 90, height: 50}}
                  primaryTextStyle={{marginRight: 40}}
                  rippleColor="#fff"
                  rippleContainerBorderRadius={50}
                  activeColor="#5f9b4c"
                />
              </Block>
              {/* <Button flex={2} gradient={gradients.dark} marginHorizontal={sizes.s}>
            <Text white bold transform="uppercase" marginHorizontal={sizes.s}>
              CM
            </Text>
          </Button>
          <Button flex={2} gradient={gradients.dark}>
            <Text white bold transform="uppercase" marginHorizontal={sizes.sm}>
              FEET
            </Text>
          </Button> */}
            </Block>
            <Block
              row
              justify="space-between"
              marginBottom={sizes.base}
              marginTop={sizes.sm}>
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
              ):(
              
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
                flex={4}
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
              {/* <Button flex={2} gradient={gradients.dark} marginHorizontal={sizes.s}>
            <Text white bold  marginHorizontal={sizes.s}>
              Kg
            </Text>
          </Button>
          <Button flex={2} gradient={gradients.dark}>
            <Text white bold  marginHorizontal={sizes.sm}>
              Lbs
            </Text>
          </Button> */}
            </Block>
          </Image>
        </Block>

        <Block marginTop={sizes.m} card padding={0}>
          <Image
            background
            padding={25}
            blurRadius={10}
            resizeMode="cover"
            // source={require('../assets/images/bg122.jpg')}
            radius={sizes.cardRadius}>
            <Text h5 bold center marginTop={10}>
              Gender & Age
            </Text>
            <Block
              row
              justify="space-between"
              marginBottom={sizes.base}
              marginTop={sizes.m}>
              <Button
                flex={1}
                row
                gradient={gradients.light}
                onPress={() => setModal(true)}>
                <Block
                  row
                  align="center"
                  justify="space-between"
                  paddingHorizontal={sizes.padding}>
                  <Text dark bold transform="uppercase" marginRight={sizes.sm}>
                    {age} Age in years
                  </Text>
                  <Image
                    source={assets.arrow}
                    color={colors.white}
                    transform={[{rotate: '90deg'}]}
                  />
                </Block>
              </Button>
            </Block>
            {/* <Block row justify="space-between" marginBottom={sizes.base} marginTop={sizes.sm}>
         
          <Button flex={2} gradient={gradients.light} marginHorizontal={sizes.s}>
            <Text black bold  marginHorizontal={sizes.s}>
             Male
            </Text>
          </Button>
          <Button flex={2} gradient={gradients.light}>
            <Text black bold  marginHorizontal={sizes.sm}>
              Female
            </Text>
          </Button>
        </Block> */}
            <Block
              row
              justify="space-between"
              marginBottom={sizes.base}
              marginTop={sizes.sm}>
              <Button
                flex={2}
                gradient={
                  gender === 'male' ? gradients.success : gradients.light
                }
                marginHorizontal={sizes.s}
                onPress={() => {
                  handleOptionSelect('male');
                }}>
                <Text black bold marginHorizontal={sizes.s}>
                  Male
                </Text>
              </Button>
              <Button
                flex={2}
                gradient={
                  gender === 'female' ? gradients.success : gradients.light
                }
                onPress={() => {
                  handleOptionSelect('female');
                }}>
                <Text black bold marginHorizontal={sizes.sm}>
                  Female
                </Text>
              </Button>
            </Block>
          </Image>
        </Block>
        <Block marginTop={sizes.m} card padding={0}>
          <Image
            background
            padding={25}
            blurRadius={10}
            resizeMode="cover"
            source={require('../assets/images/bg111.jpg')}
            radius={sizes.cardRadius}>
            <Text h5 bold marginTop={10} center>
              How active you are?
            </Text>

            <Block marginTop={sizes.sm}>
              <Block row justify="space-between" marginBottom={sizes.base}>
                <Block flex={0}>
                  <RadioButton
                    value="first"
                    status={checked === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked('first');
                      handleActivitySelect('sedentary');
                    }}
                  />
                </Block>

                <Block flex={1}>
                  <Text p semibold marginTop={sizes.s}>
                    Not Very Active
                  </Text>
                  <Text p marginTop={sizes.s}>
                    (Little or no exercise)
                  </Text>
                </Block>
              </Block>
              <Block row justify="space-between" marginBottom={sizes.base}>
                <Block flex={0}>
                  <RadioButton
                    value="second"
                    status={checked === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked('second');
                      handleActivitySelect('lightly_active');
                    }}
                  />
                </Block>

                <Block flex={1}>
                  <Text p semibold marginTop={sizes.s}>
                    Lightly Active
                  </Text>
                  <Text p marginTop={sizes.s}>
                    (Light exercise/ sports 1-3 days/week)
                  </Text>
                </Block>
              </Block>
              <Block row justify="space-between" marginBottom={sizes.base}>
                <Block flex={0}>
                  <RadioButton
                    value="third"
                    status={checked === 'third' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked('third');
                      handleActivitySelect('moderately_active');
                    }}
                  />
                </Block>

                <Block flex={1}>
                  <Text p semibold marginTop={sizes.s}>
                    Active
                  </Text>
                  <Text p marginTop={sizes.s}>
                    (Moderate exercise/sports 3-5 days/week)
                  </Text>
                </Block>
              </Block>
              <Block row justify="space-between" marginBottom={sizes.base}>
                <Block flex={0}>
                  <RadioButton
                    value="fourth"
                    status={checked === 'fourth' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked('fourth');
                      handleActivitySelect('very_active');
                    }}
                  />
                </Block>

                <Block flex={1}>
                  <Text p semibold marginTop={sizes.s}>
                    {' '}
                    Very Active
                  </Text>
                  <Text p marginTop={sizes.s}>
                    {' '}
                    (Hard exercise/Strenuous work /sports 6-7 days a week)
                  </Text>
                </Block>
              </Block>
            </Block>
          </Image>
        </Block>
      </Block>
      <Modal visible={showModal} onRequestClose={() => setModal(false)}>
        <FlatList
          keyExtractor={(index) => `${index}`}
          data={[
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
            '32',
            '33',
            '34',
            '35',
            '36',
            '37',
            '38',
            '39',
            '40',
            '41',
            '42',
            '43',
            '44',
            '45',
            '46',
            '47',
            '48',
            '49',
            '50',
            '51',
            '52',
            '53',
            '54',
            '55',
            '56',
            '57',
            '58',
            '59',
            '60',
            '61',
            '62',
            '63',
            '64',
            '65',
            '66',
            '67',
            '68',
            '69',
            '70',
            '71',
            '72',
            '73',
            '74',
            '75',
            '76',
            '77',
            '78',
            '79',
            '80',
            '81',
            '82',
            '83',
            '84',
            '85',
            '86',
            '87',
            '88',
            '89',
            '90',
            '91',
            '92',
            '93',
            '94',
            '95',
            '96',
            '97',
            '98',
            '99',
          ]}
          renderItem={({item}) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() => {
                {
                  handleAgeSelect(item);
                  setModal(false);
                }
              }}>
              <Text p white semibold transform="uppercase">
                {item}
              </Text>
            </Button>
          )}
        />
      </Modal>
      <Modal visible={showModalCm} onRequestClose={() => setModalCm(false)}>
        <FlatList
          keyExtractor={(index) => `${index}`}
          data={[
            '100',
            '101',
            '102',
            '103',
            '104',
            '105',
            '106',
            '107',
            '108',
            '109',
            '110',
            '111',
            '112',
            '113',
            '114',
            '115',
            '116',
            '117',
            '118',
            '119',
            '120',
            '121',
            '122',
            '123',
            '124',
            '125',
            '126',
            '127',
            '128',
            '129',
            '130',
            '131',
            '132',
            '133',
            '134',
            '135',
            '136',
            '137',
            '138',
            '139',
            '140',
            '141',
            '142',
            '143',
            '144',
            '145',
            '146',
            '147',
            '148',
            '149',
            '150',
            '151',
            '152',
            '153',
            '154',
            '155',
            '156',
            '157',
            '158',
            '159',
            '160',
            '161',
            '162',
            '163',
            '164',
            '165',
            '166',
            '167',
            '168',
            '169',
            '170',
            '171',
            '172',
            '173',
            '174',
            '175',
            '176',
            '177',
            '178',
            '179',
            '180',
            '181',
            '182',
            '183',
            '184',
            '185',
            '186',
            '187',
            '188',
            '189',
            '190',
            '191',
            '192',
            '193',
            '194',
            '195',
            '196',
            '197',
            '198',
            '199',
            '200',
          ]}
          renderItem={({item}) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() => {
                {
                  handleHeightSelect(item);
                  handleUnitSelect('cm');
                  setModalCm(false);
                  console.log(formData);
                }
              }}>
              <Text p white semibold transform="uppercase">
                {item} CM
              </Text>
            </Button>
          )}
        />
      </Modal>
      <Modal visible={showModalFeet} onRequestClose={() => setModalFeet(false)}>
        <FlatList
          keyExtractor={(index) => `${index}`}
          data={[
            '100',
            '101',
            '102',
            '103',
            '104',
            '105',
            '106',
            '107',
            '108',
            '109',
            '110',
            '111',
            '112',
            '113',
            '114',
            '115',
            '116',
            '117',
            '118',
            '119',
            '120',
            '121',
            '122',
            '123',
            '124',
            '125',
            '126',
            '127',
            '128',
            '129',
            '130',
            '131',
            '132',
            '133',
            '134',
            '135',
            '136',
            '137',
            '138',
            '139',
            '140',
            '141',
            '142',
            '143',
            '144',
            '145',
            '146',
            '147',
            '148',
            '149',
            '150',
            '151',
            '152',
            '153',
            '154',
            '155',
            '156',
            '157',
            '158',
            '159',
            '160',
            '161',
            '162',
            '163',
            '164',
            '165',
            '166',
            '167',
            '168',
            '169',
            '170',
            '171',
            '172',
            '173',
            '174',
            '175',
            '176',
            '177',
            '178',
            '179',
            '180',
            '181',
            '182',
            '183',
            '184',
            '185',
            '186',
            '187',
            '188',
            '189',
            '190',
            '191',
            '192',
            '193',
            '194',
            '195',
            '196',
            '197',
            '198',
            '199',
            '200',
          ]}
          renderItem={({item}) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() => {
                {
                  handleHeightSelect(item);
                  handleUnitSelect('ft');
                  setModalFeet(false);
                }
              }}>
              <Text p white semibold transform="uppercase">
                {item} FEET
              </Text>
            </Button>
          )}
        />
      </Modal>
      <Modal visible={showModalKg} onRequestClose={() => setModalKg(false)}>
        <FlatList
          keyExtractor={(index) => `${index}`}
          data={[
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
            '32',
            '33',
            '34',
            '35',
            '36',
            '37',
            '38',
            '39',
            '40',
            '41',
            '42',
            '43',
            '44',
            '45',
            '46',
            '47',
            '48',
            '49',
            '50',
            '51',
            '52',
            '53',
            '54',
            '55',
            '56',
            '57',
            '58',
            '59',
            '60',
            '61',
            '62',
            '63',
            '64',
            '65',
            '66',
            '67',
            '68',
            '69',
            '70',
            '71',
            '72',
            '73',
            '74',
            '75',
            '76',
            '77',
            '78',
            '79',
            '80',
            '81',
            '82',
            '83',
            '84',
            '85',
            '86',
            '87',
            '88',
            '89',
            '90',
            '91',
            '92',
            '93',
            '94',
            '95',
            '96',
            '97',
            '98',
            '99',
            '100',
            '101',
            '102',
            '103',
            '104',
            '105',
            '106',
            '107',
            '108',
            '109',
            '110',
            '111',
            '112',
            '113',
            '114',
            '115',
            '116',
            '117',
            '118',
            '119',
            '120',
            '121',
            '122',
            '123',
            '124',
            '125',
            '126',
            '127',
            '128',
            '129',
            '130',
            '131',
            '132',
            '133',
            '134',
            '135',
            '136',
            '137',
            '138',
            '139',
            '140',
            '141',
            '142',
            '143',
            '144',
            '145',
            '146',
            '147',
            '148',
            '149',
            '150',
            '151',
            '152',
            '153',
            '154',
            '155',
            '156',
            '157',
            '158',
            '159',
            '160',
            '161',
            '162',
            '163',
            '164',
            '165',
            '166',
            '167',
            '168',
            '169',
            '170',
            '171',
            '172',
            '173',
            '174',
            '175',
            '176',
            '177',
            '178',
            '179',
            '180',
            '181',
            '182',
            '183',
            '184',
            '185',
            '186',
            '187',
            '188',
            '189',
            '190',
            '191',
            '192',
            '193',
            '194',
            '195',
            '196',
            '197',
            '198',
            '199',
            '200',
          ]}
          renderItem={({item}) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() => {
                {
                  handleKgSelect(item);
                  setModalKg(false);
                }
              }}>
              <Text p white semibold transform="uppercase">
                {item} Kg
              </Text>
            </Button>
          )}
        />
      </Modal>
      <TouchableOpacity
        onPress={() => {
          checkPage();
        }}>
        <Block row justify="flex-end" paddingTop={20}>
          <Image
            source={assets.Button}
            // color={colors.white}
            // transform={[{rotate: '90deg'}]}
          />
        </Block>
      </TouchableOpacity>
    </Block>
  );
};

// Photo gallery example
const Gallery = () => {
  const {assets, sizes} = useTheme();
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  return (
    <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Carousel
      </Text>
      {/* carousel example */}
      <Block marginBottom={sizes.xxl}>
        <Image
          resizeMode="cover"
          source={assets.carousel1}
          style={{width: '100%'}}
        />
        <Text p secondary marginTop={sizes.sm}>
          Private Room • 1 Guests • 1 Sofa
        </Text>
        <Text h4 marginVertical={sizes.s}>
          Single room in center
        </Text>
        <Text p lineHeight={26}>
          As Uber works through a huge amount of internal management turmoil,
          the company is also consolidating.
        </Text>
      </Block>
      {/* photo gallery */}
      <Block>
        <Block row align="center" justify="space-between">
          <Text h5 semibold>
            Album 1
          </Text>
          <Button>
            <Text p primary semibold>
              View all
            </Text>
          </Button>
        </Block>
        <Block row justify="space-between" wrap="wrap">
          <Image
            resizeMode="cover"
            source={assets?.photo1}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.photo2}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.photo3}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.photo4}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.photo5}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.photo6}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
        </Block>
      </Block>

      {/* vertical image */}
      <Block>
        <Block row align="center" justify="space-between">
          <Text h5 semibold>
            Album 2
          </Text>
          <Button>
            <Text p primary semibold>
              View all
            </Text>
          </Button>
        </Block>
        <Block row justify="space-between" wrap="wrap">
          <Image
            resizeMode="cover"
            source={assets?.photo1}
            style={{
              width: IMAGE_VERTICAL_SIZE + IMAGE_MARGIN / 2,
              height: IMAGE_VERTICAL_SIZE * 2 + IMAGE_VERTICAL_MARGIN,
            }}
          />
          <Block marginLeft={sizes.m}>
            <Image
              resizeMode="cover"
              source={assets?.photo2}
              marginBottom={IMAGE_VERTICAL_MARGIN}
              style={{
                height: IMAGE_VERTICAL_SIZE,
                width: IMAGE_VERTICAL_SIZE,
              }}
            />
            <Image
              resizeMode="cover"
              source={assets?.photo3}
              style={{
                height: IMAGE_VERTICAL_SIZE,
                width: IMAGE_VERTICAL_SIZE,
              }}
            />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const Components = ({route, navigation}) => {
  const {formData} = route.params;
  const {assets, sizes} = useTheme();

  // const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerBackground: () => (
  //       <Image
  //         radius={0}
  //         resizeMode="cover"
  //         width={sizes.width}
  //         height={headerHeight}
  //         source={assets.header3}
  //       />
  //     ),
  //   });
  // }, [assets.header3, navigation, sizes.width, headerHeight]);

  return (
    <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <Block>
          {/* <Buttons /> */}
          {/* <Typography /> */}
          {/* <Inputs /> */}
          {/* <Switches /> */}
          {/* <Social /> */}
          <Cards navigation={navigation} route={route} />
          {/* <Gallery /> */}
        </Block>
      </Block>
    </Block>
  );
};

export default Components;
