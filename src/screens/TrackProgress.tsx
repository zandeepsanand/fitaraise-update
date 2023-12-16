/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useState} from 'react';
import {Platform, Linking} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, Input, Text} from '../components/';
import {useData, useTheme, useTranslation} from '../hooks/';
import LoginContext from '../hooks/LoginContext';
import { TouchableOpacity } from 'react-native';
import DuoToggleSwitch from 'react-native-duo-toggle-switch';

const isAndroid = Platform.OS === 'android';

const TrackProgress = () => {
  const {
    customerId,
    isLoggedIn,
    token,
    logout, // You can access the logout function
  } = useContext(LoginContext);
  const [isKg, setIsKg] = useState(true);

  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();

  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  const handleSocialLink = useCallback(
    (type: 'twitter' | 'dribbble') => {
      const url =
        type === 'twitter'
          ? `https://twitter.com/${user?.social?.twitter}`
          : `https://dribbble.com/${user?.social?.dribbble}`;

      try {
        Linking.openURL(url);
      } catch (error) {
        alert(`Cannot open URL: ${url}`);
      }
    },
    [user],
  );
  const handleLogout = () => {
    console.log('clicked');

    // Call the logout function to log the user out
    logout();
    navigation.navigate('loginNew');
  };

  return (
    <Block safe marginTop={sizes.md}>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          {/* profile: stats */}
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={sizes.l}
            marginHorizontal="1%"
            color="rgba(255,255,255,0.2)">
            <Block
              row
              //   blur
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              //   tint={colors.blurTint}
              justify="space-evenly"
              paddingVertical={sizes.sm}
              renderToHardwareTextureAndroid>
              <Block align="center">
                <Text bold primary>
                  Today
                </Text>
                <Text>16-12-2023</Text>
              </Block>
              <Block align="center" paddingTop={10}>
                {/* <Text h5>{(user?.stats?.followers || 0) / 1000}k</Text> */}
                <Text bold color={'#34d18f'} center>
                  Log history
                </Text>
              </Block>
              <Block align="center"></Block>
            </Block>
          </Block>
          <Block
            row
            //   blur
            marginTop={-sizes.s}
            flex={0}
            //   intensity={100}
            radius={sizes.sm}
            overflow="hidden"
            //   tint={colors.blurTint}
            justify="space-evenly"
            paddingVertical={sizes.sm}
            renderToHardwareTextureAndroid>
            <Block align="center">{/* <Text  >16-12-2023</Text> */}</Block>
            <Block align="center" paddingTop={10}>
              {/* <Text h5>{(user?.stats?.followers || 0) / 1000}k</Text> */}
              {/* <Text bold primary center>Log history</Text> */}
            </Block>
            <Block align="center">
              <Button color={'#64d6ef'} padding={10} width={100}>
                <Text bold white>
                  Add
                </Text>
              </Button>
            </Block>
          </Block>
          {/* <Button onPress={handleLogout}> <Text>Logout</Text></Button> */}

          {/* profile: about me */}
          <Block flex={0}  marginHorizontal={20} card marginTop={10}>
            <Block row center>
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
                  source={require('../assets/icons/track.png')}></Image>
              </Block>
              <Block flex={1} paddingLeft={20} paddingTop={15}>
                <Block flex={0} center>
                  <Text p semibold>
                    85.85 kg
                  </Text>
                  <Text
                    semibold
                    secondary
                    opacity={0.5}
                    paddingTop={5}
                    size={12}>
                    16-12-2023
                  </Text>
                </Block>
              </Block>
              <Block flex={0} center paddingRight={10}>
                <TouchableOpacity>
                  <Image
                    // color={'green'}
                    width={8}
                    height={35}
                    source={require('../assets/icons/dot.png')}></Image>
                </TouchableOpacity>
              </Block>
            </Block>
          </Block>


          <Block
              row
              justify="space-between"
              marginBottom={sizes.base}
              marginTop={sizes.sm}>
              <Button
                flex={2}
                row
                onPress={() => setModalKg(true)}
                marginRight={sizes.base}>
                <Block row align="center" justify="space-between">
                  {/* <Text dark bold transform="uppercase" marginRight={sizes.sm}>
                {kg} Kg
              </Text> */}
              {isKg ? (
                 <Input
                 placeholder={'Kg'}
                 keyboardType="numeric"
                 maxLength={6}
                 value={inputValueKg}
                 style={{
                   height: 50,
                   width: 125,
                   flex: 1,
                   borderRadius: 10,
                   backgroundColor: 'white',
                   borderWidth: 0,
                 }}
                 onChangeText={handleInputChangeKg}
              
               />
              ):(
              
                  <Input
                  placeholder={'Lbs'}
                  keyboardType="numeric"
                  maxLength={6}
                  value={inputValueLbs}
                  style={{
                    height: 50,
                    width: 125,
                    flex: 1,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    borderWidth: 0,
                  }}
                  onChangeText={handleInputChangeLbs}
                
                />
              )}
                  
                </Block>
              </Button>
              <Block
                flex={4}
                style={{
                  alignItems: 'center',
                  shadowRadius: 8,
                  shadowOpacity: 0.3,
                  shadowColor: '#757575',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                }}>
                <DuoToggleSwitch
                  primaryText="Kg"
                  secondaryText="Lbs"
                  onPrimaryPress={handlePrimaryPress}
                  onSecondaryPress={handleSecondaryPress}
                  TouchableComponent={Ripple}
                  primaryButtonStyle={{width: 125, height: 50}}
                  secondaryButtonStyle={{width: 90, height: 50}}
                  primaryTextStyle={{marginRight: 32}}
                  rippleColor="#fff"
                  rippleContainerBorderRadius={50}
                  activeColor="#5f9b4c"
                />
              </Block>
              {/* <Button flex={2} gradient={gradients.dark} marginHorizontal={sizes.s}>
            <Text white bold  marginHorizontal={sizes.s}>
              Kg
            </Text>
          </Button>
          <Button flex={2} gradient={gradients.dark}>
            <Text white bold  marginHorizontal={sizes.sm}>
              Lbs
            </Text>
          </Button> */}
            </Block>
 
    
        </Block>
      </Block>
    </Block>
  );
};

export default TrackProgress;
