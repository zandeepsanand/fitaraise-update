/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView ,Dimensions} from 'react-native';
import moment from 'moment-timezone';
import Date1 from './Date'; // Assuming you've imported Date1 correctly
import { Block } from '../../components';

const Calendar = ({ onSelectDate, selected   }) => {
  const [dates, setDates] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentMonth, setCurrentMonth] = useState();
  const [newDate, setNewDate] = useState('');
  const [navigationTriggered, setNavigationTriggered] = useState(false); // State to track navigation
  const scrollRef = useRef<ScrollView | null>(null);
  console.log('====================================');
  console.log(scrollPosition);
  console.log('====================================');
  const screenWidth = Dimensions.get('window').width / 1;
  console.log('====================================');
  console.log(screenWidth);
  console.log('====================================');
  // get the dates from today to 10 days from now, format them as strings and store them in state
  const getDates = () => {
    const _dates = [];
    const today = moment();
    // Calculate 60 days before and 60 days forward
    for (let i = -60; i <= 60; i++) {
      const date = moment(today).add(i, 'days');
      _dates.push(date);
    }
    setDates(_dates);
  };

  useEffect(() => {
    getDates();
  }, []);
  useEffect(() => {
    // Center on the current date when the component initially mounts or navigation occurs
    if (scrollRef.current && dates.length > 0 && navigationTriggered) {
      // Calculate the index of the current date
      const todayIndex = dates.findIndex((date) => {
        return moment(date).isSame(moment(), 'day');
      });

      // Scroll to the position that centers on the current date
      scrollRef.current.scrollTo({ x: todayIndex * screenWidth, animated: true });
      setNavigationTriggered(false); // Reset navigation trigger after centering
    }
  }, [dates, screenWidth, navigationTriggered]);
  const getCurrentMonth = () => {
    const centerIndex = Math.round(scrollPosition / screenWidth);
    const centerDate = dates[centerIndex];
    setCurrentMonth(moment(centerDate).format('MMMM YYYY'));
  };

  useEffect(() => {
    getCurrentMonth();
  }, []);
  
  useEffect(() => {
    // Find the index of today's date in the dates array
    const todayIndex = dates.findIndex((d) => moment(d).isSame(moment(), 'day'));
  
    // Calculate the initial scroll position to center today's date
    const initialScrollPosition = todayIndex * 60 - (dates.length / 2) * 60;
  
    // Set the initial scroll position
    setScrollPosition(initialScrollPosition);
  }, [dates]);
 
  return (
    <>
      <View style={styles.centered}>
        <Text style={styles.title}>{currentMonth}</Text>
      </View>
      <View style={styles.dateSection}>
        <View style={styles.scroll}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // onScroll is a native event that returns the number of pixels the user has scrolled
            onScroll={(e) => setScrollPosition(e.nativeEvent.contentOffset.x)}
            scrollEventThrottle={16}
          >
            {dates.map((date, index) => (
              <Date1
                key={index}
                date={date}
                onSelectDate={onSelectDate}
                // onSelectDate={handleDateSelection} 
                selected={selected}
                
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  )
}

export default Calendar;

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateSection: {
    width: '100%',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  scroll: {
    height: 100,
  },
});
