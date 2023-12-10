/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {BASE_URL} from '@env';
import {useTheme, useTranslation} from '../hooks/';
import {Block, Image, Input, Text} from '../components/';
import {Platform, TouchableOpacity, SectionList ,TouchableWithoutFeedback, StyleSheet} from 'react-native';
import Axios from 'axios';
import {FlatList} from 'react-native';
import api from '../../api';
import { View } from 'react-native';
import { TextInput } from 'react-native';
type Movie = {
  id: string;
  title: string;
  releaseYear: string;
};
const isAndroid = Platform.OS === 'android';
const DietPlanDynamic = ({route, navigation}) => {
  const {mealType, meal_type , formDataCopy} = route.params;
  // console.log(formDataCopy);
  
  const {t} = useTranslation();
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [searchResults, setSearchResults] = useState([]);
  // console.log(searchResults);
  
  const [error, setError] = useState(null);
  // console.log(meal_type);

  const fetchResults = (search_word: any) => {
    if (search_word.length >= 3) {
      try {
        api.get(`get_food_items/${search_word}`).then(
          (response) => {
            setSearchResults(response.data.data.data);
          },
        );
        setError(null);
      } catch (e) {
        console.log(e);
      }
    } else {
      // Clear the search results if the search word is less than three characters long
      setSearchResults([]);
    }
  };
  const handlePress = (food) => {
    if (food) {
      // console.log(food, "food data");
      
      try {
        api.get(`get_food_item_datas_with_id/${food.id}`).then(
          (response) => {
            const responseData = response.data.data;
            navigation.navigate('searchfoodData', {
              mealType,
              responseData,
              meal_type,
              formDataCopy,
              food

            });
          },
        );
        setError(null);
      } catch (e) {
        console.log(e);
      }
    }
  };
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN = (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  return (
    <Block safe>
      <Block
      // card
        color={colors.card}
        flex={0}
        paddingBottom={sizes.padding}
        paddingHorizontal={sizes.m}
        paddingTop={sizes.s}
        radius={10}
        >
        {/* <Input
          onChangeText={fetchResults}
          placeholder="Search food,meals or Brand "
        /> */}
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
                // onChangeText={handleSearch}
                // value={searchTerm}
                onChangeText={fetchResults}
              />
            </View>
      </Block>
      <Block
            flex={0}
            paddingTop={10}
            paddingHorizontal={sizes.sm}
            style={{position: 'relative'}}>
           
          </Block>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
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
                  {item.image ===
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
                      <Text style={{fontSize: 50, color: '#fff'}} bold primary>
                        {item.food_name.charAt(0)}
                      </Text>
                    </Block>
                  ) : (
                    <Image
                      source={{uri: `${item.image}`}}
                      style={{
                        width: sizes.xl,
                        height: sizes.xl,
                      }}
                      marginLeft={sizes.s}
                    />
                  )}
                </Block>
                <Block flex={3} style={{alignSelf: 'center'}}>
                  <Text p black semibold center padding={10}>
                    {item.food_name}
                  </Text>
                </Block>
                <TouchableOpacity onPress={() => handlePress(item)}>
                  <Block flex={0} style={{alignSelf: 'center'}}>
                    <Image
                      radius={0}
                      width={30}
                      height={30}
                      color={'#c58bf2'}
                      source={assets.plus}
                      transform={[{rotate: '360deg'}]}
                      margin={sizes.s}
                    />
                  </Block>
                </TouchableOpacity>
              </Block>
            </Block>
          </TouchableWithoutFeedback>
        )}
      />
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

export default DietPlanDynamic;
