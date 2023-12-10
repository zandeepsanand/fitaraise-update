import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const CustomDateCell = ({date, marked}) => {
  return (
    <View style={styles.dateCell}>
      <Text style={[styles.dateText, marked && styles.markedDateText]}>
        {date.getDate()}
      </Text>
      {marked && (
        <Image
          source={require('../../../assets/icons/arrow.png')}
          style={styles.checkmarkImage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateCell: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: 'black',
  },
  markedDateText: {
    fontWeight: 'bold',
  },
  checkmarkImage: {
    width: 20,
    height: 20,
    marginTop: 5,
  },
});

export default CustomDateCell;
