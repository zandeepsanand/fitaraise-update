/* eslint-disable prettier/prettier */
import React from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import Modal from 'react-native-modal';
import {Text, Block, Button} from '../../components';
import {colors} from '../../../app/res/colors';

const ConfirmationDialog = ({isVisible, message, onConfirm, onCancel}) => {
  return (
    <Modal isVisible={isVisible}>
      <Block card center height={170} flex={0}>
        <Block flex={1} center marginHorizontal={40} >
          <Text center bold h5>{message}</Text>
        </Block>
        <Block row center flex={0} height={50} marginHorizontal={40} marginBottom={10}>
          <TouchableWithoutFeedback onPress={onConfirm}>
            <Block card center marginHorizontal={10} flex={1}>
              <Text center primary bold>
                Yes
              </Text>
            </Block>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={onCancel}>
            <Block card center  flex={1}>
              <Text center bold secondary>No</Text>
            </Block>
          </TouchableWithoutFeedback>
        </Block>
      </Block>
    </Modal>
  );
};

export default ConfirmationDialog;
