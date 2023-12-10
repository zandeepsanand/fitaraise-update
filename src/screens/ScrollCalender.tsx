/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {AppRegistry, View, StyleSheet} from 'react-native';
import {BASE_URL} from '@env';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import Axios from 'axios';

export default function ScrollCalender({formDataCopy, onDateChange}) {
  const currentDate = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [newDate, setNewDate] = useState('');

  console.log('Original selectedDate:', currentDate);
  console.log(selectedDate , "no selection");
  const handleDateSelected = (selectedDate) => {
    // Convert the selectedDate to a JavaScript Date object
    const parsedDate = new Date(selectedDate);

    if (!isNaN(parsedDate)) {
      // Create a new Date object with only the year, month, and day
      const selectedDateWithoutTime = new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
      );
      // Format the selected date as "YYYY-MM-DD"
      const formattedDate =
        selectedDateWithoutTime.getFullYear() +
        '-' +
        String(selectedDateWithoutTime.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(selectedDateWithoutTime.getDate()).padStart(2, '0');
      // console.log("Selected Date Without Time (Formatted):", formattedDate);
      setNewDate(formattedDate);

 // Set the new date in the parent component (DietPlan) using the callback
 onDateChange(formattedDate);
    
 // Also, you can set responseData or any other data using the callback if needed
 onDateChange(formattedDate);
    //   try {
    //     Axios.get(
    //       `${BASE_URL}get_diet_list_wrt_date/${formDataCopy.customer_id}/${formattedDate}`,
    //     ).then((response) => {
    //       const responseData = response.data.data;
    //       // console.log(responseData , "hello");
    //     });
    //     // setError(null);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // } else {
    //   console.log('Invalid selectedDate:', selectedDate);
    }
    
  }
  ;
  
  return (
    <>
      <View style={styles.container}>
        <CalendarStrip
          scrollable
          style={{paddingTop: 10, paddingBottom: 30}}
          calendarHeaderStyle={{color: 'black', paddingBottom: 30}}
          dateNumberStyle={{color: 'black'}}
          dateNameStyle={{color: 'black'}}
          iconContainer={{flex:0.1}}
          highlightDateNumberStyle={styles.highlightedDateNumber}
          highlightDateNameStyle={styles.highlightedDateName}
          highlightDateContainerStyle={styles.select}
          selectedDate={new Date()}
          onDateSelected={handleDateSelected}
          // dayContainerStyle={{height:45}}
          // scrollerPaging={{height:10}}
          
      

         
        />
      </View>
      {/* {selectedDate === newDate  ? (
  <Text>Sandeep</Text>
) : (
  <Text>Sananana</Text>
)} */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  highlightedDateNumber: {
    color: 'white',
  },
  highlightedDateName: {
    color: 'white',
  },
  select: {
    backgroundColor: '#97b4fe',
    // margin:10,
    // height:100,
    borderRadius: 5,
    elevation: 15, // add elevation to create a shadow effect
    shadowColor: 'black', // set the color of the shadow
    shadowOffset: {width: 0, height: 15}, // set the offset of the shadow
    shadowOpacity: 0.2, // set the opacity of the shadow
    shadowRadius: 2, // set the radius of the shadow
    
    
    
  },
});
