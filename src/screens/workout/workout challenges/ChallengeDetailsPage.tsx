/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, TextInput} from 'react-native';
import {Block, Button, Image, Text} from '../../../components';
import {useTheme} from '../../../hooks';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '@env';
import DuoToggleSwitch from 'react-native-duo-toggle-switch';
import Ripple from 'react-native-material-ripple';

const ChallengeDetailsPage = ({
  workout,
  timeLeft,
  formattedTime,
  onFieldsFilled,
  kgInputValues,
  setKgInputValues,
  lbsInputValues,
  setLbsInputValues,
  repsInputValuesLbs,
  setRepsInputValuesLbs,
  repsInputValuesKg,
  setRepsInputValuesKg,
}) => {
  console.log(workout, 'TESTING');
  const [lbsView, setLbsView] = useState(false);
  const handleKgInputChange = (index, newValue) => {
    const updatedValues = [...kgInputValues];
    updatedValues[index] = newValue;
    setKgInputValues(updatedValues);
  };

  const handleLbsInputChange = (index, newValue) => {
    const updatedValues = [...lbsInputValues];
    updatedValues[index] = newValue;
    setLbsInputValues(updatedValues);
  };

  const handleRepsKgInputChange = (index, newValue) => {
    const updatedValues = [...repsInputValuesKg];
    updatedValues[index] = newValue;
    setRepsInputValuesKg(updatedValues);
  };
  const handleRepsLbsInputChange = (index, newValue) => {
    const updatedValues = [...repsInputValuesLbs];
    updatedValues[index] = newValue;
    setRepsInputValuesLbs(updatedValues);
    const updatedValuesKg = [...repsInputValuesKg];
    updatedValues[index] = newValue;
    setRepsInputValuesKg(updatedValues);
  };
  console.log(repsInputValuesLbs, repsInputValuesKg, kgInputValues, 'reps ');

  const completed_date = new Date().toISOString().slice(0, 10);
  // console.log(completed_date);

  const {assets, colors, sizes} = useTheme();
  // console.log(workout.id);
  const customer_id = 10;
  const workout_id = workout.workout_id;
  const excercise_id = workout.excercise;
  const home_workout_excercise = workout.id;
  const workoutData = {
    customer_id,
    workout_id,
    excercise_id,
    home_workout_excercise,
    completed_date,
  };

  const navigation = useNavigation();
  // console.log(timeLeft);
  const areFieldsFilled = () => {
    const kgValues = kgInputValues.slice(0, workout.sets);
    const lbsValues = lbsInputValues.slice(0, workout.sets);
    const repsLbsValues = repsInputValuesLbs.slice(0, workout.sets);
    const repsKgValues = repsInputValuesKg.slice(0, workout.sets);

    // Check if either kgInputValues and repsInputValuesKg or lbsInputValues and repsInputValuesKg are filled
    const kgAndRepsKgFilled =
      kgValues.every((value) => value.trim() !== '') &&
      repsKgValues.every((value) => value.trim() !== '');

    const lbsAndRepsKgFilled =
      lbsValues.every((value) => value.trim() !== '') &&
      repsLbsValues.every((value) => value.trim() !== '');

    return kgAndRepsKgFilled || lbsAndRepsKgFilled;
  };
  const clearLbsInputValues = () => {
    setLbsInputValues(Array.from({length: workout.sets}, () => ''));
    setRepsInputValuesLbs(Array.from({length: workout.sets}, () => ''));
  };

  const clearKgInputValues = () => {
    setKgInputValues(Array.from({length: workout.sets}, () => ''));
    setRepsInputValuesKg(Array.from({length: workout.sets}, () => ''));
  };

  const clearInputValues = () => {
    if (lbsView) {
      clearKgInputValues(); // If lbs view is true, clear kg values
    } else {
      clearLbsInputValues(); // If lbs view is false, clear lbs values
    }
  };

  // Call the callback function to update the state on the main page
  useEffect(() => {
    onFieldsFilled(areFieldsFilled());
  }, [kgInputValues, lbsInputValues, repsInputValuesLbs, repsInputValuesKg]);

  return (
    <>
      <Block row>
        <Button
          row
          flex={0}
          justify="flex-start"
          paddingLeft={10}
          onPress={() => navigation.goBack()}>
          <Image
            radius={0}
            width={10}
            height={18}
            color={colors.black}
            source={assets.arrow}
            transform={[{rotate: '180deg'}]}
          />
          {/* <Text p white marginLeft={sizes.s}>
                {t('profile.title')}
              </Text> */}
        </Button>
        <Block>
          <Text center h4 bold marginLeft={-sizes.m} marginTop={sizes.s}>
            {workout.excercise_name}
          </Text>
        </Block>
      </Block>
      <Block padding={10}>
        <Text center size={15} bold>
          {workout.excercise_times}
        </Text>
      </Block>

      <Image
        background
        resizeMode="cover"
        padding={sizes.sm}
        paddingBottom={sizes.l}
        height={390}
        radius={30}
        source={{
          uri: `${workout.excercise_image}`,
        }}></Image>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // paddingTop: 30,
        }}>
        {workout.time_or_sets === 'time' ? (
          <>
            <Text
              padding={10}
              //  paddingTop={40}
              bold
              size={30}>
              {formattedTime}
            </Text>
          </>
        ) : (
          <>
            {/* <Text padding={10} paddingTop={40} bold size={30}>
              Sets : {workout.excercise_times}
            </Text> */}
            {workout.weight_vs_reps === null ||
            workout.weight_vs_reps.length === 0 ? (
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
                    setLbsView(false);
                    clearInputValues();
                    const updatedFormData = {
                      ...workoutData,
                      height_unit: 'cm',
                    };
                    navigation.setParams({workoutData: updatedFormData});
                  }}
                  onSecondaryPress={() => {
                    setLbsView(true);
                    clearInputValues();
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
            ) : (
              <></>
            )}

            {workout.weight_vs_reps === null ||
            workout.weight_vs_reps.length === 0 ? (
              <>
                {lbsView === true ? (
                  <Button>
                    {Array.from({length: workout.sets}, (_, setIndex) => (
                      <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <TextInput
                          key={setIndex}
                          placeholder={`Add kg ${setIndex + 1}`}
                          keyboardType="numeric"
                          maxLength={4}
                          value={kgInputValues[setIndex]}
                          style={{
                            height: 50,
                            width: 150,
                            borderRadius: 10,
                            backgroundColor: 'white',
                            borderWidth: 0,
                            marginRight: 10,
                            padding: 10,
                          }}
                          onChangeText={(text) => {
                            const cleanedText = text.replace(/^0+/g, '');
                            handleKgInputChange(setIndex, cleanedText);
                          }}
                        />
                        <TextInput
                          placeholder={`Reps  ${setIndex + 1}`}
                          keyboardType="numeric"
                          maxLength={2}
                          value={repsInputValuesKg[setIndex]}
                          style={{
                            height: 50,
                            width: 150,
                            borderRadius: 10,
                            backgroundColor: 'white',
                            borderWidth: 0,
                            padding: 10,
                          }}
                          onChangeText={(text) => {
                            const cleanedText = text.replace(/^0+/g, '');
                            handleRepsKgInputChange(setIndex, cleanedText);
                          }}
                        />
                      </View>
                    ))}
                  </Button>
                ) : (
                  <Button onPress={clearInputValues}>
                    {Array.from({length: workout.sets}, (_, setIndex) => (
                      <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <TextInput
                          key={setIndex}
                          placeholder={`Add Lbs ${setIndex + 1}`}
                          keyboardType="numeric"
                          maxLength={5}
                          value={lbsInputValues[setIndex]}
                          style={{
                            height: 50,
                            width: 150,
                            borderRadius: 10,
                            backgroundColor: 'white',
                            borderWidth: 0,
                            marginRight: 10,
                            padding: 10,
                          }}
                          onChangeText={(text) => {
                            const cleanedText = text.replace(/^0+/g, '');
                            handleLbsInputChange(setIndex, cleanedText);
                          }}
                        />
                        <TextInput
                          placeholder={`Reps  ${setIndex + 1}`}
                          keyboardType="numeric"
                          maxLength={3}
                          value={repsInputValuesLbs[setIndex]}
                          style={{
                            height: 50,
                            width: 150,
                            borderRadius: 10,
                            backgroundColor: 'white',
                            borderWidth: 0,
                            padding: 10,
                          }}
                          onChangeText={(text) => {
                            const cleanedText = text.replace(/^0+/g, '');
                            handleRepsLbsInputChange(setIndex, cleanedText);
                          }}
                        />
                      </View>
                    ))}
                  </Button>
                )}
              </>
            ) : (
              <Block padding={20}>
                {workout.weight_vs_reps.map((item, index) => (
                  <Block
                    card
                    key={index}
                    style={{flexDirection: 'row', marginBottom: 10}}>
                    <Text
                      center
                      style={{
                        height: 50,
                        width: 150,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        borderWidth: 0,
                        padding: 10,
                      }}>
                      Weight:
                      <Text bold primary>
                        {' '}
                        {item.weight}
                      </Text>
                    </Text>
                    <Text
                      center
                      style={{
                        height: 50,
                        width: 150,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        borderWidth: 0,
                        marginLeft: 10,
                        padding: 10,
                      }}>
                      Reps:
                      <Text bold primary>
                        {' '}
                        {item.reps}
                      </Text>
                    </Text>
                    <Block flex={0} center paddingRight={10}>
                      <Image
                        radius={0}
                        width={30}
                        height={30}
                        // color={colors.primary}
                        source={require('../../../assets/icons/yes.png')}
                        // transform={[{rotate: '180deg'}]}
                      />
                    </Block>
                  </Block>
                ))}
              </Block>
            )}
          </>
        )}
      </View>
    </>
  );
};

export default ChallengeDetailsPage;
