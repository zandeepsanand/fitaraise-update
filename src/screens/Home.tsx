/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';

import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  StyleSheet,
  // Text,
  View,
  SafeAreaView,
  Platform,
  // Image,
  TouchableOpacity
} from "react-native";

const Home = () => {
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
      console.log(tab);
      
    },
    [following, trending, setTab, setProducts],
  );

  return (
    <Block >
      {/* search input */}
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        {/* <Input search placeholder={t('common.search')} /> */}
      </Block>
     
      <Block
        row
        flex={0}
        align="center"
        justify="center"
        color={colors.card}
        paddingBottom={sizes.sm}>
        <Button onPress={() => handleProducts(0)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 0 ? 'primary' : 'secondary']}>
              <Image source={assets.extras} color={colors.white} radius={0} />
            </Block>
            <Text p font={fonts?.[tab === 0 ? 'medium' : 'normal']}>
              {t('home.following')}
            </Text>
          </Block>
        </Button>
        <Block
          gray
          flex={0}
          width={1}
          marginHorizontal={sizes.sm}
          height={sizes.socialIconSize}
        />
        <Button onPress={() => handleProducts(1)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
              <Image
                radius={0}
                color={colors.white}
                source={assets.documentation}
              />
            </Block>
            <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
              {t('home.trending')}
            </Text>
          </Block>
        </Button>
      </Block>
      {/* toggle products list */}
      {tab ? (
        <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.l}}>
        <Block 
        row 
        wrap="wrap" 
        justify="space-between" 
        marginTop={sizes.sm}
        >
          {/* {products?.map((product) => (
            <Product {...product} key={`card-${product?.id}`} />
          ))} */}
        </Block>
        <Block>
        <View style={styles.container1}>
        {/* <Text style={{ top: 20, padding: 16, fontSize: 15 }}>
          Welcome Vineeth,
        </Text> */}
        <View style={styles.img}>
          {/* <Image
          //  source={require('../../../assets/logo.png')}
            style={{ width: "40%", height: "45%" }}
          /> */}
          
        
        </View>
        <ExpoStatusBar style="auto" />
      </View>

      <View style={styles.container} >
      <TouchableOpacity
        
        onPress={() => navigation.navigate('Details')}
      >
        <View style={styles.mainCardView}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.subCardView} >
              <Image
              //  source={require('../../../assets/fruit2.png')}
              source={assets.fruit2}
                resizeMode="contain"
               
              />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "black",
                  fontWeight: "bold",

                  
                }}
              >
                {"DIET PLANS"}
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
          <View
            style={{
              height: 25,
              backgroundColor: "pink",
              borderWidth: 0,
              width: 25,
              marginLeft: -26,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
            }}
          >
            <Image source={assets.arrow} color={colors.white} radius={0} />
          </View>
        </View>
        </TouchableOpacity>
        <View style={styles.mainCardView}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.subCardView}>
              <Image
              // source={require('../../../assets/fitness2.png')}
              source={assets.fitness2}
                resizeMode="contain"
               
              />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "black",
                  fontWeight: "bold",

                  
                }}
              >
                {"FITNESS"}
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
          <View
            style={{
              height: 25,
              backgroundColor: "pink",
              borderWidth: 0,
              width: 25,
              marginLeft: -26,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
            }}
          >
            <Image source={assets.arrow} color={colors.white} radius={0} />
          </View>
        </View>
        <View style={styles.mainCardView}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.subCardView}>
              <Image
              //  source={require('../../../assets/book2.png')}
              source={assets.book2}
                resizeMode="contain"
               
              />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "black",
                  fontWeight: "bold",

                  
                }}
              >
                {"NUTRITION FACTS"}
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
          <View
            style={{
              height: 25,
              backgroundColor: "pink",
              borderWidth: 0,
              width: 25,
              marginLeft: -26,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
            }}
          >
            <Image source={assets.arrow} color={colors.white} radius={0} />
          </View>
        </View>
      </View>
      </Block>
      </Block>
      ):(
<Block>
  <Text>
    Sandeep
  </Text>
  </Block>

      )}
     

      {/* products list */}
      
    </Block>
  );
};
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
    padding: 20,
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
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffff",
    borderRadius: 15,
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
    height: 50,
    width: 50,
    borderRadius: 0,
    backgroundColor: "transparent",
    // borderColor: "green",
    // borderWidth: 1,
    // borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
