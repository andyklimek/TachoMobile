import React from 'react';
import {View, NativeModules} from 'react-native';
import Button from './components/Button/Button';
import AndroidUsbDevice from './interfaces/AndroidUsbDevice';

const App: React.FC = () => {
  const {Apdu} = NativeModules;

  const connect = async () => {
    try {
      const devices: AndroidUsbDevice[] = await Apdu.listUsbDevices();
      let deviceId;
      if (devices.length > 0) {
        deviceId = devices[0].deviceId;
      } else {
        return;
      }

      console.log(await Apdu.openDevice(deviceId));
    } catch (error) {
      console.log('ERROR');
      console.log(error);
    }
    await Apdu.closeDevice();
  };

  return (
    <>
      <View>
        <Button text="Connect" onPress={connect} />
      </View>
    </>
  );
};

export default App;
