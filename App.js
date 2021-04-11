import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, Button, View} from 'react-native';
import RNSoundLevel from 'react-native-sound-level';
import MQTT from 'sp-react-native-mqtt';

const App = () => {
  const [soundLevel, setSoundLevel] = useState(0);
  useEffect(() => {
    RNSoundLevel.start();
    MQTT.createClient({
      uri: 'mqtt://test.mosquitto.org:1883',
      clientId: '892198',
    })
      .then(function (client) {
        client.connect();
        var db = 0;
        setInterval(function () {
          RNSoundLevel.onNewFrame = data => {
            var peakAmplitude = data.rawValue;
            const REFERENCE = 0.00002;
            var pressure = peakAmplitude / 51805.5336;
            db = Math.floor(20 * Math.log10(pressure / REFERENCE));
            setSoundLevel(db);
          };

          client.publish(
            '/measure/db/AT',
            new Date().toString() + '*' + db.toString(),
            0,
            false,
          );
        }, 1000);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    return () => {
      RNSoundLevel.stop();
    };
  }, []);
  return (
    <View style={styles.mainView}>
      <Text style={styles.textStyle}>{soundLevel} dB</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  mainView: {
    justifyContent: 'space-between',
    alignContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 50,
  },
});

export default App;
