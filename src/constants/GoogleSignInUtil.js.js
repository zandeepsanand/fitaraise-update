/* eslint-disable prettier/prettier */
// GoogleSignInUtil.js
import {
    GoogleSignin,
    statusCodes,
  } from "@react-native-google-signin/google-signin";
  
  export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        "999204942642-l0p47r1tmv23ced7k36rd1e0c0f3p2dt.apps.googleusercontent.com",
      androidClientId:
        "401912999040-lbmmhon7cf0en86lk8lcj03cs51fds7l.apps.googleusercontent.com",
      iosClientId:
        "999204942642-jfbbjt13l1s1jtv7m5n1cqtjuelluvr7.apps.googleusercontent.com",
    });
  };
  
  export const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      return userInfo;
    } catch (error) {
      throw error;
    }
  };
  
  export const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  