/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React , {useEffect , useRef }from 'react';
import { Block, Text } from '../components';
import {
    StyleSheet,
    Animated,
    View,
    SafeAreaView,
    Platform,
    // Image,
    TouchableOpacity,
    TouchableHighlight
  } from 'react-native';
import { Svg , G , Circle} from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';
import DuoToggleSwitch from "react-native-duo-toggle-switch";
import Ripple from 'react-native-material-ripple';

export default function ToggleSwitchButton() {
const size = 128;
const strokeWidth = 2;
const center = size / 2;
const radius = size / 2 - strokeWidth / 2;
const circumference = 2 * Math.PI * radius;
const progressAnimation = useRef(new Animated.Value(0)).current;

const progressRef = useRef (null) ;

const animation = (toValue) => {
    return Animated.timing(progressAnimation, {
    toValue,
    duration:250,
    useNativeDriver:true
    }).start();
};
  return (
   
    <Block>
       <Block  style={{
          shadowRadius: 8,
          shadowOpacity: 0.3,
          shadowColor: '#757575',
          shadowOffset: {
            width: 0,
            height: 3,
          },
        }}>
       <DuoToggleSwitch
  primaryText="Map"
  secondaryText="List"
  onPrimaryPress={() => {}}
  onSecondaryPress={() => {}}
/>
<DuoToggleSwitch
   primaryText="Customers"
   secondaryText="Employees"
   onPrimaryPress={() => {}}
   onSecondaryPress={() => {}}
   TouchableComponent={Ripple}
   primaryButtonStyle={{width: 150 , height:100}}
   secondaryButtonStyle={{width: 125, height:100}}
   primaryTextStyle={{marginRight: 32}}
   rippleColor="#fff"
   rippleContainerBorderRadius={50}
/>
      </Block>
         
 <Block style={styles.container2}>
    <Svg width={size} height={size}>
    <Circle stroke="#E6E7E8" cx={center} cy={center} r={radius} strokeWidth={strokeWidth}/>
  <Circle stroke="#F4338F" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} strokeDasharray={circumference}  strokeDashoffset={circumference - (circumference * 25 ) / 100}/>
  </Svg>
<TouchableOpacity style={styles.button} activeOpacity={0.6}>
    <AntDesign  name='arrowright' size={32} color="#fff" />
</TouchableOpacity>
 </Block>
    </Block>
  
  );
}
const styles = StyleSheet.create({

  
    container: {
      flex: 2,
      // flexDirection: "row", // set elements horizontally, try column.
      padding: 30,
      justifyContent:'center',
      alignContent:'center',
      alignSelf:'center'
    
    },
    container2:{
      flex:1,
      justifyContent:'center',alignItems:'center'
    
    }, 
    button:{
position:'absolute',
backgroundColor:'#f4338f',
borderRadius:100,
padding:20,
    }
  
 
  });