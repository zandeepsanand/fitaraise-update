/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Alert, Animated, Linking, StyleSheet} from 'react-native';

import {
  useIsDrawerOpen,
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import Screens from './ChallengeScreens';

import {Block, Text, Switch, Button, Image} from '../../../components';
import {useData, useTheme, useTranslation} from '../../../hooks';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import LoginContext from '../../../hooks/LoginContext';
import { MealContext } from '../../../hooks/useMeal';
import ChallengeScreens from './ChallengeScreens';

const Drawer = createDrawerNavigator();

/* drawer menu screens navigation */
const ScreensStack = ({route}) => {
  const {workoutData, formDataCopy ,challenge} = route.params ?? {};
  useEffect(() => {
    // Update the screen content using the new parameters
    // console.log(data, 'Updated data drawer');

    // Additionally, you can perform any other necessary updates here
  }, [workoutData, formDataCopy,challenge ]);

  // console.log('ScreensStack Component - Data:', data);
  // console.log('ScreensStack Component - FormDataCopy:', formDataCopy);
  // console.log('ScreensStack Component - DietPlan:', dietPlan);

  const {colors} = useTheme();
  const isDrawerOpen = useIsDrawerOpen();
  const animation = useRef(new Animated.Value(0)).current;

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const animatedStyle = {
    borderRadius: borderRadius,
    transform: [{scale: scale}],
  };

  useEffect(() => {
    Animated.timing(animation, {
      duration: 200,
      useNativeDriver: true,
      toValue: isDrawerOpen ? 1 : 0,
    }).start();
  }, [isDrawerOpen, animation]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        animatedStyle,
        {
          flex: 1,
          overflow: 'hidden',
          borderColor: colors.card,
          borderWidth: isDrawerOpen ? 1 : 0,
        },
      ])}>
      {/*  */}
      <ChallengeScreens  formDataCopy={formDataCopy} challenge={challenge} workoutData={workoutData} />
      {/* <Firstpage /> */}
    </Animated.View>
    // <Firstpage />
  );
};

