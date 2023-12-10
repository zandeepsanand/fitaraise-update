/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from "react";
import { Platform,View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { configureGoogleSignIn, signIn as signInUtil, signOut } from "../constants/GoogleSignInUtil.js";
import {Block,Button , Image, Input} from '../components';
import {useTheme} from "../hooks";
const isAndroid = Platform.OS === 'android';
export const GoogleAuthNew = () => {
  const [error, setError] = useState();
  const [userInfo, setUserInfo] = useState();
  const {assets, colors, gradients, sizes} = useTheme();

  useEffect(() => {
    // Ensure that Google Sign-In is configured before component mounts
    configureGoogleSignIn();
  }, []);

  const signIn = async () => {
    console.log("Pressed sign in");

    try {
      // Check if Google Sign-In is configured
      await configureGoogleSignIn();
      
      const userInfo = await signInUtil();
      setUserInfo(userInfo);
      console.log('====================================');
      console.log(userInfo);
      console.log('====================================');
      setError();
    } catch (e) {
      setError(e);
    }
  };

  const handleLogout = () => {
    setUserInfo(undefined);
    signOut();
  };

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(error)}</Text>
      {userInfo && <Text>{JSON.stringify(userInfo.user)}</Text>}
      {userInfo ? (

        // <Button title="Logout" onPress={handleLogout} />
        <Button
        outlined
        gray
        shadow={!isAndroid}
        onPress={handleLogout}
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Image
          source={assets.apple}
          height={sizes.m}
          width={sizes.m}
          color={colors.icon}
        />
      </Button>
      ) : (
      
        <View>
          <Button
          outlined
          gray
          shadow={!isAndroid}
          style={{justifyContent: 'center', alignSelf: 'center'}}
          onPress={signIn}
          >
          <Image
            source={assets.google}
            height={sizes.m}
            width={sizes.m}
            color={colors.icon}
          />
        </Button>

        </View>
      )}
      <StatusBar style="auto" />
    </View>
  //   <Button
  //   outlined
  //   gray
  //   shadow={!isAndroid}
  //   style={{justifyContent: 'center', alignSelf: 'center'}}
  //   onPress={signIn}
  //   >
  //   <Image
  //     source={assets.google}
  //     height={sizes.m}
  //     width={sizes.m}
  //     color={colors.icon}
  //   />
  // </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
