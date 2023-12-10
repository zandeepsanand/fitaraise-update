/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import ConfirmationDialog from './ConfirmationDialog'; // Import the ConfirmationDialog component
import { Block } from '../../components';

export default function DemoAlert({ route,navigation }) {
  const { formData } = route.params ?? {};
  console.log(formData ,"alert");
  

  const [isConfirmationVisible, setConfirmationVisible] = useState(true);

  const showConfirmationDialog = () => {
    setConfirmationVisible(true);
  };

  const handleConfirm = () => {
    // Handle your confirmation logic here
    // For example, perform navigation or any other action
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Success',
      textBody: 'Action confirmed!',
      // button: 'Close',
    });
    // navigation.replace('Details',{formData});
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Menu', params: { data: requiredCalorie, formDataCopy: authData.formData , dietPlan } }],
    // });
    navigation.reset({
      index: 0,
      routes: [{name: 'Details' , params: {formData}}],
    });

    // Close the confirmation dialog
    setConfirmationVisible(false);
  };

  const handleCancel = () => {
    // Handle cancellation logic here, if needed
    // For example, show a message
    // Toast.show({
    //   type: ALERT_TYPE.WARNING,
    //   title: 'Warning',
    //   textBody: 'Action canceled!',
    // });
   
    navigation.goBack();
    // Close the confirmation dialog
    setConfirmationVisible(false);
  };

  // useEffect(() => {
  //   // This code will be executed when the page loads and
  //   // isConfirmationVisible becomes true
  //   if (!isConfirmationVisible) {
  //     // You can add any actions you want to perform on page load here
  //     // For example, show an initial confirmation dialog
  //     Dialog.show({
  //       type: ALERT_TYPE.INFO,
  //       title: 'Welcome!',
  //       textBody: 'This is an initial confirmation dialog',
  //       button: 'OK',
  //     });
  //   }
  // }, [isConfirmationVisible]);

  return (
    <Block safe center marginTop={40}>
      <AlertNotificationRoot>
        <View>
          {/* <Button
            title={'Dialog Box'}
            onPress={() =>
              Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Congrats! This is a dialog box success',
                button: 'Close',
              })
            }
          /> */}

          {/* <Button title={'Show Confirmation'} onPress={showConfirmationDialog} /> */}

          {/* <Button
            title={'Toast Notification'}
            onPress={() =>
              Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Congrats! This is a toast notification success',
              })
            }
          /> */}
        </View>

        {/* Render the ConfirmationDialog component */}
        <ConfirmationDialog
          isVisible={isConfirmationVisible}
          message="Are you sure want to edit goal?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </AlertNotificationRoot>
    </Block>
  );
}
