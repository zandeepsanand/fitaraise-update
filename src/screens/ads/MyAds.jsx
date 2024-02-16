import React, { useEffect, useState } from 'react';
import { Button,View,Text } from 'react-native';


import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});


// No advert ready to show yet

const MyAds = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
          setLoaded(true);
        });
    
        // Start loading the interstitial straight away
        interstitial.load();
    
        // Unsubscribe from events on unmount
        return unsubscribe;
      }, []);
    
      // No advert ready to show yet
      if (!loaded) {
        return null;
      }
  return (
    <View style={{paddingTop:50}}>
      <Text >My Ads</Text>
      <Button
      title="Show Interstitial"
      onPress={() => {
        interstitial.show();
      }}
    />
    </View>
  );
};
export default MyAds;
