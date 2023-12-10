import React, {Component} from 'react';
import {View, Button} from 'react-native';
import Gif from 'react-native-gif';

class GifPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: true, // Initially playing
    };
  }

  toggleGif = () => {
    this.setState((prevState) => ({isPlaying: !prevState.isPlaying}));
  };

  render() {
    return (
      <View>
        <Gif
          source={{uri: '../../assets/images/gif.gif'}} // Replace with the path to your GIF
          style={{width: 200, height: 200}}
          paused={!this.state.isPlaying} // Pause or resume based on state
        />
        <Button
          title={this.state.isPlaying ? 'Pause' : 'Resume'}
          onPress={this.toggleGif}
        />
      </View>
    );
  }
}

export default GifPlayer;
