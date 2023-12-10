/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {useData, useTheme, useTranslation} from '../../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../../components';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import DuoToggleSwitch from 'react-native-duo-toggle-switch';
import Ripple from 'react-native-material-ripple';
// import ErrorModal from './ErrorModal';
// const formData = {
//   acitivity_level: 'sedentary',
//   age: '29',
//   customer_id: '14',
//   device_token: '',
//   dob: '',
//   email: 'saasaee@gmail.com',
//   first_name: '',
//   gender: '',
//   height: '',
//   height_unit: '',
//   image: '',
//   is_vegetarian: '',
//   last_name: '',
//   mobile_number: '',
//   weekly_goal: '',
//   weight: '',
//   weight_unit: '',
//   weight_want_to: '',
// };

const GymDifficultyLevel = ({
  navigation,
  route: {
    params: {workoutData},
  },
}) => {
  console.log(workoutData);

  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [difficulty, setDifficulty] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );
  const handleOptionSelect = (option) => {
    setDifficulty(option);
    const updatedFormData = {
      ...workoutData,
      gym_workout_level: option,
    };

    navigation.setParams({workoutData: updatedFormData});
    console.log(updatedFormData);

    // navigation.navigate('Demo1', {formData: updatedFormData});
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
          <Block padding={50}>
            <Text center bold primary size={18}>
              Select your fitness level
            </Text>
          </Block>
          <TouchableWithoutFeedback
            onPress={() => {
              handleProducts(2);
              handleOptionSelect('beginner');
            }}>
            <Block
              row
              center
              style={styles.mainCardView}
              gradient={gradients?.[tab === 2 ? 'success' : '#ffff']}>
              <Block
                shadow
                row
                // padding={10}
                width={390}
                style={{padding: 10}}>
                <Block padding={10} center>
                  <Text bold size={sizes.sm} center>
                    BEGINNER
                  </Text>
                </Block>
                {/* <Block row center>
                <Block padding={5}>
                  <Button warning shadow width={10}></Button>
                </Block>
                <Block padding={5}>
                  <Button light shadow width={10}></Button>
                </Block>

                <Block padding={5}>
                  <Button light shadow width={10}></Button>
                </Block>
              </Block> */}
                <Block row center>
                  <Block style={styles.box}>
                    {/* <Button warning shadow width={10}></Button> */}
                  </Block>
                  <Block style={styles.box1}>
                    {/* <Button warning shadow width={10}></Button> */}
                  </Block>

                  <Block style={styles.box1}>
                    {/* <Button warning shadow width={10}></Button> */}
                  </Block>
                </Block>
              </Block>
            </Block>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              handleProducts(3);
              handleOptionSelect('intermediate');
            }}>
            <Block
              row
              center
              style={styles.mainCardView}
              gradient={gradients?.[tab === 3 ? 'success' : '#ffff']}
            >
              <Block
                row
                padding={10}
           
              >
                <Block padding={10} center>
                  <Text bold size={sizes.sm} center>
                    INTERMEDIATE
                  </Text>
                </Block>
                <Block row center>
                  <Block style={styles.box}>
                    {/* <Button warning shadow width={10}></Button> */}
                  </Block>
                  <Block style={styles.box}>
                    {/* <Button warning shadow width={10}></Button> */}
                  </Block>

                  <Block style={styles.box1}>
                    {/* <Button warning shadow width={10}></Button> */}
                  </Block>
                </Block>
              </Block>
            </Block>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              handleProducts(4);
              handleOptionSelect('expert');
            }}>
            <Block
              center
              row
              padding={10}
              style={styles.mainCardView}
              gradient={gradients?.[tab === 4 ? 'success' : '#ffff']}>
                <Block row>
                <Block padding={10} center>
                <Text bold size={sizes.sm} center>
                  EXPERT
                </Text>
              </Block>
              <Block row center>
                <Block style={styles.box}>
                  {/* <Button warning shadow width={10}></Button> */}
                </Block>
                <Block style={styles.box}>
                  {/* <Button warning shadow width={10}></Button> */}
                </Block>

                <Block style={styles.box}>
                  {/* <Button warning shadow width={10}></Button> */}
                </Block>
              </Block>
                </Block>
             
            </Block>
          </TouchableWithoutFeedback>
        </Block>
      </Block>
      <Block paddingTop={140}>
        <Block style={styles.bottom}>
          <TouchableWithoutFeedback
            onPress={() => {
              // handleProducts(4);
              // navigation.navigate('HomeWorkoutMain');
              if (workoutData.gym_workout_level) {
                navigation.navigate('GymAnimationPageWorkout', {workoutData});
              } else {
                alert('please select your fitness level');
              }
            }}>
            <Block style={styles.mainCardView1} padding={20} center>
              <Block>
                <Text bold size={sizes.sm}>
                  Finish
                </Text>
              </Block>
            </Block>
          </TouchableWithoutFeedback>
        </Block>
      </Block>
      {/* <ErrorModal  isVisible={showModal}
        onClose={() => setShowModal(false)}
        
        /> */}
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
    flex: 1,
    flexDirection: 'row',
    height: 80,
    // minWidth: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    borderRadius: 30,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
    // fontSize:100,
    // borderWidth: 0.3,
    // borderColor: 'gray',
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    // marginLeft: 16,
    // marginRight: 16,
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
  box: {
    minWidth: 5,
    minHeight: 10,
    backgroundColor: '#FFB506',
    marginTop: 5,
    marginBottom: 5,
    marginRight: 9,
    borderRadius: 5,
  },
  box1: {
    minWidth: 5,
    minHeight: 10,
    backgroundColor: '#ffe6aa',
    marginTop: 5,
    marginBottom: 5,
    marginRight: 9,
    borderRadius: 5,
  },
});

export default GymDifficultyLevel;
