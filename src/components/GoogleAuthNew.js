/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { Platform, View, StyleSheet, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { configureGoogleSignIn, signIn as signInUtil, signOut } from "../constants/GoogleSignInUtil.js";
import { Text, Block, Button, Image, Input } from '../components';
import { useTheme } from "../hooks";

const isAndroid = Platform.OS === 'android';

export const GoogleAuthNew = ({ onUserLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [userInfo, setUserInfo] = useState();
  const { assets, colors, gradients, sizes } = useTheme();

  useEffect(() => {
    // Ensure that Google Sign-In is configured before component mounts
    configureGoogleSignIn();
  }, []);

  const signIn = async () => {
    console.log("Pressed sign in");
    setLoading(true);

    try {
      // Check if Google Sign-In is configured
      await configureGoogleSignIn();

      const userInfo = await signInUtil();
      setUserInfo(userInfo);
      setError();

      // Pass the user information to the parent component
      onUserLogin(userInfo);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUserInfo(undefined);
    signOut();
  };

  return (
    <View style={styles.container}>
   
      {userInfo ? (
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
            style={{ justifyContent: 'center', alignSelf: 'center' }}
            onPress={signIn}
          >
            {loading ? (
              <ActivityIndicator color={colors.icon} />
            ) : (
              <Block row padding={10} width={200}>
              <Image
                source={assets.google}
                height={sizes.m}
                width={sizes.m}
                // color={colors.icon}
              />
              <Block center>
              <Text bold center primary>Login with Google</Text>
              </Block>
              
              </Block>
            )}
          </Button>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
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
