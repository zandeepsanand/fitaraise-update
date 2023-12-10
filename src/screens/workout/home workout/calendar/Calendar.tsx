/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import moment from 'moment-timezone';
import Date1 from './Date';

const CalendarHomeWorkout = ({onSelectDate, selected, savedDate = []}) => {
  const [dates, setDates] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentMonth, setCurrentMonth] = useState();
  const screenWidth = 60; // Width of each date item, adjust as needed
  const scrollRef = useRef<ScrollView | null>(null);

  moment.tz.setDefault('Asia/Kolkata');
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
    // Center on the current date when the component initially mounts
    if (scrollRef.current) {
      // Calculate the index of the current date
      const todayIndex = dates.findIndex((date) => {
        return moment(date).isSame(moment(), 'day');
      });

      // Scroll to the position that centers on the current date
      scrollRef.current.scrollTo({x:todayIndex * screenWidth, animated: true});
    }
  }, [dates]);

  const getCurrentMonth = () => {
    const centerIndex = Math.round(scrollPosition / screenWidth);
    const centerDate = dates[centerIndex];
    setCurrentMonth(moment(centerDate).format('MMMM YYYY'));
  };

  useEffect(() => {
    getCurrentMonth();
  }, [scrollPosition]);

  return (
    <View>
      <View style={styles.centered}>
        <Text style={styles.title}>{currentMonth}</Text>
      </View>
      <View style={styles.dateSection}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => setScrollPosition(e.nativeEvent.contentOffset.x)}
          scrollEventThrottle={16}>
          {dates.map((date, index) => (
            <Date1
              key={index}
              date={date}
              onSelectDate={onSelectDate}
              selected={selected}
              savedDate={savedDate}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

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
});

export default CalendarHomeWorkout;
