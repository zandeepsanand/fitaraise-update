/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TouchableOpacity , Image } from 'react-native'
import moment from 'moment'

const Date1 = ({ date, onSelectDate, selected }) => {
  /**
   * use moment to compare the date to today
   * if today, show 'Today'
   * if not today, show day of the week e.g 'Mon', 'Tue', 'Wed'
   */
  const currentDate = moment().startOf('day'); // Get today's date
  const selectedDate = moment(date).startOf('day'); 
  const isAfterToday = selectedDate.isAfter(currentDate);
  const handlePress = () => {
    if (isAfterToday) {
      // Don't perform any action if the selected date is after today's date
      return;
    }
    onSelectDate(fullDate);
  };
  const day = moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 'Today' : moment(date).format('ddd')
  // get the day number e.g 1, 2, 3, 4, 5, 6, 7
  const dayNumber = moment(date).format('D')

  // get the full date e.g 2021-01-01 - we'll use this to compare the date to the selected date
  const fullDate = moment(date).format('YYYY-MM-DD')
  return (
    <TouchableOpacity
    onPress={handlePress}
      style={[styles.card, selected === fullDate && { backgroundColor: "#6146c6" }]}>
      <Text
        style={[styles.big, selected === fullDate && { color: "#fff" }]}
      >
        {day}
      </Text>
      <View style={{ height: 10 }} />
      <Text
        style={[
          styles.medium,
          selected === fullDate && { color: "#fff", fontWeight: 'bold', fontSize: 16 },
        ]}
      >
        {dayNumber}
      </Text>
    </TouchableOpacity>
  )
}


export default Date1

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eee',
    borderRadius: 10,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    height: 70,
    width: 65,
    marginHorizontal: 5,
  },
  big: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  medium: {
    fontSize: 12,
    fontWeight: 'bold',
    // paddingTop:10
  },
})