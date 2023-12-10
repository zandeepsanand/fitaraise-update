/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';

const AgeAndHeightPage = ({ navigation, route }) => {
  const { formData: updatedFormData } = route.params;
  const [formData, setFormData] = useState({ ...updatedFormData , age: '', height: { feet: '', inches: '' } });
  

  const handleAgeChange = (text) => {
    const updatedFormData = {
      ...formData,
      age: text
    };
    setFormData(updatedFormData);
    navigation.setParams({ formData: updatedFormData });
  };

  const handleHeightChange = (text) => {
    const updatedFormData = {
      ...formData,
      height: text
    };
    setFormData(updatedFormData);
    navigation.setParams({ formData: updatedFormData });
  };

  const handleSubmit = () => {
    navigation.navigate('goal', { formData : updatedFormData });
    // console.log(formData);
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter your age"
        value={formData.age}
        onChangeText={handleAgeChange}
      />

      <Text style={styles.label}>Height:</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput, styles.leftInput]}
          keyboardType="numeric"
          placeholder="Feet"
          value={formData.height?.feet}
          onChangeText={(text) => handleHeightChange({ ...formData.height, feet: text })}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          keyboardType="numeric"
          placeholder="Inches"
          value={formData.height?.inches}
          onChangeText={(text) => handleHeightChange({ ...formData.height, inches: text })}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    minWidth: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.45,
  },
  leftInput: {
    marginRight: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AgeAndHeightPage;
