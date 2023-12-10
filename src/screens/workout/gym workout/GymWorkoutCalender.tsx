/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {AppRegistry, View, StyleSheet} from 'react-native';
import {BASE_URL} from '@env';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import Axios from 'axios';
import CustomDateCell from './MaqrkedDate';
import {Calendar, LocaleConfig} from 'react-native-calendars';
// Configure locale settings if needed (optional)
LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sep.',
    'Oct.',
    'Nov.',
    'Dec.',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
};

LocaleConfig.defaultLocale = 'en';

export default function GymWorkoutCalender({formDataCopy, onDateChange,savedDate=[] }) {
  const currentDate = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [newDate, setNewDate] = useState('');
  const [selected, setSelected] = useState('');
  const today = new Date();
  const fiveDaysFromToday = new Date(today);
  fiveDaysFromToday.setDate(today.getDate() + 5);
// const savedDate = ['2023-09-12']
  // console.log('Original selectedDate:', currentDate);
  // console.log(selectedDate, 'no selection');
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
  };
  const markedDates = [
    {date: '2023-09-04'}, // Date in YYYY-MM-DD format
    {date: '2023-09-13'},
    {date: '2023-09-20'},
    // Add more dates as needed
  ];
  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(3, 'days'), // total 4 days enabled
    },
  ];
  let datesBlacklist = [moment().add(1, 'days')];
  const markedDatesArray = [];
  const workoutFinishDates = savedDate.map((dateString) => {
    // Check if dateString is empty or null
    if (!dateString) {
      return null; // Return null for empty or invalid dates
    }
  
    const dateObject = new Date(dateString);
  
    // Check if the resulting Date object is valid
    if (isNaN(dateObject.getTime())) {
      return null; // Return null for invalid dates
    }
  
    return dateObject;
  });
  
  console.log(workoutFinishDates);
  // const workoutFinishDates = [
  //   new Date('2023-09-12'),
  //   new Date('2023-09-15'),
  //   // Add more workout finish dates here
  // ];

  const tickImageSource = '../../../assets/icons/arrow.png';
  // Iterate through the workout finish dates and add them to markedDatesArray
  workoutFinishDates.forEach((date) => {
    markedDatesArray.push({
      date: date.toISOString(), // Convert the Date object to ISO string format
      dots: [
        {
          color: 'transparent', // Set the dot color to transparent
          selectedColor: 'transparent', // Set the selected dot color to transparent
          // Use the tick (checkmark) image as the source
          badgeSource: tickImageSource,
        },
      ],
    });
  });

  // Now, markedDatesArray contains the marked workout finish dates
  console.log(markedDatesArray);

  return (
    <>
      {/* <Calendar
      style={{
        borderWidth: 1,
        borderColor: 'gray',
        height: 350
      }}
      // Specify the current date
      current={'2012-03-01'}
      // Callback that gets called when the user selects a day
      onDayPress={day => {
        console.log('selected day', day);
      }}
      // Mark specific dates as marked
      markedDates={{
        '2012-03-01': {selected: true, marked: true, selectedColor: 'blue'},
        '2012-03-02': {marked: true},
        '2012-03-03': {selected: true, marked: true, selectedColor: 'blue'}
      }}
    /> */}
      <CalendarStrip
        scrollable
        startingDate={new Date()}
        dayContainerStyle={styles.select2}
        calendarAnimation={{type: 'sequence', duration: 30}}
        daySelectionAnimation={{
          type: 'border',
          duration: 100,
          borderWidth: 0,
          // borderHighlightColor: '#feb506',
        }}
        style={{height: 130, paddingTop: 10, paddingBottom: 10}}
        calendarHeaderStyle={{color: 'black', paddingTop: 0, paddingBottom: 30}}
        calendarColor={'#FFFFFF'}
        dateNumberStyle={{color: 'black', marginTop: -6}}
        dateNameStyle={{color: 'black', marginTop: 15}}
        highlightDateNumberStyle={{color: 'black', marginTop: -6}}
        highlightDateNameStyle={{color: 'black', marginTop: 15}}
        iconContainer={{flex: 0.1}}
        numDaysInWeek={5}
        highlightDateContainerStyle={styles.select}
        selectedDate={new Date()}
        markedDatesStyle={{backgroundColor: 'green', marginTop: -5}}
        // iconLeft={require('../../../assets/icons/arrow.png')}
        iconStyle={{backgroundColor: 'white'}}
        markedDates={markedDatesArray}
        // innerStyle={{backgroundColor: 'green'}}
      />

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
    // lineHeight: 30,
  },
  highlightedDateName: {
    color: 'white',
    // lineHeight: 30,
    fontSize: 12,
    fontWeight: '800',
  },
  select: {
    backgroundColor: '#feb506',

    // margin: 10,
    height: 50,
    width: 50,
    borderRadius: 5,
    elevation: 15, // add elevation to create a shadow effect
    shadowColor: 'black', // set the color of the shadow
    shadowOffset: {width: 0, height: 5}, // set the offset of the shadow
    shadowOpacity: 0.2, // set the opacity of the shadow
    shadowRadius: 2, // set the radius of the shadow
    // gap: 10,
    // flexDirection: 'column',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    // padding:10
  },
  select2: {
    backgroundColor: '#F7F8F8',
    // margin: 10,
    height: 50,
    width: 50,
    borderRadius: 5,
    // elevation: 15, // add elevation to create a shadow effect
    // shadowColor: 'black', // set the color of the shadow
    shadowOffset: {width: 0, height: 5}, // set the offset of the shadow
    shadowOpacity: 0.2, // set the opacity of the shadow
    shadowRadius: 2, // set the radius of the shadow
    gap: 10,
    // flexDirection:'column',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});
