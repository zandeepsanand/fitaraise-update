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
import { useFavorites } from '../hooks/FavoritesContext';
type Movie = {
  id: string;
  title: string;
  releaseYear: string;
};
const isAndroid = Platform.OS === 'android';
const DietPlanDynamic = ({route, navigation}) => {
  const {mealType, meal_type , formDataCopy} = route.params;
  const {favorites,addToFavorites} = useFavorites();
  console.log(favorites,"check3");
  
  const {t} = useTranslation();
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [searchResults, setSearchResults] = useState([]);
  // console.log(searchResults);
  
  const [error, setError] = useState(null);
  // console.log(meal_type);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const toggleDropdown = (item) => {
    setDropdownVisible(dropdownVisible === item ? null : item);
  };
  const handleEdit = () => {
    // Implement your edit logic here
    console.log('Edit button clicked');
  };

  const handleRemove = (item) => {
    // Implement your remove logic here
    console.log(item,'Remove button clicked');
    setDropdownVisible(null);

    const id_of_food = item.food_id;
    addToFavorites(id_of_food);
  };

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

  const handlePressFavorite = (food) => {
    if (food) {
      // console.log(food, "food data");

      try {
        api.get(`get_food_item_datas_with_id/${food.food_id}`).then((response) => {
          const responseData = response.data.data;
          navigation.navigate('searchfoodData', {
            mealType,
              responseData,
              meal_type,
              formDataCopy,
              food
          });
        });
        setError(null);
      } catch (e) {
        console.log(e);
      }
    }
  };
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
                placeholder="Search Food , Meals or Brand"
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
      {/* <FlatList
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
      /> */}
       {searchResults.length > 0 ? (
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
                        <Text
                          style={{fontSize: 50, color: '#fff'}}
                          bold
                          primary>
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
      ) : (
        <>
          <Block flex={0} paddingHorizontal={20}>
            <Text padding={10} bold>
              Favorites
            </Text>
            {favorites.map((item, index) => (
              
              <Block flex={0} height={95} key={index} card marginVertical={10}>
              <Block row>
                <Block
                  flex={0}
                  center
                  width={60}
                  height={60}
                  radius={50}
                  color={'#f0f0f8'}
                  paddingLeft={18}
                  marginTop={10}>
                  <Image
                    color={'green'}
                    width={25}
                    height={25}
                    source={require('../assets/icons/bell2.png')}></Image>
                </Block>
                
                <Block flex={1} paddingLeft={20} paddingTop={15}>
                <TouchableOpacity onPress={()=>{
                  handlePressFavorite(item)
                }}>
                  <Block flex={0} center>
                    <Text p semibold>
                    {item.food_name}
                    </Text>
                    <Text
                      semibold
                      secondary
                      opacity={0.5}
                      paddingTop={5}
                      size={12}>
                      {item.food_name}
                    </Text>
                  </Block>
                  </TouchableOpacity>
                </Block>
               
                
                <Block flex={0} center paddingRight={10}>
                  <TouchableOpacity onPress={()=>{toggleDropdown(item)}}>
                    <Image
                      // color={'green'}
                      width={8}
                      height={30}
                      source={require('../assets/icons/dot.png')}></Image>
                  </TouchableOpacity>
                  
                </Block>
                {dropdownVisible === item && (
              <View style={styles.dropdown}>
                {/* <TouchableOpacity onPress={handleEdit}>
                  <Text>Edit</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={()=>handleRemove(item)}>
                  <Text>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
              </Block>
            </Block>
            ))}
          </Block>
        </>
      )}
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
  dropdown: {
    position: 'absolute',
    top: 10,
    right: 0,
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});

export default DietPlanDynamic;
