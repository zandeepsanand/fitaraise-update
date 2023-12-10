/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import moment from 'moment-timezone';
import Date1 from './Date'; // Assuming you've imported Date1 correctly
import { Block } from '../../components';

const Calendar = ({ onSelectDate, selected   }) => {
  const [dates, setDates] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentMonth, setCurrentMonth] = useState();
  const [newDate, setNewDate] = useState('');

  // get the dates from today to 10 days from now, format them as strings and store them in state
  const getDates = () => {
    const _dates = [];
    for (let i = 29; i >= 0; i--) {
      const date = moment().subtract(i, 'days');
      if (!_dates.find(d => d.isSame(date, 'day'))) {
        _dates.push(date);
      }
    }
    for (let i = 0; i < 10; i++) {
      const date = moment().add(i, 'days');
      if (!_dates.find(d => d.isSame(date, 'day'))) {
        _dates.push(date);
      }
    }
    setDates(_dates);
  };

  useEffect(() => {
    getDates();
  }, []);

  const getCurrentMonth = () => {
    const month = moment(dates[0]).add(scrollPosition / 60, 'days').format('MMMM');
    setCurrentMonth(month);
  };

  useEffect(() => {
    getCurrentMonth();
  }, [scrollPosition]);
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
