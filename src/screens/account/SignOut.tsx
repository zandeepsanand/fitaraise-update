// SignOutPage.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../../components";
import { signOut } from "../../constants/GoogleSignInUtil.js";

const SignOutPage = ({route, navigation }) => {
    const {userInfo} = route.params ?? {};
    console.log('====================================');
    console.log(userInfo);
    console.log('====================================');
  const handleSignOut = () => {
    // Call the signOut function from GoogleSignInUtil
    signOut();
    // You can navigate back to the previous screen or navigate to another screen
    // This example assumes you are using React Navigation for navigation
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Are you sure you want to sign out?</Text>
      <Button onPress={handleSignOut}><Text>SignOut</Text></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SignOutPage;
