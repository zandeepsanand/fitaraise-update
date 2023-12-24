/* eslint-disable prettier/prettier */
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
let navigation; // Define a variable to store the navigation object

export const setNavigationReference = (nav) => {
  navigation = nav; // Set the navigation reference
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export const onMessageReceived = (callback) => {
 
  return messaging().onMessage(async (remoteMessage) => {
    // Extract data from the message
    const {title, body, action_url: actionUrl} = remoteMessage.data;

    // Display the notification
    // (You may use a library like react-native-push-notification to handle this part)
    // ...

    // Handle the action URL
    if (actionUrl) {
      // Open the action URL in your app
      // You can use a library like react-navigation to navigate to a specific screen in your app
      // or use Linking.openURL to open a web URL
      // Example using react-navigation:
      navigation.navigate('NotificationPage', { actionUrl });
      // Example using Linking:
      // Linking.openURL(actionUrl);
    }

    // Invoke the user-provided callback, if any
    if (callback) {
      callback(remoteMessage);
    }
  });
};
