import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import moment from 'moment-timezone';
import Date1 from './Date'; // Assuming you've imported Date1 correctly

const Calendar = ({ onSelectDate, selected }) => {
  const [dates, setDates] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0); // Added missing state
  const [currentMonth, setCurrentMonth] = useState();

  const getDates = () => {
    const _dates = [];
    for (let i = 29; i >= 0; i--) {
      const date = moment().subtract(i, 'days');
      if (!_dates.find(d => d.isSame(date, 'day'))) {
        _dates.push(date);
      }
    }
    for (let i = 0; i < 28; i++) {
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

  const findTodayIndex = () => {
    return dates.findIndex(date => moment(date).isSame(moment(), 'day'));
  };

  useEffect(() => {
    const todayIndex = findTodayIndex();
    const initialScrollPosition = todayIndex * 60;
    setScrollPosition(initialScrollPosition);
    updateMonth(todayIndex);
  }, [dates]);

  const updateMonth = (index) => {
    const month = moment(dates[index]).format('MMMM');
    setCurrentMonth(month);
  };

  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const centerIndex = Math.floor(scrollX / 60);
    setScrollPosition(scrollX);
    updateMonth(centerIndex);
  };

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
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentOffset={{ x: scrollPosition, y: 0 }}
          >
            {dates.map((date, index) => (
              <Date1
                key={index}
                date={date}
                onSelectDate={onSelectDate}
                selected={selected}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

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
