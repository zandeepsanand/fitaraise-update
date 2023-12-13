/* eslint-disable prettier/prettier */
// GoogleSignInUtil.js
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      '401912999040-8dksjba2jfpu6omjtq06idttjed4rvg5.apps.googleusercontent.com',
    iosClientId:
      '401912999040-96e6gf7oqull1hsh42qpejspci8noe7v.apps.googleusercontent.com',
    androidClientId:
      '401912999040-e31t2mifoqtotghigj541gjshq52qmat.apps.googleusercontent.com',
  });
};
 // androidClientId: eas build
    //   "401912999040-pgs6g9dgq8s77mv14qei0bk19li17lu3.apps.googleusercontent.com",

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
    await configureGoogleSignIn();
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
