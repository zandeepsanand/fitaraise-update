/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {useData, useTheme, useTranslation} from '../../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../../components/';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import DuoToggleSwitch from 'react-native-duo-toggle-switch';
import Ripple from 'react-native-material-ripple';
const GymHeightAndWeight = ({
  navigation,
  route: {
    params: {workoutData},
  },
}) => {
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [feetView, setFeetView] = useState(false);
  const [lbsView, setLbsView] = useState(false);
  const [showModalKg, setModalKg] = useState(false);
  const [inputValueFeet, setInputValueFeet] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputValueInch, setInputValueInch] = useState('');
  const [inputValueCm, setInputValueCm] = useState('');
  const [inputValueKg, setInputValueKg] = useState('');
  const [inputValueLbs, setInputValueLbs] = useState('');

  const [isKg, setIsKg] = useState(true);

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );

  const handleInputChange = (value) => {
    if (isKg && value <= 200) {
      setInputValue(value);
      const updatedFormData = {
        ...workoutData,
        weight: value,
        weight_unit: 'kg',
      };
      navigation.setParams({workoutData: updatedFormData});
      console.log(updatedFormData);
    } else if (!isKg && value <= 440) {
      setInputValue(value);
      const updatedFormData = {
        ...workoutData,
        weight: value,
        weight_unit: 'lbs',
      };
      navigation.setParams({workoutData: updatedFormData});
      console.log(updatedFormData);
    }
  };

  const handleInputChangeFeet = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue >= 0 && numericValue <= 11) {
      setInputValueFeet(numericValue);
      const updatedFormData = {
        ...workoutData,
        feet: numericValue,
        inches: workoutData.inches, // Preserve the existing inches value
        height: numericValue + '.' + workoutData.inches, // Combine feet and inches
        height_unit: 'ft',
      };
      navigation.setParams({ workoutData: updatedFormData });
      console.log(updatedFormData);
    }
  };
  
  const handleInputChangeInches = (text) => {
    // Remove any non-numeric characters and allow decimal points from the input
    const numericValue = text.replace(/[^0-9.]/g, '');
    if (!isNaN(numericValue) && numericValue <= 12) {
      setInputValueInch(numericValue);
      // Calculate the height in feet and inches as a decimal number
      const heightInFeet = parseFloat(workoutData.feet);
      const heightInInches = parseFloat(numericValue);
      const updatedHeight = (heightInFeet + heightInInches / 12).toFixed(2);
      const updatedFormData = {
        ...workoutData,
        inches: numericValue,
        height: updatedHeight,
        height_unit: 'ft',
      };
      navigation.setParams({ workoutData: updatedFormData });
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
        ...workoutData,
        inches: '',
        feet: '',
        height: '',
        height_unit: 'cm',
      };
      console.log(updatedFormData, 'height unit check');
      navigation.setParams({ workoutData: updatedFormData });
    } else {
      // Limit the value to a maximum of 220 cm
      const maxCmValue = 220;
      if (!isNaN(numericValue) && parseFloat(numericValue) <= maxCmValue) {
        setInputValueCm(numericValue);
        const updatedFormData = {
          ...workoutData,
          inches: '',
          feet: '',
          height: numericValue,
          height_unit: 'cm',
        };
        console.log(updatedFormData, 'height unit check');
        navigation.setParams({ workoutData: updatedFormData });
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
  
    // Check if the numericValue is empty (user pressed backspace to delete)
    if (numericValue === '' || numericValue === '.') {
      setInputValueLbs(numericValue); // Allow backspacing for empty or '.' value
      const updatedFormData = {
        ...workoutData,
        weight: numericValue,
        weight_unit: 'lbs',
      };
      console.log(updatedFormData, 'weight unit check');
      navigation.setParams({ workoutData: updatedFormData });
    } else {
      // Limit the value to the maximum pounds limit
      if (!isNaN(numericValue) && parseFloat(numericValue) <= MAX_POUNDS_LIMIT) {
        setInputValueLbs(numericValue);
        const updatedFormData = {
          ...workoutData,
          weight: numericValue,
          weight_unit: 'lbs',
        };
        console.log(updatedFormData, 'weight unit check');
        navigation.setParams({ workoutData: updatedFormData });
      } else {
        // Handle when the input exceeds the maximum limit or is not a valid number
        console.log('Invalid or out of range weight input');
      }
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
        ...workoutData,
        weight: '',
        weight_unit: 'kg',
      };
      console.log(updatedFormData, 'weight unit check');
      navigation.setParams({ workoutData: updatedFormData });
    } else {
      // Limit the value to the maximum kilograms limit
      if (!isNaN(numericValue) && parseFloat(numericValue) <= MAX_KG_LIMIT) {
        setInputValueKg(numericValue);
        
        const updatedFormData = {
          ...workoutData,
          weight: numericValue,
          weight_unit: 'kg',
        };
        console.log(updatedFormData, 'weight unit check');
        navigation.setParams({ workoutData: updatedFormData });
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
    ...workoutData,
    weight:'',
    weight_unit: 'kg',
  };
  navigation.setParams({ workoutData: updatedFormData });
};

const handleSecondaryPress = () => {
  setIsKg(false);
  setInputValueLbs(''); // Clear the lbs input field
  const updatedFormData = {
    ...workoutData,
    weight:'',
    weight_unit: 'lbs',
  };
  navigation.setParams({ workoutData: updatedFormData });
};

  return (
    <Block scroll>
      <Block
        //   scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.l}}
        // centerContent
      >
        <Block
          centerContent
          center
          style={{justifyContent: 'center', flex: 1, marginTop: 10}}>
          <Block
            // row
            justify="space-between"
            marginBottom={sizes.base}>
            <View style={styles.container3}>
              <Text
                size={sizes.m}
                bold
                paddingTop={40}
                paddingBottom={20}
                style={styles.customText}>
                Height
              </Text>
            </View>
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
              }}
              paddingBottom={20}>
            
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
                      ...workoutData,
                      height:'',
                      height_unit: 'cm',
                    };
                    navigation.setParams({formData: updatedFormData});
                  }}
                  onSecondaryPress={() => {
                    // setModalFeet(true);
                    setFeetView(true);
                    // setIsCm(false);
                    setInputValueCm('');
                    const updatedFormData = {
                      ...workoutData,
                      height:'',
                      height_unit: 'ft',
                    };
                    navigation.setParams({formData: updatedFormData});
                  }}
                  TouchableComponent={Ripple}
                  primaryButtonStyle={{height: 50}}
                secondaryButtonStyle={{height: 50}}
                // primaryTextStyle={}
                rippleColor="#fff"
                rippleContainerBorderRadius={50}
                activeColor="#5f9b4c"
                />
            </Block>
            {feetView === true ? (
              <Button
                flex={2}
                row
                onPress={() => setModalKg(true)}
                marginRight={sizes.base}>
                <Block row align="center" justify="center">
                  {/* <Text dark bold transform="uppercase" marginRight={sizes.sm}>
        {kg} Kg
      </Text> */}
                  <Input
                    placeholder={'Foot'}
                    keyboardType="numeric"
                    maxLength={5}
                    value={inputValueFeet}
                    style={{
                      height: 50,
                      width: 100,

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
                      width: 100,
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
           
              <Button style={styles.container3}>
                <Input
                  placeholder={'Cm'}
                  keyboardType="numeric"
                  maxLength={6}
                  value={inputValueCm}
                  style={{
                    height: 50,
                    width: 170,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    borderWidth: 0,
                  }}
                  onChangeText={handleInputChangeCm}
                />
              </Button>
            )}

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
            // row
            justify="space-between"
            marginBottom={sizes.base}>
            <View style={styles.container3}>
              <Text
                size={sizes.m}
                bold
                paddingTop={40}
                paddingBottom={20}
                style={styles.customText}>
                Weight
              </Text>
            </View>
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
              }}
              paddingBottom={20}>
           
                <DuoToggleSwitch
                  primaryText="Kg"
                  secondaryText="Lbs"
                  onPrimaryPress={handlePrimaryPress}
                  onSecondaryPress={handleSecondaryPress}
                  TouchableComponent={Ripple}
                  primaryButtonStyle={{height: 50}}
                secondaryButtonStyle={{height: 50}}
                // primaryTextStyle={}
                rippleColor="#fff"
                rippleContainerBorderRadius={50}
                activeColor="#5f9b4c"
                />
            </Block>
          
             {isKg ? (
              <Button>
                <Input
                 placeholder={'Kg'}
                 keyboardType="numeric"
                 maxLength={6}
                 value={inputValueKg}
                 style={{
                   height: 50,
                   width: 170,
                   flex: 1,
                   borderRadius: 10,
                   backgroundColor: 'white',
                   borderWidth: 0,
                 }}
                 onChangeText={handleInputChangeKg}
              
               />
              </Button>
                 
              ):(
              <Button>

              
                  <Input
                  placeholder={'Lbs'}
                  keyboardType="numeric"
                  maxLength={6}
                  value={inputValueLbs}
                  style={{
                    height: 50,
                    width: 170,
                    flex: 1,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    borderWidth: 0,
                  }}
                  onChangeText={handleInputChangeLbs}
                
                />
                </Button>
              )}
          </Block>
        </Block>
      </Block>
      <Block paddingTop={100}>
        <Block style={styles.bottom}>
          <TouchableWithoutFeedback
            onPress={() => {
              // handleProducts(4);
              if (
                (inputValueKg || inputValueLbs) &&
                (inputValueCm || inputValueInch)
              ) {
                navigation.navigate('GymDifficultyLevel', {workoutData});
              } else {
                alert('Enter all fields');
              }
            }}>
            <Block style={styles.mainCardView1} padding={20} center>
              <Block>
                <Text bold>Next</Text>
              </Block>
            </Block>
          </TouchableWithoutFeedback>
        </Block>
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#22faa0',

    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  img: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {backgroundColor: '', flexDirection: 'row', flex: 1},
  cover: {padding: 30, width: '50%', height: '10%'},
  text: {padding: 30},
  container: {
    flex: 0.1,
    flexDirection: 'row', // set elements horizontally, try column.
    padding: 20,
    // alignItems: 'center',
  },

  mainCardView: {
    height: 250,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    borderRadius: 30,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 16,
  },
  mainCardView1: {
    // height: 250,
    // width: 150,
    //    bottom:0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3cf29d',
    borderRadius: 15,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
    // marginTop: 6,
    marginBottom: 6,
    marginLeft: 20,
    marginRight: 20,
  },

  bottom: {
    flex: 0.5,
    justifyContent: 'flex-end', // Aligns content to the bottom of the container
    marginBottom: 40, // Optional: Adds some spacing from the bottom
  },
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
});

export default GymHeightAndWeight;
