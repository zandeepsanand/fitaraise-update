/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {useData, useTheme, useTranslation} from '../../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../../components/';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import DuoToggleSwitch from 'react-native-duo-toggle-switch';
import Ripple from 'react-native-material-ripple';
const HeightAndWeight = ({
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
  const handleInputChangeFeet = (value) => {
    setInputValueFeet(value);
    const updatedFormData = {
      ...workoutData,
      feet: value,
      height: '',
      height_unit: 'ft',
    };
    navigation.setParams({workoutData: updatedFormData});
    console.log(updatedFormData);
  };
  const handleInputChangeInches = (value) => {
    setInputValueInch(value);
    const updatedFormData = {
      ...workoutData,
      inches: value,
      height: '',
      height_unit: 'ft',
    };
    navigation.setParams({workoutData: updatedFormData});
    console.log(updatedFormData, 'height unit check');
  };

  const handleInputChangeCm = (value) => {
    setInputValueCm(value);
    const updatedFormData = {
      ...workoutData,
      height: value,
      inches: '',
      feet: '',
      height_unit: 'cm',
    };
    navigation.setParams({workoutData: updatedFormData});
    console.log(updatedFormData, 'height unit check');
  };

  const handlePrimaryPress = (value) => {
    setIsKg(true); // set isKg state to true when primary button is pressed
    setInputValueKg(value);
    const updatedFormData = {
      ...workoutData,
      weight: value,
      weight_unit: 'kg',
    };
    navigation.setParams({workoutData: updatedFormData});
    console.log(updatedFormData, 'height unit check');
  };

  const handleSecondaryPress = (value) => {
    // setIsKg(false); // set isKg state to false when secondary button is pressed
    setInputValueLbs(value);
    const updatedFormData = {
      ...workoutData,
      weight: value,
      weight_unit: 'lbs',
    };
    navigation.setParams({workoutData: updatedFormData});
    console.log(updatedFormData, 'height unit check');
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
                  //   setModalCm(true);
                  //   setIsCm(true);
                  setFeetView(false);
                  const updatedFormData = {
                    ...workoutData,

                    height_unit: 'cm',
                  };
                  navigation.setParams({workoutData: updatedFormData});
                }}
                onSecondaryPress={() => {
                  // setModalFeet(true);
                  setFeetView(true);
                  //   setIsCm(false);
                  const updatedFormData = {
                    ...workoutData,

                    height_unit: 'ft',
                  };
                  navigation.setParams({workoutData: updatedFormData});
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
              //   <Button
              //     flex={2}
              //     row
              //     gradient={gradients.light}
              //     onPress={() => {
              //       // setModalCm(true)
              //     }}
              //     marginRight={sizes.base}>
              //     <Block
              //       row
              //       align="center"
              //       justify="space-between"
              //       paddingHorizontal={sizes.sm}>
              //       <Text dark bold transform="uppercase" marginRight={sizes.sm}>
              //         {/* {selectedData} {isCm ? 'CM' : 'FEET'} */}
              //       </Text>
              //       <Image
              //         source={assets.arrow}
              //         color={colors.white}
              //         transform={[{rotate: '90deg'}]}
              //       />
              //     </Block>
              //   </Button>
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
                primaryText="Lbs"
                secondaryText="Kg"
                onPrimaryPress={() => {
                  //   setModalCm(true);
                  //   setIsCm(true);
                  setLbsView(false);
                  const updatedFormData = {
                    ...workoutData,

                    height_unit: 'cm',
                  };
                  navigation.setParams({workoutData: updatedFormData});
                }}
                onSecondaryPress={() => {
                  // setModalFeet(true);
                  setLbsView(true);
                  //   setIsCm(false);
                  const updatedFormData = {
                    ...workoutData,

                    height_unit: 'ft',
                  };
                  navigation.setParams({workoutData: updatedFormData});
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
            {lbsView === true ? (
              <Button onPress={() => setModalKg(true)}>
                <Input
                  placeholder={'Kg'}
                  keyboardType="numeric"
                  maxLength={6}
                  value={inputValueKg}
                  style={{
                    height: 50,
                    width: 170,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    borderWidth: 0,
                  }}
                  onChangeText={handlePrimaryPress}
                />
              </Button>
            ) : (
              <Button>
                <Input
                  placeholder={'Lbs'}
                  keyboardType="numeric"
                  maxLength={6}
                  value={inputValueLbs}
                  style={{
                    height: 50,
                    width: 170,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    borderWidth: 0,
                  }}
                  onChangeText={handleSecondaryPress}
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
                navigation.navigate('DifficultyLevel', {workoutData});
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

export default HeightAndWeight;
