/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';

import api, {setAuthToken} from '../../api';

import {View, Platform, StyleSheet, TextInput} from 'react-native';
import {Animated, Easing} from 'react-native';

import {Text, Block, Button, Input, Image} from '../components';
import {useTheme} from '../hooks';

import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

const isAndroid = Platform.OS === 'android';

const FirstPageCountrySelect = ({navigation}) => {
  const {assets, colors, gradients, sizes} = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [originalCountries, setOriginalCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const fetchCountryList = async () => {
    try {
      const response = await api.get('get_country_list');
      const countries = response.data.data;
      setOriginalCountries(countries);
      setSearchResults(countries);
    } catch (error) {
      console.error('Error fetching country list:', error);
    }
  };

  useEffect(() => {
    fetchCountryList();
  }, []);

  const handleSearch = (text) => {
    setSelectedCountry(null);
    setSearchTerm(text);
    const filteredCountries = originalCountries.filter((country) =>
      country.country_name.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchResults(filteredCountries);
  };
  const handlePress = (country) => {
    console.log(country, 'country data');
    setSelectedCountry(country);
    setSearchTerm('');
  };

  return (
    <Block safe marginTop={sizes.xl}>
      <Block scrollEnabled>
        <Block card>
          <Block
            flex={0}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              width={100}
              height={30}
              source={require('../assets/icons/minus.png')}
              color={'#f2f2f2'}></Image>
          </Block>
          <Text center size={22} bold paddingTop={15}>
            Country
          </Text>
          <Block
            flex={0}
            paddingTop={30}
            paddingHorizontal={sizes.sm}
            style={{position: 'relative'}}>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/icons/search.png')} // Replace with your icon source
                style={styles.icon}
                color={'green'}
              />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder="Search"
                onChangeText={handleSearch}
                value={searchTerm}
              />
            </View>
          </Block>
          <Block flex={1} padding={10} marginTop={20}>
            {selectedCountry ? (
              <>
                <Block
                  flex={0}
                  height={70}
                  radius={sizes.sm}
                  shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                  marginTop={sizes.m}
                  marginHorizontal={10}
                  card
                  color={'lightgreen'}
                  center>
                  <Block row align="center">
                    <Block flex={0}>
                      {selectedCountry.image_sm ===
                      'https://admin.fitaraise.com/storage/uploads/app_images/no_image.png' ? (
                        <Block
                          style={{
                            width: sizes.xl,
                            height: sizes.xl,
                            backgroundColor: '#fff',
                            borderRadius: sizes.s,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          marginLeft={sizes.s}>
                          <Text
                            style={{fontSize: 50, color: '#fff'}}
                            bold
                            white>
                            {selectedCountry.country_name.charAt(0)}
                          </Text>
                        </Block>
                      ) : (
                        <Image
                          source={{uri: `${selectedCountry.image_sm}`}}
                          style={{
                            width: 30,
                            height: 30,
                          }}
                          marginLeft={sizes.s}
                        />
                      )}
                    </Block>
                    <Block flex={3} style={{alignSelf: 'center'}}>
                      <Text p white semibold center padding={10}>
                        {selectedCountry.country_name}
                      </Text>
                    </Block>
                  </Block>
                </Block>
                <Block>
                  
                </Block>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginBottom: 30,
                    paddingRight: 10,
                  }}>
                  <TouchableWithoutFeedback onPress={()=>{
                    const countryCode = selectedCountry.code;
                    navigation.navigate('loginNew', {country: countryCode})
                  }}>
                    <Image source={assets.Button} />
                  </TouchableWithoutFeedback>
                </View>
              </>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                  <TouchableWithoutFeedback onPress={() => handlePress(item)}>
                    <Block
                      flex={0}
                      radius={sizes.sm}
                      shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                      marginTop={sizes.m}
                      marginHorizontal={10}
                      card
                      color="white"
                      center>
                      <Block row align="center">
                        <Block flex={0}>
                          {item.image_sm ===
                          'https://admin.fitaraise.com/storage/uploads/app_images/no_image.png' ? (
                            <Block
                              style={{
                                width: sizes.xl,
                                height: sizes.xl,
                                backgroundColor: '#fff',
                                borderRadius: sizes.s,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              marginLeft={sizes.s}>
                              <Text
                                style={{fontSize: 50, color: '#fff'}}
                                bold
                                primary>
                                {item.country_name.charAt(0)}
                              </Text>
                            </Block>
                          ) : (
                            <Image
                              source={{uri: `${item.image_sm}`}}
                              style={{
                                width: 30,
                                height: 30,
                              }}
                              marginLeft={sizes.s}
                            />
                          )}
                        </Block>
                        <Block flex={3} style={{alignSelf: 'center'}}>
                          <Text p black semibold center padding={10}>
                            {item.country_name}
                          </Text>
                        </Block>
                      </Block>
                    </Block>
                  </TouchableWithoutFeedback>
                )}
              />
            )}
          </Block>
        </Block>
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#f2f8fc',
    borderRadius: 15,
    borderWidth: 0.3,
    padding: 15,
    marginBottom: 10,
    paddingRight: 0,
    backgroundColor: '#f2f8fc',
    // minHeight:30
  },
  icon: {
    width: 20, // Adjust icon width as needed
    height: 20, // Adjust icon height as needed
    marginRight: 10, // Adjust spacing between icon and input field as needed
    color: 'green',
  },
  input: {
    flex: 1, // Allow input field to expand to fill available space
  },
});
export default FirstPageCountrySelect;
