/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {useData, useTheme, useTranslation} from '../../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../../components/';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from 'react-native';

import api from '../../../../api';

const ChallengeMonth = ({
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
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {assets, colors, fonts, gradients, sizes} = useTheme();

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );

  useEffect(() => {
    const fetchData = async () => {



      try {
        if (!workoutData.workout_challenge_level || !workoutData.gender) {
          const userData = await api.post(`set_personal_datas`, workoutData);
          console.log(userData.data, "post data use workout");
          throw new Error('Please enter all details');
        }
        const response = await api.get(
          `get_workout_challenges?gender=${workoutData.gender}&level=${workoutData.workout_challenge_level}`,
          
        );

        const responseData = response.data.data;
        console.log(responseData);

        if (responseData === null) {
          throw new Error('Turn on the network and retry');
        }

        setMonths(responseData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [workoutData]);
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error: {error}</Text>
      </View>
    );
  }
 
  return (
    <Block>
      <Block flex={0} padding={sizes.padding}></Block>

      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.l}}>
        <Block
          row
          wrap="wrap"
          justify="space-between"
          marginTop={sizes.sm}></Block>
        <Block>
          <View style={styles.container1}>
            <ExpoStatusBar style="auto" />
          </View>

          <View style={styles.container}>
            {months.map((challenge, index) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  // navigation.navigate('ChallengeMain', {workoutData, challenge });
                  navigation.navigate('ChallengeTabNavigator', {
                    screen: 'ChallengeMain',
                    params: {  workoutData ,challenge},
                  });
                  handleProducts(challenge.number_of_days);
                }}>
                <Block
                  style={styles.mainCardView}
                  gradient={gradients?.[tab === challenge.number_of_days ? 'success' : '#ffff']}
                
                  >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.subCardView}></View>
                    <View style={{marginLeft: 12}}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                        bold>
                        {challenge.challenge_name}
                      </Text>
                      <View
                        style={{
                          marginTop: 4,
                          borderWidth: 0,
                          width: '85%',
                        }}></View>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 25,
                      backgroundColor: 'pink',
                      borderWidth: 0,
                      width: 25,
                      marginLeft: -26,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 50,
                    }}>
                    <Image
                      source={assets.arrow}
                      color={colors.white}
                      radius={0}
                    />
                  </View>
                </Block>
              </TouchableWithoutFeedback>
            ))}

            {/* <TouchableWithoutFeedback
              onPress={() => {
                handleProducts(3);
                navigation.navigate('ChallengeMain', {workoutData});
              }}>
              <Block
                style={styles.mainCardView}
                gradient={gradients?.[tab === 3 ? 'success' : '#ffff']}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.subCardView}></View>
                  <View style={{marginLeft: 12}}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                      bold>
                      3 MONTHS CHALLENGE
                    </Text>
                    <View
                      style={{
                        marginTop: 4,
                        borderWidth: 0,
                        width: '85%',
                      }}></View>
                  </View>
                </View>
                <View
                  style={{
                    height: 25,
                    backgroundColor: 'pink',
                    borderWidth: 0,
                    width: 25,
                    marginLeft: -26,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 50,
                  }}>
                  <Image
                    source={assets.arrow}
                    color={colors.white}
                    radius={0}
                  />
                </View>
              </Block>
            </TouchableWithoutFeedback> */}
          </View>
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
    flex: 4,
    flexDirection: 'row', // set elements horizontally, try column.
    padding: 20,
  },
  powderblue: {
    width: 60,
    height: 60,
    backgroundColor: 'powderblue',
  },
  skyblue: {
    width: 60,
    height: 60,
    backgroundColor: 'skyblue',
  },
  steelblue: {
    width: 60,
    height: 60,
    backgroundColor: 'steelblue',
  },
  container: {
    flex: 3,
    // backgroundColor: '#f9f6ee',
  },
  mainCardView: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    borderRadius: 30,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 16,
  },
  subCardView: {
    height: 50,
    width: 50,
    borderRadius: 0,
    backgroundColor: 'transparent',
    // borderColor: "green",
    // borderWidth: 1,
    // borderStyle: "solid",
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChallengeMonth;
