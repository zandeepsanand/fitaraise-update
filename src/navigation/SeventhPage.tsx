/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useLayoutEffect, useState} from 'react';
import {FlatList, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {RadioButton} from 'react-native-paper';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';
import {
  // Text,
  View,
  SafeAreaView,
  Platform,
  // Image,
} from 'react-native';

import {useTheme} from '../hooks/';
import {Block, Button, Input, Image, Switch, Modal, Text} from '../components/';

import Svg, {Circle, Rect} from 'react-native-svg';
import {PieChart} from 'react-native-gifted-charts';

export default function SeventhPage() {
  const {assets,fonts ,  sizes,gradients,  colors} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [showModal, setModal] = useState(false);
  const [quantity, setQuantity] = useState('01');
  const [checked, setChecked] = React.useState('');
  const pieData = [
    {
      value: 47,
      color: '#009FFF',
      gradientCenterColor: '#006DFF',
      focused: true,
    },
    {value: 40, color: '#93FCF8', gradientCenterColor: '#3BE9DE'},
    {value: 16, color: '#BDB2FA', gradientCenterColor: '#8F80F3'},
    {value: 3, color: '#FFA5BA', gradientCenterColor: '#FF7F97'},
  ];

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
  const renderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };
  const renderLegendComponent = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot('#006DFF')}
            <Text p  color={colors.white}>Excellent: 47%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
            {renderDot('#8F80F3')}
            <Text p  color={colors.white}>Okay: 16%</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot('#3BE9DE')}
            <Text p  color={colors.white}>Good: 40%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
            {renderDot('#FF7F97')}
            <Text p  color={colors.white}>Poor: 3%</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <Block paddingHorizontal={sizes.padding}>
          <Block marginTop={sizes.m}>
            <Block>
              <View
                style={{
                  // paddingVertical: 100,
                  backgroundColor: '#34448B',
                  borderRadius: 20,
                  flex: 1,
                }}>
                <View
                  style={{
                    margin: 20,
                    padding: 16,
                    borderRadius: 20,
                    backgroundColor: '#232B5D',
                  }}>
                  <Text
                    p semibold color={colors.white}
                    
                    >
                    Performance
                  </Text>
                  <View style={{padding: 20, alignItems: 'center'}}>
                    <PieChart
                      data={pieData}
                      donut
                      showGradient
                      sectionAutoFocus
                      radius={90}
                      innerRadius={60}
                      innerCircleColor={'#232B5D'}
                      centerLabelComponent={() => {
                        return (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                            p semibold color={colors.white}
                              >
                             2000
                            </Text>
                            <Text  p bold color={colors.white}>
                              KCAL
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </View>
                  {renderLegendComponent()}
                </View>
              </View>

              <Block row justify="center" marginTop={sizes.sm}>
                <Text h5>Daily recommended nutrtional values</Text>
              </Block>
            </Block>

            <Block marginTop={sizes.sm}></Block>
          </Block>
          <TouchableOpacity

             onPress={() => navigation.navigate('pie')}
          >
            <Block row justify="flex-end" bottom={1}>
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
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 16,
    marginTop: 16,
  },
});
