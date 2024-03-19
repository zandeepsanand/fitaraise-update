/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, ScrollView,Dimensions} from 'react-native';
import moment from 'moment-timezone';
import Date1 from './GymDate';
import GymDate from './GymDate';

const  CalendarGym = ({
  // onSelectDate,
  //  selected,
    savedDate = [],
    navigation}) => {
  const [dates, setDates] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navigationTriggered, setNavigationTriggered] = useState(false); // State to track navigation
  console.log('====================================');
  console.log(scrollPosition);
  console.log('====================================');
  const [currentMonth, setCurrentMonth] = useState();
  const screenWidth = Dimensions.get('window').width / 6.29;
  // const screenWidth = 65.5; // Width of each date item, adjust as needed
  const scrollRef = useRef<ScrollView | null>(null);


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
    
      // Calculate the index of the current date
      const todayIndex = dates.findIndex((date) => {
        return moment(date).isSame(moment(), 'day');
      });

      // Scroll to the position that centers on the current date
      scrollRef.current.scrollTo({ x: todayIndex * screenWidth, animated: true });
      setNavigationTriggered(false); // Reset navigation trigger after centering
    
  }, [dates, screenWidth, navigationTriggered]); // Add screenWidth and navigationTriggered to dependencies

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Trigger navigation event
      setNavigationTriggered(true);
    });

    return unsubscribe;
  }, [navigation]);

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
              // onSelectDate={onSelectDate}
              // selected={selected}
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

export default  CalendarGym;


