/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import ConfirmationDialog from './ConfirmationDialog'; // Import the ConfirmationDialog component
import { Block } from '../../components';

export default function AlertCustom({ route }) {
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  const showConfirmationDialog = () => {
    setConfirmationVisible(true);
  };

  const handleConfirm = () => {
    // Handle your confirmation logic here
    // For example, perform navigation or any other action
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Success',
      textBody: 'Action confirmed!',
      button: 'Close',
    });

    // Close the confirmation dialog
    setConfirmationVisible(false);
  };

  const handleCancel = () => {
    // Handle cancellation logic here, if needed
    // For example, show a message
    Toast.show({
      type: ALERT_TYPE.WARNING,
      title: 'Warning',
      textBody: 'Action canceled!',
    });

    // Close the confirmation dialog
    setConfirmationVisible(false);
  };

  return (
    <Block safe center marginTop={40}>
        {/* <Block></Block> */}
 <AlertNotificationRoot>
      <View>
        <Button
          title={'Dialog Box'}
          onPress={() =>
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'Success',
              textBody: 'Congrats! This is a dialog box success',
              button: 'Close',
            })
          }
        />

        <Button title={'Show Confirmation'} onPress={showConfirmationDialog} />

        <Button
          title={'Toast Notification'}
          onPress={() =>
            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'Success',
              textBody: 'Congrats! This is a toast notification success',
            })
          }
        />
      </View>

      {/* Render the ConfirmationDialog component */}
      <ConfirmationDialog
        isVisible={isConfirmationVisible}
        message="Are you sure you want to perform this action?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </AlertNotificationRoot>
    </Block>
   
  );
}
