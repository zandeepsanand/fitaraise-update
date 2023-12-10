/* eslint-disable prettier/prettier */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {BASE_URL} from '@env';
import {Linking, Platform, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox} from '../../components';
import {TextInput} from 'react-native-paper';

import LoginContext from '../../hooks/LoginContext';

const isAndroid = Platform.OS === 'android';

const PhoneNumber = ({
 
}) => {
  const {loginSuccess} = useContext(LoginContext);

  return (
  <Block safe marginTop={10}>
    <Block >
        <Text h5 bold>Verify your
phone number</Text>
    </Block>

  </Block>);
};
const styles = StyleSheet.create({


});

export default PhoneNumber;
