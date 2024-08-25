import {
  Ic,
  Icc,
  ApplicationIdentification,
  CardCertificate,
  CaCertificate,
  CardDownload,
  Identification,
  DrivingLicenceInfo,
} from '@/DriverCardFiles/files/DriverCardFiles';
import useApduCommand from './useApduCommand';
import {useMemo} from 'react';
import {NativeModules} from 'react-native';

const useCardReader = () => {
  const apdu = useApduCommand();
  const {CardReader} = NativeModules;

  const headerFiles = useMemo(() => [new Ic(), new Icc()], []);
  const tachographFiles = useMemo(
    () => [
      new ApplicationIdentification(),
      new CardCertificate(),
      new CaCertificate(),
      new CardDownload(),
      new Identification(),
      new DrivingLicenceInfo(),
    ],
    [],
  );
  const files = [...headerFiles, ...tachographFiles];

  const readData = () => {
    for (let file of headerFiles) {
      file.readData();
    }

    CardReader.sendAPDUCommand(apdu.selectTachoAppCommand());

    for (let file of tachographFiles) {
      file.readData();
    }
  };

  const convertToDddFormat = () => {};

  const sendDataToServer = () => {};

  return {
    readData,
    convertToDddFormat,
    sendDataToServer,
  };
};
