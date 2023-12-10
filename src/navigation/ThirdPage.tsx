/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useState , useLayoutEffect} from 'react';

import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';

import {
  StyleSheet,
  // Text,
  View,
  SafeAreaView,
  Platform,
  // Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

export default function ThirdPage() {
  const {assets,fonts ,  sizes,gradients,  colors} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
 

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Image
          radius={0}
          resizeMode="cover"
          width={sizes.width}
          height={headerHeight}
          source={assets.header4}
        />
      ),
    });
  }, [assets.header4, navigation, sizes.width, headerHeight]);




  return (
    <Block>
       <>
 


 <View style={styles.container} >
  <TouchableOpacity
    
    // onPress={() => navigation.navigate('Details')}
    onPress={() => handleProducts(2)}
    onPressOut={() => navigation.navigate('dietcalculation')}
    
  >
    <Block style={styles.mainCardView}
     flex={0}
     radius={46}
     gradient={gradients?.[tab === 2 ? 'success' : '#fffff']}
    

   
    >
    
    <View style={{ flexDirection: "row", alignItems: "center" }}>
       <View style={styles.subCardView} >
         <Image
          // source={require('../../../assets/weight.png')}
          source={assets.veg}
           resizeMode="contain"
           style={{
             borderRadius: 0,
             height: 40,
             width: 40,
           }}
         />
       </View>
       <Block style={{ marginLeft: 42 }}>
         <Text
          p font={fonts.semibold}
         >
           {"VEGETARIAN"} 
         </Text>
         <View
           style={{
             marginTop: 4,
             borderWidth: 0,
             width: "85%",
           }}
         >
         
         </View>
       </Block>
     </View>
     
    </Block>
    </TouchableOpacity>
    <TouchableOpacity
    
  
   
    
  >
    <Block style={styles.mainCardView}
     flex={0}
     radius={46}
     gradient={gradients?.[tab === 3 ? 'success' : '#fffff']}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
       <View style={styles.subCardView}>
         <Image
        //  source={require('../../../assets/fitness2.png')}
        source={assets.chicken}
           resizeMode="contain"
           style={{
             borderRadius: 0,
             height: 50,
             width: 50,
           }}
         />
       </View>
       <View style={{ marginLeft: 42 }}>
         <Text
            p font={fonts.semibold}
         >
           {"NON-VEGETARIAN"}
         </Text>
         <View
           style={{
             marginTop: 4,
             borderWidth: 0,
             width: "85%",
           }}
         >
         
         </View>
       </View>
     </View>
    </Block>
    </TouchableOpacity>
   
  </View>


</>
    </Block>
  );
}
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "#22faa0",

    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  img: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: { backgroundColor: "", flexDirection: "row", flex: 1 },
  cover: { padding: 30, width: "50%", height: "10%" },
  text: { padding: 30 },
  container: {
    flex: 4,
    flexDirection: "row", // set elements horizontally, try column.
    padding: 30,
    top:100
  },
  powderblue: {
    width: 60,
    height: 60,
    backgroundColor: "powderblue",
  },
  skyblue: {
    width: 60,
    height: 60,
    backgroundColor: "skyblue",
  },
  steelblue: {
    width: 60,
    height: 60,
    backgroundColor: "steelblue",
  },
  container: {
    flex: 3,
    backgroundColor: "#f9f6ee",

  },
  mainCardView: {
      // top:70,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#27f29c",
    borderRadius: 35,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 16,
  },
  subCardView: {
    height: 20,
    width: 50,
    borderRadius: 0,
    backgroundColor: "transparent",
    borderColor: "green",
    borderWidth: 1,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
});