import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Button,
  View,
} from 'react-native';
import RNSoundLevel from 'react-native-sound-level';
import MQTT from 'sp-react-native-mqtt';
import {Buffer} from 'buffer';
global.Buffer = Buffer;

MQTT.createClient({
  uri: 'mqtt://test.mosquitto.org:1883',
  clientId: '892198',
})
  .then(function (client) {
    client.on('closed', function () {
      console.log('mqtt.event.closed');
    });

    client.on('error', function (msg) {
      console.log('mqtt.event.error', msg);
    });

    client.on('message', function (msg) {
      console.log('mqtt.event.message', msg);
    });

    client.on('connect', function () {
      console.log('connected');
      client.subscribe('/ANA_ARE', 0);
      client.publish('/ANA_ARE', 'mere', 0, false);
    });

    client.connect();
  })
  .catch(function (err) {
    console.log(err);
  });

const App = () => {
  const [soundLevel, setSoundLevel] = useState(0);
  useEffect(() => {
    RNSoundLevel.start();
    RNSoundLevel.onNewFrame = data => {
      var peakAmplitude = data.rawValue;
      const REFERENCE = 0.00002;
      var pressure = peakAmplitude / 51805.5336;
      var db = Math.floor(20 * Math.log10(pressure / REFERENCE));
      //console.log(db);
      setSoundLevel(db);
    };
  }, []);
  useEffect(() => {
    return () => {
      RNSoundLevel.stop();
    };
  }, []);
  return (
    <View style={styles.mainView}>
      <Text style={styles.textStyle}>{soundLevel} dB</Text>
      <Button title="CONNECT" />
      <Button title="Publish" />
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
