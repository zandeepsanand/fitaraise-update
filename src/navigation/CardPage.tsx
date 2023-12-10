/* eslint-disable prettier/prettier */
import {center} from '@shopify/react-native-skia';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Block, Text, Image} from '../components';
import {useTheme} from '../hooks';

const Cards = () => {
  const {assets, colors, gradients, sizes, fonts} = useTheme();
  const [isFullBlock, setIsFullBlock] = useState(false);

  const handleViewToggle = () => {
    setIsFullBlock(!isFullBlock);
  };

  return (
    <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Cards
      </Text>
      {/* single card */}
      <Block paddingBottom={sizes.m}>
        <Block card flex={1} marginBottom={sizes.m}>
          <Text p bold color={'green'} align="center" paddingTop={sizes.m}>
            Nutriotion Details
          </Text>
          <Block
            row
            flex={0}
            align="center"
            justify="center"
            marginBottom={sizes.sm}
            paddingHorizontal={sizes.xxl}
            paddingTop={sizes.s}>
            <Block
              flex={0}
              height={1}
              width="30%"
              align="center"
              center
              gradient={gradients.primary}
            />
          </Block>

          <Block row>
            <Block
              paddingTop={sizes.sm}
              marginRight={sizes.s}
              card
              radius={15}
              style={{
                height: 60,
                opacity: 0.8,
                backgroundColor: 'green',
                shadowColor: 'green',
              }}>
              <Block row>
                <Block align="center">
                  <Text bold>Protien : </Text>
                </Block>
              </Block>
              <Block></Block>
            </Block>
            <Block card radius={46} paddingTop={sizes.sm} style={{height: 60}}>
              <Block row>
                <Block align="center">
                  <Text bold>Protien : </Text>
                </Block>
              </Block>
              <Block></Block>
            </Block>
          </Block>
          <Block row>
            <Block
              paddingTop={sizes.sm}
              marginRight={sizes.s}
              card
              radius={46}
              style={{height: 60, opacity: 0.8, backgroundColor: 'green'}}>
              <Block row>
                <Block align="center">
                  <Text bold>Carbs: </Text>
                </Block>
              </Block>
              <Block></Block>
            </Block>
            <Block card radius={15} paddingTop={sizes.sm} style={{height: 60}}>
              <Block row>
                <Block align="center">
                  <Text bold>Fat : </Text>
                </Block>
              </Block>
              <Block></Block>
            </Block>
          </Block>
        </Block>
      </Block>
      {/* inline cards */}
      <Block flex={2}>
        {isFullBlock ? (
          <Block
            card
            row
            flex={2}
            padding={sizes.s}
            paddingTop={sizes.m}
            marginBottom={sizes.m}>
            <Block>
              <Text p bold center color={'green'} paddingBottom={sizes.s}>
                Nutriotion
              </Text>
              <Block style={styles.container}>
                {/* Header */}
                <Block style={styles.row} flex={0}>
                  <Text style={styles.header}>Column 1</Text>
                  <Text style={styles.header}>Column 2</Text>
                  <Text style={styles.header}>Column 3</Text>
                  <Text style={styles.header}>Column 3</Text>
                </Block>

                {/* Data Rows */}
                <Block center style={styles.row} flex={0}>
                  <Text style={styles.data}>Data 1</Text>
                  <Text style={styles.data}>Data 2</Text>
                  <Text style={styles.data}>Data 3</Text>
                  <Text style={styles.data}>Data 3</Text>
                </Block>
                <Block style={styles.row} flex={0}>
                  <Text style={styles.data}>Data 4</Text>
                  <Text style={styles.data}>Data 5</Text>
                  <Text style={styles.data}>Data 6</Text>
                  <Text style={styles.data}>Data 3</Text>
                </Block>
                <Block row flex={0}>
                  <Text style={styles.data}>Data 7</Text>
                  <Text style={styles.data}>Data 8</Text>
                  <Text style={styles.data}>Data 9</Text>
                  <Text style={styles.data}>Data 3</Text>
                </Block>
              </Block>
            </Block>
          </Block>
        ) : (
          <Block
            flex={2}
            card
            marginBottom={sizes.m}
            center
            style={{
              backgroundColor: 'yellow',
              opacity: 0.8,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}>
            <TouchableOpacity onPress={handleViewToggle}>
              <Block row></Block>
              <Text center bold h5 color={'green'}>
                Click to get full Nutrition details{' '}
              </Text>
            </TouchableOpacity>
          </Block>
        )}
      </Block>
    </Block>
  );
};

export default function CardPage() {
  return (
    <>
      <Cards />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
  },
  data: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
  subCardView: {
    height: 20,
    width: 50,
    borderRadius: 0,
    backgroundColor: 'transparent',
    // borderColor: "green",
    // borderWidth: 1,
    // borderStyle: "solid",
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCardView: {
    // top:70,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27f29c',
    borderRadius: 35,
    opacity: 0.8,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    // flexDirection: 'row',

    paddingLeft: 16,
    paddingRight: 14,
    // marginTop: 5,
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 16,
  },
});
