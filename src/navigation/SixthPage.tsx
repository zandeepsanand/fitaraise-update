/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useLayoutEffect, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import { RadioButton } from 'react-native-paper';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks/';
import {Block, Button, Input, Image, Switch, Modal, Text} from '../components/';


export default function SixthPage() {
    const {assets, sizes} = useTheme();
    const navigation = useNavigation();
    const headerHeight = useHeaderHeight();
    const [showModal, setModal] = useState(false);
  const [quantity, setQuantity] = useState('01');
  const [checked, setChecked] = React.useState('');
  
    useLayoutEffect(() => {
      navigation.setOptions({
        headerBackground: () => (
          <Image
            radius={0}
            resizeMode="cover"
            width={sizes.width}
            height={headerHeight}
            source={assets.header3}
          />
        ),
      });
    }, [assets.header3, navigation, sizes.width, headerHeight]);
  return (
    <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <Block paddingHorizontal={sizes.padding}>
        <Block marginTop={sizes.m}>
        <Text h4>What is your weekly goal</Text>

        <Block marginTop={sizes.sm}>
        <Block row justify="space-between" marginBottom={sizes.base} >
  <Block flex={0}>
  <RadioButton
        value="first"
        status={ checked === 'first' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('first')}
      />
  </Block>

      <Block flex={1} >
      <Text p semibold marginTop={sizes.s}>Gain 0.25 kg per week</Text>
      

      </Block>


</Block>
<Block row justify="space-between" marginBottom={sizes.base} >
  <Block flex={0}>
  <RadioButton
        value="second"
        status={ checked === 'second' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('second')}
      />
  </Block>

      <Block flex={1} >
      <Text p semibold marginTop={sizes.s}>Gain 0.5 kg per week</Text>
      <Text p  marginTop={sizes.s}>(Recommended)</Text>
      

      </Block>


</Block>

<Block row justify="space-between" marginBottom={sizes.base} >
  <Block flex={0}>
  <RadioButton
        value="third"
        status={ checked === 'third' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('third')}
      />
  </Block>

      <Block flex={1} >
      <Text p semibold marginTop={sizes.s}>Gain 0.75 kg per week</Text>
      

      </Block>
</Block>
<Block row justify="space-between" marginBottom={sizes.base} >
  <Block flex={0}>
  <RadioButton
        value="fourth"
        status={ checked === 'fourth' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('fourth')}
      />
  </Block>

      <Block flex={1} >
      <Text p semibold marginTop={sizes.s}>Gain 1 kg per week</Text>
      

      </Block>


</Block>
        </Block>
       
        </Block>
        <TouchableOpacity 
   
   onPress={() => navigation.navigate('pie')}
 >
      <Block row justify='flex-end' bottom={1}
      >
      <Image
                source={assets.Button}
                // color={colors.white}
                // transform={[{rotate: '90deg'}]}
              />
      </Block>
      </TouchableOpacity>
        </Block>
      </Block>
    </Block>
  )
}
