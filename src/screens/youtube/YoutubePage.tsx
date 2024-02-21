/* eslint-disable prettier/prettier */
import React, { useState, useCallback, useRef } from "react";
import { Button, View, Alert } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Block } from "../../components";
import { useTheme } from "../../hooks";

export default function YoutubePage({workout}) {
    const youtubeId = workout.video_link;
    const {assets, colors, sizes} = useTheme();
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      // Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  return (
    <Block 
    
    flex={0}
    padding={sizes.sm}
    
    // margin={10}
    height={220}
    radius={30}
    >
      <YoutubePlayer
        height={350}
        play={playing}
        videoId={"9o0UPuDBM8M"}
        onChangeState={onStateChange}
      />
      {/* <Button title={playing ? "pause" : "play"} onPress={togglePlaying} /> */}
    </Block>
  );
}