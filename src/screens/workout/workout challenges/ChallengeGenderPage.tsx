/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {useData, useTheme, useTranslation} from '../../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../../components';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

const ChallengeGenderPage = ({
  navigation,
  route: {
    params: {workoutData},
  },
}) => {
  const {t} = useTranslation();

  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [gender, setGender] = useState('');
  const [tab, setTab] = useState<number>(0);
  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );
  const handleOptionSelect = (option) => {
    const updatedFormData = {
      ...workoutData,
      gender: option,
    };
    setGender(option);
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
          style={{justifyContent: 'center', flex: 1, marginTop: 150}}>
          <Block style={styles.container} center>
            <TouchableOpacity
              activeOpacity={0.9} // Adjust this value
              pressRetentionOffset={{top: 10, left: 10, bottom: 10, right: 10}}
              onPress={() => {
                handleOptionSelect('male');
                handleProducts(2);
              }}>
              <Block
                flex={2}
                style={styles.mainCardView}
                gradient={gradients?.[tab === 2 ? 'success' : '#ffff']}
                paddingTop={10}>
                <Image
                  source={require('../../../assets/images/male.png')}
                  // color={colors.white}
                  radius={0}
                />

                <Block marginTop={10}>
                  <Text bold>Male</Text>
                </Block>
              </Block>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9} // Adjust this value
              pressRetentionOffset={{top: 10, left: 10, bottom: 10, right: 10}}
              onPress={() => {
                handleProducts(3);
                handleOptionSelect('female');
              }}>
              <Block
                style={styles.mainCardView}
                gradient={gradients?.[tab === 3 ? 'success' : '#ffff']}
                paddingTop={3}>
                <Image
                  source={require('../../../assets/images/female.png')}
                  // color={colors.white}
                  radius={0}
                />

                <Block marginTop={10}>
                  <Text bold>Female</Text>
                </Block>
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
      <Block paddingTop={100}>
        <Block style={styles.bottom}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (gender) {
                navigation.navigate('ChallengeWeightAndHeight', {workoutData});
              } else {
                alert('Please select the gender');
              }
              // handleProducts(4);
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
});

export default ChallengeGenderPage;
