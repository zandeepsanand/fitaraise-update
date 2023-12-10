import React, {useState} from 'react';
import {View} from 'react-native';
import {Block, Button, Image, Text} from '../../../components';
import {useTheme} from '../../../hooks';

const ChallengeDetailsPageTwo = ({workout}) => {
  const {assets, colors, sizes} = useTheme();

  const keyTips = JSON.parse(workout.key_tips);
  const excecutions = JSON.parse(workout.execution);
  // console.log(keyTips, 'image name');

  return (
    <>
      <Block card paddingHorizontal={sizes.sm} marginHorizontal={10} row>
        <Block row>
          <Block center>
            <Text h5 bold center>
              Focus Area
            </Text>
          </Block>
          <Block center>
            {workout.focus_area.map((exercise) => (
              <Block row paddingLeft={10} key={exercise.id} paddingTop={10}>
                <Text
                  center
                  bold
                  paddingTop={5}
                  size={sizes.m}
                  paddingRight={10}>
                  •
                </Text>
                <Text center semibold paddingTop={-2}>
                  {exercise.bodypart_name}
                </Text>
              </Block>
            ))}
          </Block>
        </Block>
      </Block>
      <Block
        card
        paddingHorizontal={30}
        marginHorizontal={10}
        marginTop={10}
        paddingTop={30}
        paddingBottom={30}>
        <Block style={{borderBottomColor: '#2FD872', borderBottomWidth: 2}}>
          <Text center h5 primary bold paddingBottom={10}>
            EXECUTION
          </Text>
        </Block>
        {excecutions.map((excecution, index) => (
          <Block>
            <Block row paddingTop={15}>
              <Text bold top={10}>
                {index + 1}.
              </Text>
              <Text bold top={10} paddingLeft={10}>
                {excecution}
              </Text>
            </Block>
          </Block>
        ))}
      </Block>
      <Block
        card
        paddingHorizontal={30}
        marginHorizontal={10}
        marginTop={10}
        paddingTop={30}
        paddingBottom={30}>
        <Block style={{borderBottomColor: '#95ADFE', borderBottomWidth: 2}}>
          <Text center h5 primary bold paddingBottom={10}>
            KEY TIPS
          </Text>
        </Block>
        {keyTips.map((tip, index) => (
          <Block>
            <Block row>
              <Text bold top={10} paddingBottom={10} paddingTop={10}>
                {index + 1}.
              </Text>
              <Text
                bold
                top={10}
                paddingLeft={10}
                paddingBottom={10}
                paddingTop={10}>
                {tip}
              </Text>
            </Block>
          </Block>
        ))}
      </Block>
    </>
  );
};

export default ChallengeDetailsPageTwo;
