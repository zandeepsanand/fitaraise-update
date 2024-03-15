import {registerRootComponent} from 'expo';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {useNavigation} from '@react-navigation/native';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  
  console.log('Message handled in the background!', remoteMessage.data);
  // const navigation = useNavigation();

  // Assuming you have a key 'screenToNavigate' in your notification data
  // const screenToNavigate = remoteMessage.data;

  // // Navigate to the loading screen when a notification is clicked
  // if (screenToNavigate) {
  //   navigation.navigate('FirstPageCountrySelect');
  // }
});
messaging().getInitialNotification(async remoteMessage=>{
  console.log('Message handled after closed app!', remoteMessage);
});
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