/* custom drawer menu */
const DrawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
) => {
  const {navigation, formDataCopy} = props;
  const {t} = useTranslation();
  const {isDark, handleIsDark} = useData(false);
  // console.log(isDark , "dark");
  
  const [active, setActive] = useState('Tab');
  const {assets, colors, gradients, sizes} = useTheme();
  const labelColor = colors.text;
  useEffect(() => {
    setActive('Tab'); // Set it to 'Tab' when the component mounts
  }, []); // The empty dependency array ensures this runs only once

  // Use the useFocusEffect hook to set the active screen when the menu screen receives focus
  useFocusEffect(
    useCallback(() => {
      setActive('Tab');
      navigation.navigate('Tab'); // Navigate to the 'Tab' screen when the menu screen receives focus
    }, [navigation]) // Include navigation in the dependency array
  );


  const handleNavigation = useCallback(
    (to) => {
      setActive(to);
      navigation.navigate(to);
    },
    [navigation, setActive],
  );

  const handleWebLink = useCallback((url) => Linking.openURL(url), []);

  const {
    customerId,
    isLoggedIn,
    token,
    logout, // You can access the logout function
  } = useContext(LoginContext);
  const {
    clearContextData,
  }=useContext(MealContext);

  const handleLogout = () => {
    // console.log('clicked');

    // Call the logout function to log the user out
    clearContextData();
    logout();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'loginNew' }],
      })
    );
  };

  const handleEditGoalPress = () => {
  
  };


  // screen list for Drawer menu
  const Challengescreens = [
    {name: 'Home', to: 'Tab', icon: assets.home},
    // {name: 'Main Menu', to: 'FrstPage', icon: assets.components},
    {
      name: 'Edit Goal',
      to: 'Demo',
      icon: assets.rental,
    },
    {name: 'Water Tracker', to: 'NotFoundPage', icon: assets.kcal},
    {name: 'Track Progress', to: 'NotFoundPage2', icon: assets.office},
    {name: 'Share App', to: 'NotFoundPage3', icon: assets.profile},
  ];

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled
      removeClippedSubviews
      renderToHardwareTextureAndroid
      contentContainerStyle={{paddingBottom: sizes.padding}} >
      <Block paddingHorizontal={sizes.padding} >
        <Block flex={0} row align="center" marginBottom={sizes.l}>
          <Image
            radius={0}
            width={33}
            height={40}
            color={colors.primary}
            source={require('../../../assets/icons/fitaraise.png')}
            marginRight={sizes.sm}
          />
          <Block>
            <Text size={12} semibold>
              Fitaraise
            </Text>
            <Text size={12} semibold>
              {formDataCopy.first_name} {formDataCopy.last_name}
            </Text>
          </Block>
        </Block>

        {Challengescreens?.map((screen, index) => {
          const isActive = active === screen.to;
          return (
            <Button
              row
              justify="flex-start"
              marginBottom={sizes.s}
              key={`menu-screen-${screen.name}-${index}`}
              onPress={() => handleNavigation(screen.to)}>
              <Block
                flex={0}
                radius={6}
                align="center"
                justify="center"
                width={sizes.md}
                height={sizes.md}
                marginRight={sizes.s}
                gradient={gradients[isActive ? 'primary' : 'white']}>
                <Image
                  radius={0}
                  width={14}
                  height={14}
                  source={screen.icon}
                  color={colors[isActive ? 'white' : 'black']}
                />
              </Block>
              <Text
                p
                bold={isActive}
                color={colors[isActive ? 'primary' : 'black']}>
                {screen.name}
              </Text>
            </Button>
          );
        })}

        <Block
          flex={0}
          height={1}
          marginRight={sizes.md}
          marginVertical={sizes.sm}
          gradient={gradients.menu}
        />

        <Text semibold transform="uppercase" opacity={0.5}>
          FITARAISE
        </Text>

        <Button
          //  color={colors.info}

          row
          justify="flex-start"
          marginTop={sizes.sm}
          marginBottom={sizes.s}
          onPress={() =>
            handleWebLink('https://github.com/creativetimofficial')

          }
          onPress={() => {
            handleLogout();
          }}
        >
          <Block
            flex={0}
            radius={6}
            align="center"
            justify="center"
            width={sizes.md}
            height={sizes.md}
            marginRight={sizes.s}
            gradient={gradients.white}>
            <Image
              radius={0}
              width={14}
              height={14}
              color={colors.black}
              source={require('../../../assets/icons/logout.png')}
            />
          </Block>
          <Text p color={labelColor} center>
            Logout
          </Text>
        </Button>

        <Block row justify="space-between" marginTop={sizes.sm}>
          <Text color={labelColor}>{t('darkMode')}</Text>
          <Switch
            checked={isDark}
            onPress={(checked) => {
              handleIsDark(checked);
              handleEditGoalPress();
              Alert.alert('Only availble in Pro Version');
            }}
          />
        </Block>
      </Block>
    </DrawerContentScrollView>
  );
};

/* drawer menu navigation */
export default function ChallengeMenu({route}) {
  const { workoutData, formDataCopy, challenge } = route.params || {};


  // Use useFocusEffect to update the screen when it gains focus
  useFocusEffect(
    React.useCallback(() => {
      // Update the screen content using the new parameters
      // For example, you can set the state or update the UI here
      // console.log(data, "Updated data");
    }, [workoutData, formDataCopy, challenge])
  );
  // console.log(data, 'menu drawer check');

  const {gradients} = useTheme();
  const navigation = useNavigation(); // Get the navigation object

  useEffect(() => {
    // Navigate to the "Screens" screen when the Menu component is first loaded
    // console.log(data , "updatess");
    
    navigation.navigate('ChallengeScreens', { workoutData, formDataCopy, challenge });
  }, []);

  return (
    <Block gradient={gradients.light}>
      <Drawer.Navigator
        drawerType="slide"
        overlayColor="transparent"
        sceneContainerStyle={{backgroundColor: 'transparent'}}
        drawerContent={(props) => (
          <DrawerContent {...props} formDataCopy={formDataCopy} />
        )}
        drawerStyle={{
          flex: 1,
          width: '60%',
          borderRightWidth: 0,
          backgroundColor: 'transparent',
        }}>
        <Drawer.Screen
          name="ChallengeScreens"
          component={ScreensStack}
          initialParams={{workoutData, formDataCopy, challenge}}
        />
      </Drawer.Navigator>
    </Block>
  );
}
