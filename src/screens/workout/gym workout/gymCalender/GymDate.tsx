/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import moment from 'moment-timezone';

const GymDate = ({
  date,
  //  onSelectDate,
  selected,
  savedDate = [],
}) => {
  const todayDate = moment().format('YYYY-MM-DD');
  const day = moment(date).format('DD-MM-YYYY'); // Using local time zone
  const dayText = moment(date).format('ddd'); // Using local time zone
  const isCompleted = savedDate.includes(day);
  const dayNumber = moment(date).format('D'); // Using local time zone
  const fullDate = moment(date).format('YYYY-MM-DD'); // Using local time zone

const isSelected = todayDate === fullDate;
  return (
    <TouchableOpacity
      // onPress={() => 
      //   onSelectDate(fullDate)
      // }
      style={[styles.card, isSelected  && { backgroundColor: "lightgreen" }]}
    >
      <Text style={[styles.big, selected === fullDate && { color: "#fff" }]}>{dayText}</Text>
      <View style={{ height: 5 }} />
      {isCompleted ? (
        <Image
          source={require('../../../../assets/icons/yes.png')}
          style={{width: 20, height: 20}}
        />
      ):(<Text></Text>)}
      <Text style={[styles.medium]}>{dayNumber}</Text>
      
    </TouchableOpacity>
  );
};

export default GymDate;

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
});
