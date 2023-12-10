/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TouchableOpacity , Image } from 'react-native'
import moment from 'moment-timezone';

const Date1 = ({ date, onSelectDate, selected, savedDate = []   }) => {
  
  const day = moment.tz(date, 'Asia/Kolkata').format('DD-MM-YYYY');
  const dayText = moment.tz(date, 'Asia/Kolkata').format('ddd');
  const isCompleted = savedDate.includes(day);
  const dayNumber = moment.tz(date, 'Asia/Kolkata').format('D');
  const fullDate = moment.tz(date, 'Asia/Kolkata').format('YYYY-MM-DD');
  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      style={[styles.card, selected === fullDate && { backgroundColor: "#6146c6" }]}
    >
      <Text style={[styles.big, selected === fullDate && { color: "#fff" }]}>{dayText}</Text>
      <View style={{ height: 5 }} />
      {isCompleted && (
        <Image source={require('../../../../assets/icons/yes.png')} style={{ width: 20, height: 20 }} />
      )}
      <Text style={[styles.medium, selected === fullDate && { color: "#fff", fontWeight: 'bold', fontSize: 24 }]}>{dayNumber}</Text>
    </TouchableOpacity>
  );
}


export default Date1

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    height: 90,
    width: 58,
    marginHorizontal: 5,
  },
  big: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  medium: {
    fontSize: 14,
    fontWeight: 'bold',
    // paddingTop:10
  },
})