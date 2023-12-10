/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import api, {setAuthToken} from '../../api';
import SelectDropdown from 'react-native-select-dropdown';

import {View, Platform, Image, StyleSheet} from 'react-native';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';
import {Text, Block, Button, Input} from '../components';
import {useTheme} from '../hooks';
import {Picker} from '@react-native-picker/picker';

const isAndroid = Platform.OS === 'android';

const CountrySelect = ({navigation}) => {
  const {assets, colors, gradients, sizes} = useTheme();

  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchCountryList = async () => {
      try {
        const response = await api.get('get_country_list');
        const countries = response.data.data;
        // console.log(countries);

        setCountryList(countries);
      } catch (error) {
        console.error('Error fetching country list:', error);
      }
    };

    fetchCountryList();
  }, []);

  // Handle country selection
  const handleCountryChange = (index) => {
    if (countryList[index]) {
      setSelectedCountry(countryList[index].code);
    }
  };

  console.log(selectedCountry);

  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Block safe marginTop={sizes.xl} style={{backgroundColor: '#ffff'}}>
      <Block scrollEnabled>
        <Block>
          <Image
            resizeMode="cover"
            source={require('../assets/images/country.jpg')}
            style={{alignSelf: 'flex-start', zIndex: 10}}
          />
          <Lottie
            style={{position: 'absolute'}}
            marginBottom={sizes.sm}
            source={require('../assets/json/bg.json')}
            progress={animationProgress.current}
          />
        </Block>
        <Block paddingHorizontal={sizes.sm}>
          <Block align="center" flex={0} center>
            <SelectDropdown
              // defaultValue={selectedCountry}
              defaultButtonText="Please Select country"
              dropdownStyle={{borderRadius: 20, height: 400, width: 350}}
              buttonStyle={{
                // height: 400,
                width: 350,
                backgroundColor: 'white',
                borderRadius: 20,
                marginLeft: 10,
              }}
              data={countryList.map((country) => country.country_name)} // Use the list of country labels as data
              onSelect={(selectedItem, index) => {
                handleCountryChange(index);
              }} // Call handleCountryChange when a country is selected
            />
          </Block>

          <Block center>
            <Button
              gradient={gradients.primary}
              shadow={!isAndroid}
              marginVertical={sizes.s}
              marginHorizontal={sizes.sm}
              disabled={!selectedCountry}
              onPress={() =>
                navigation.navigate('login', {country: selectedCountry})
              }>
              <Text bold h5 white>
                Next
              </Text>
            </Button>
          </Block>
        </Block>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text style={{color: 'green', fontWeight: '700'}}> Register</Text>
          </TouchableOpacity>
        </View> */}
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 20,
    marginRight: 10,
  },
});
export default CountrySelect;
