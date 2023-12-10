/* eslint-disable prettier/prettier */
import React, {useState, useRoute, useContext} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {DonutChart} from 'react-native-circular-chart';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import {Block, Button, Text, Image} from '../components';
import {SIZES} from '../constants/light';
import Svg, {Circle} from 'react-native-svg';
import {G} from 'react-native-svg';
import {useTheme} from '../hooks';
import NextButton from './NextButton';
import DonutChart1 from './DonutChart';
import api, {setAuthToken} from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginContext from '../hooks/LoginContext';

// const data=
// {calories: 1648, carb_g: 206, carb_percent: "50%", fat_g: 37, fat_percent: "20%", protien_g: 124, protien_percent: "30%"}

const CirclePage = ({route, navigation}) => {
  const {data, formDataCopy, dietPlan} = route.params;
  console.log(data, formDataCopy, dietPlan, 'formdata check');
  // const donutData = data.map((item) => ({
  //   name: item.key,
  //   value: Number(item.value.replace('%', '')),
  //   color: item.svg.fill,
  // }));

  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [tab, setTab] = useState<number>(0);
  const {width, height} = useWindowDimensions();
  const PADDING = 8;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = 50;
  const progressOffset = circumference - (progress / 100) * circumference;

  async function checkPage() {
    try {
      // Retrieve the existing authData from AsyncStorage
      const existingAuthDataString = await AsyncStorage.getItem('authData');
      const existingAuthData = JSON.parse(existingAuthDataString) || {};

      // Merge the new data with the existing authData
      const updatedAuthData = {
        ...existingAuthData,
        data,
        formDataCopy,
        dietPlan,
      };
      console.log(data, 'check');

      // Store the updated authData object as a JSON string in AsyncStorage
      await AsyncStorage.setItem('authData', JSON.stringify(updatedAuthData));

      // Show a success message
      console.log('Data saved successfully.');
      navigation.navigate('Menu', {data, formDataCopy, dietPlan});

      // Navigate to the desired screen with the parameters
      // navigation.navigate('Loading', {

      //     data,
      //     formDataCopy,
      //     dietPlan,

      // });
    } catch (error) {
      // Handle errors that may occur during retrieval or storage
      console.error('Error while saving data:', error);
      // You can also show an error message to the user if needed.
    }
  }
  //   const redirectTo = async ()=>{

  //     try {
  //       console.log("clicked");

  //       const authDataJSON = await AsyncStorage.getItem('authData');
  //       console.log(authDataJSON , "authdata first page");

  //       if (authDataJSON) {
  //         const authData = JSON.parse(authDataJSON);

  //         const authToken = authData.token;
  //         const customerId = authData.formData.customer_id;
  //         const formData = authData.formData;
  //         const token = authData.token;

  //         // loginSuccess(customerId, formData, token);
  //         console.log(authToken , "auth Data");
  //         if (authToken) {
  //           // setAuthToken(authToken);
  //           // setIsLoading(true);
  //           const requiredCalorieResponse = await api.get(`get_daily_required_calories/${formData.customer_id}`);
  //           const diet_List = await api.get(`get_recommended_diet/${formData.customer_id}`);

  //           const requiredCalorie = requiredCalorieResponse.data.data;

  //           const dietPlan = diet_List.data.data.recommended_diet_list;
  //           console.log(requiredCalorie , "calorie required");
  //           console.log(authData.formData , "for workout example");

  //             // setIsLoading(false);

  //             if ((requiredCalorieResponse.data.success === true) && (authData.formData)) {
  //                 navigation.reset({
  //                 index: 0,
  //                 routes: [{ name: 'Menu', params: { data: requiredCalorie, formDataCopy: authData.formData, dietPlan } }],
  //               });
  //               // navigation.navigate('Menu', { data: requiredCalorie, formDataCopy: authData.formData, dietPlan });
  //             } else if (authData.formData) {
  //               navigation.navigate('Details', { formData: authData.formData });
  //             } else {
  //               navigation.reset({
  //                 index: 0,
  //                 routes: [{ name: 'loginNew' }],
  //               });
  //             }
  //           // Replace 2000 with the desired loading duration (in milliseconds)
  //         } else {
  //           // No authToken, navigate to 'loginNew'
  //           navigation.reset({
  //             index: 0,
  //             routes: [{ name: 'loginNew' }],
  //           });
  //         }
  //       } else {
  //         // authData JSON doesn't exist, navigate to 'loginNew'
  //         navigation.reset({
  //           index: 0,
  //           routes: [{ name: 'loginNew' }],
  //         });
  //       }
  //       // setIsLoading(false);
  //     } catch (error) {
  //       console.error('Authentication Status Error:', error);
  //       // setIsLoading(false);
  //       navigation.reset({
  //         index: 0,
  //         routes: [{ name: 'loginNew' }],
  //       });
  //     }

  //  }
  const {loginSuccess} = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = async () => {
    try {
      console.log('clicked');
      if (data && formDataCopy && dietPlan !== null) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Menu', params: { data, formDataCopy, dietPlan } }],
        });
      }
    } catch (error) {
      console.error('Authentication Status Error:', error);

      navigation.reset({
        index: 0,
        routes: [{name: 'FirstPageCountrySelect'}],
      });
    }
  };
  // const redirectTo = async () => {
  //   try {
  //     console.log('clicked');

  //     const authDataJSON = await AsyncStorage.getItem('authData');
  //     console.log(authDataJSON, 'authdata first page');

  //     if (authDataJSON) {
  //       const authData = JSON.parse(authDataJSON);

  //       const authToken = authData.token;
  //       const customerId = authData.formData.customer_id;
  //       const formData = authData.formData;
  //       const token = authData.token;

  //       loginSuccess(customerId, formData, token);
  //       console.log(authToken, 'auth Data');
  //       if (authToken) {
  //         setAuthToken(authToken);
  //         // setIsLoading(true);
  //         const requiredCalorieResponse = await api.get(
  //           `get_daily_required_calories/${formData.customer_id}`,
  //         );
  //         const diet_List = await api.get(
  //           `get_recommended_diet/${formData.customer_id}`,
  //         );

  //         const requiredCalorie = requiredCalorieResponse.data.data;

  //         const dietPlan = diet_List.data.data.recommended_diet_list;
  //         console.log(requiredCalorie, 'calorie required');
  //         console.log(authData.formData, 'for workout example');

  //         // setIsLoading(false);

  //         if (
  //           requiredCalorieResponse.data.success === true &&
  //           authData.formData
  //         ) {
  //             navigation.reset({
  //             index: 0,
  //             routes: [{ name: 'Menu', params: { data: requiredCalorie, formDataCopy: authData.formData, dietPlan } }],
  //           });
  //       //  navigation.navigate('Menu'
  //       //     // , {
  //       //     //   data: requiredCalorie,
  //       //     //   formDataCopy: authData.formData,
  //       //     //   dietPlan,
  //       //     // }
  //       //     );
  //         } else if (authData.formData) {
  //           navigation.navigate('Details', {formData: authData.formData});
  //         } else {
  //           navigation.reset({
  //             index: 0,
  //             routes: [{name: 'loginNew'}],
  //           });
  //         }
  //         // Replace 2000 with the desired loading duration (in milliseconds)
  //       } else {
  //         // No authToken, navigate to 'loginNew'
  //         navigation.reset({
  //           index: 0,
  //           routes: [{name: 'loginNew'}],
  //         });
  //       }
  //     } else {
  //       // authData JSON doesn't exist, navigate to 'loginNew'
  //       navigation.reset({
  //         index: 0,
  //         routes: [{name: 'loginNew'}],
  //       });
  //     }
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error('Authentication Status Error:', error);
  //     setIsLoading(false);
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: 'FirstPageCountrySelect'}],
  //     });
  //   }
  // };

  return (
    <Block
      scroll
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingVertical: sizes.padding}}>
      <Image
        marginTop={20}
        background
        padding={15}
        blurRadius={10}
        resizeMode="cover"
        source={require('../assets/images/bg111.jpg')}
        radius={sizes.cardRadius}>
        <Block
          card
          padding={SIZES.s}
          flex={2}
          marginHorizontal={10}
          style={{marginTop: 60, alignSelf: 'center', paddingTop: 30}}>
          <Block flex={2} style={{position: 'relative', paddingBottom: 0}}>
            <Block card style={{width: 350}}>
              <DonutChart1 navigation={navigation} route={route} />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 24, fontWeight: 'bold'}}>
                  {data.calories}
                </Text>
                <Text
                  style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}
                  bold>
                  KCAL
                </Text>
              </View>
            </Block>
          </Block>

          <Block
            flex={1}
            center
            marginTop={20}
            marginBottom={20}
            style={{alignSelf: 'center', position: 'relative'}}>
            <Text bold style={{fontSize: 24}}>
              Daily recommended nutrtional values
            </Text>
          </Block>

          <Block
            flex={0}
            row
            center
            style={{position: 'relative'}}
            marginBottom={15}
            marginTop={10}>
            <Block center align="center" style={{maxHeight: 100}}>
              <Text p black bold>
                Energy
              </Text>
              <Text p black semibold padding={10} center>
                {data.calories} KCAL
              </Text>
            </Block>
            <Block center align="center" style={{maxHeight: 90}}>
              <Text p danger bold>
                Protein
              </Text>
              <Text p danger semibold padding={10} center>
                {data.protien_g}g ({data.protien_percent})
              </Text>
            </Block>
            <Block center align="center" style={{maxHeight: 90}}>
              <Text p primary bold>
                Carbs
              </Text>
              <Text p primary semibold padding={10} center>
                {data.carb_g}g ({data.carb_percent})
              </Text>
            </Block>
            <Block center align="center" style={{maxHeight: 90}}>
              <Text p info bold>
                Fats
              </Text>
              <Text p info semibold padding={10} center>
                {/* {data.protien_g} */}
                {data.fat_g}g ({data.fat_percent})
              </Text>
            </Block>
          </Block>
        </Block>
      </Image>
      <Block card padding={0} marginHorizontal={10} marginTop={10}>
        <Image
          background
          padding={15}
          blurRadius={10}
          resizeMode="cover"
          // source={require('../assets/images/bg111.jpg')}
          radius={sizes.cardRadius}>
          <TouchableOpacity
            onPress={() => {
              redirectTo();
            }}>
            <Block flex={1} paddingTop={10}>
              <Block>
                <Block
                  style={styles.mainCardView}
                  flex={0}
                  radius={46}
                  gradient={gradients?.[tab === 0 ? 'success' : '#fffff']}>
                  <Block center>
                    <Text p font={fonts.semibold} white>
                      {'Go to home'}
                    </Text>
                    <View
                      style={{
                        marginTop: 4,
                        borderWidth: 0,
                        width: '85%',
                      }}></View>
                  </Block>
                </Block>
              </Block>
            </Block>
          </TouchableOpacity>

          <Block flex={1} marginHorizontal={5} padding={20} paddingTop={0}>
            <Block row marginHorizontal={20}>
              <Text bold>* </Text>
              <Text semibold>Eat an overall balanced diet</Text>
            </Block>
            <Block row marginHorizontal={20}>
              <Text bold>* </Text>
              <Text semibold>Track your macros & follow your diet</Text>
            </Block>
            <Block row marginHorizontal={20}>
              <Text bold>* </Text>
              <Text semibold>Stay Hydrated </Text>
            </Block>
            <Block row marginHorizontal={20}>
              <Text bold>* </Text>
              <Text semibold>Don’t forget to do your excercise</Text>
            </Block>
            <Block row marginHorizontal={20}>
              <Text bold>* </Text>
              <Text semibold>Be consistent , The results will follow</Text>
            </Block>
          </Block>
        </Image>
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 0,
    margin: 10,
    position: 'relative',
    padding: 0,
  },
  contentContainer: {
    flex: 1,
  },
  section: {
    flex: 1,
    // Other styles for the last section of the page
  },
  sectionText: {
    fontSize: 24,
    marginBottom: 16,
  },
  buttonContainer: {
    position: 'absolute', // Positions the button absolutely
    bottom: 16, // Distance from the bottom of the page
    right: 16, // Distance from the right of the page
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    color: 'transparent',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },

  mainCardView: {
    height: 60,
    width: 250,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 15,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 10,
    marginBottom: 6,
  },
  sectionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'lightgray',
    backgroundColor: '#00000',
    marginVertical: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  container2: {
    flex: 0,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    paddingTop: 30,
    paddingRight: 30,
  },
});

export default CirclePage;
