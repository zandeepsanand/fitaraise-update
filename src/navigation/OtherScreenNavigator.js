// OtherStackNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreenNew from './LoginPageNew';

const Stack = createStackNavigator();

const OtherStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="login" component={LoginScreenNew} />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};

export default OtherStackNavigator;
