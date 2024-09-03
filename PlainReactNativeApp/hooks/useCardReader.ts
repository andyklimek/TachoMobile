import {
  Ic,
  Icc,
  ApplicationIdentification,
  CardCertificate,
  CaCertificate,
  CardDownload,
  Identification,
  DrivingLicenceInfo,
  EventsData,
  CurrentUsage,
  ControlActivityData,
} from '@/DriverCardFiles/files/DriverCardFiles';
import useReaderIOS from '@/hooks/useReaderIOS';
import axiosInstance from '@/utils/axiosConfig';

const useCardReader = () => {
  const {sendCommand} = useReaderIOS();
  let dddString = '';

  const headerFiles = [new Icc(sendCommand), new Ic(sendCommand)];

  const tachographFiles = [
    // new ApplicationIdentification(sendCommand),
    // new CardCertificate(sendCommand),
    // new CaCertificate(sendCommand),
    // new Identification(sendCommand),
    // new CardDownload(sendCommand),
    // new DrivingLicenceInfo(sendCommand),
    // new CurrentUsage(sendCommand),
    // new ControlActivityData(sendCommand),
    new EventsData(sendCommand),
  ];

  const selectTachoApp = async () => {
    try {
      await sendCommand([
        0x00, 0xa4, 0x04, 0x0c, 0x06, 0xff, 0x54, 0x41, 0x43, 0x48, 0x4f,
      ]);
    } catch (err) {
      throw new Error(err);
    }
  };

  const readData = async () => {
    // for (let file of headerFiles) {
    //   await file.readData(sendCommand);
    //   dddString += file.dddFormat;
    // }

    await selectTachoApp();

    for (let file of tachographFiles) {
      await file.readData();
      dddString += file.dddFormat;
    }
  };

  const sendDataToServer = async () => {
    try {
      const response = await axiosInstance.post('/ddd/mobile/', {
        file: dddString,
      });
      console.log(response.data);
    } catch (err) {
      console.log(err.message);
      throw new Error(err);
    }
  };

  return {
    readData,
    sendDataToServer,
  };
};

export default useCardReader;
