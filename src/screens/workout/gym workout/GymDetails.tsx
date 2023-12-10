import React, {useEffect, useState} from 'react';
import {TextInput, View} from 'react-native';
import {Block, Button, Image, Input, Text} from '../../../components';
import {useTheme} from '../../../hooks';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '@env';
import DuoToggleSwitch from 'react-native-duo-toggle-switch';
import Ripple from 'react-native-material-ripple';

const GymDetails = ({
  workout,
  timeLeft,
  formattedTime,
 
}) => {
  // console.log(index, 'log index');

  const [inputValueKg, setInputValueKg] = useState('');
  const [inputValueLbs, setInputValueLbs] = useState('');
  const [lbsView, setLbsView] = useState(false);
  const [showModalKg, setModalKg] = useState(false);
  const [isKg, setIsKg] = useState(true);
  console.log(formattedTime, 'TESTING');
  // const [kgInputValues, setKgInputValues] = useState(
  //   Array(workout.sets).fill(''),
  // );

  // const [lbsInputValues, setLbsInputValues] = useState(
  //   Array(workout.sets).fill(''),
  // );
  // const [repsInputValuesLbs, setRepsInputValuesLbs] = useState(
  //   Array(workout.sets).fill(''),
  // );
  // const [repsInputValuesKg, setRepsInputValuesKg] = useState(
  //   Array(workout.sets).fill(''),
  // );
  // console.log(lbsInputValues, 'kg values ');
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
  };
  // console.log(repsInputValuesLbs, 'reps ');

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
  const navigation = useNavigation();
  // console.log(timeLeft);
  const handleFinish = () => {
    axios
      .post(
        `${BASE_URL}add_home_workout_excercises_done`,
        {
          customer_id,
          workout_id,
          excercise_id,
          home_workout_excercise,
          completed_date,
        },
        {
          headers: {
            Authorization: `Bearer 477|F4h2p6ibB4FFhCwx0RJLNO6rPRXhPbMttg2x1iYT`,
          },
        },
      )
      .then((response) => {
        console.log(response.data);
        // setExerciseData(response.data.data);
        // console.log('Exercise data after API call:', response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching exercise data:', error);
      });
  };
  // Validation function to check if all input fields are filled
  // const areFieldsFilled = () => {
  //   const isKgFilled = kgInputValues.every((value) => value.trim() !== '');
  //   const isLbsFilled = lbsInputValues.every((value) => value.trim() !== '');
  //   const isRepsKgFilled = repsInputValuesKg.every(
  //     (value) => value.trim() !== '',
  //   );
  //   const isRepsLbsFilled = repsInputValuesLbs.every(
  //     (value) => value.trim() !== '',
  //   );

  //   // Check if all elements in kgInputValues are filled AND
  //   // all elements in repsInputValuesKg are filled OR
  //   // all elements in lbsInputValues are filled AND
  //   // all elements in repsInputValuesLbs are filled
  //   return (isKgFilled && isRepsKgFilled) || (isLbsFilled && isRepsLbsFilled);
  // };
  // const areFieldsFilled = () => {
  //   const kgValues = kgInputValues.slice(0, workout.sets);
  //   const lbsValues = lbsInputValues.slice(0, workout.sets);
  //   const repsLbsValues = repsInputValuesLbs.slice(0, workout.sets);
  //   const repsKgValues = repsInputValuesKg.slice(0, workout.sets);

  //   // Check if either kgInputValues and repsInputValuesKg or lbsInputValues and repsInputValuesKg are filled
  //   const kgAndRepsKgFilled =
  //     kgValues.every((value) => value.trim() !== '') &&
  //     repsKgValues.every((value) => value.trim() !== '');

  //   const lbsAndRepsKgFilled =
  //     lbsValues.every((value) => value.trim() !== '') &&
  //     repsLbsValues.every((value) => value.trim() !== '');

  //   return ((kgAndRepsKgFilled) || (lbsAndRepsKgFilled));
  // };

  // Call the callback function to update the state on the main page
  // useEffect(() => {
  //   onFieldsFilled(areFieldsFilled());
  // }, [kgInputValues, lbsInputValues, repsInputValuesLbs, repsInputValuesKg]);

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
          {/* <Text center p white marginLeft={sizes.s}>
            'profile.title'
              </Text> */}
        </Button>
        <Block>
        <Text center h5 bold  marginTop={sizes.s} marginLeft={-30}>
          {workout.name}
        </Text>
        </Block>
       
      </Block>

      <Image
        background
        // resizeMode="cover"
        padding={sizes.m}
        paddingBottom={sizes.l}
        height={350}
        radius={30}
        margin={10}
        source={{
          uri: `${workout.image}`,
        }}></Image>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 30,
        }}>
        {workout.time_or_sets === 'time' ? (
          <>
            <Text padding={10} paddingTop={40} bold size={30}>
              {formattedTime}
            </Text>
          </>
        ) : (
          <>
            <Text padding={10} paddingTop={40} bold size={30}>
              Sets : {workout.sets}
            </Text>
            {/* <Block
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
                        padding:10
                      }}
                      onChangeText={(text) =>
                        handleKgInputChange(setIndex, text)
                      }
                    />
                    <TextInput
                      // key={setIndex}
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
                        padding:10
                      }}
                      onChangeText={(text) =>
                        handleRepsKgInputChange(setIndex, text)
                      }
                    />
                  </View>
                ))}
              </Button>
            ) : (
              <Button>
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
                      onChangeText={(text) =>
                        handleLbsInputChange(setIndex, text)
                      }
                    />
                    <TextInput
                      // key={setIndex}
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
                      onChangeText={(text) =>
                        handleRepsLbsInputChange(setIndex, text)
                      }
                    />
                  </View>
                ))}
              </Button>
            )} */}
          </>
        )}
      </View>
    </>
  );
};

export default GymDetails;
