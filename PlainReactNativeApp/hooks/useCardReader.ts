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
  FaultsData,
  DriverActivityData,
  VehiclesUsed,
  Places,
  SpecificConditions,
  CurrentUsage,
  ControlActivityData,
} from '@/DriverCardFiles/files/DriverCardFiles';
import axiosInstance from '@/utils/axiosConfig';

const useCardReader = () => {
  let dddString = '';

  const sendCommand = async (command: number[]): Promise<number[]> => {
    try {
      const resp = await CardReader.sendAPDUCommand(command);
      // console.log(resp.slice(resp.length - 2));
      // if (resp[resp.length - 2] != 144 && resp[resp.length - 1] != 0) {
      //   console.log(command);
      //   throw Error('Invalid response');
      // }
      // console.log(resp, resp.slice(resp.length - 2));
      return resp.slice(0, -2);
    } catch (error) {
      throw Error(error);
    }
  };

  const headerFiles = [new Icc(sendCommand), new Ic(sendCommand)];

  const tachographFiles = [
    new ApplicationIdentification(sendCommand),
    new CardCertificate(sendCommand),
    new CaCertificate(sendCommand),
    new Identification(sendCommand),
    new CardDownload(sendCommand),
    new DrivingLicenceInfo(sendCommand),
    new CurrentUsage(sendCommand),
    new ControlActivityData(sendCommand),
    // new EventsData(sendCommand),
    // new FaultsData(sendCommand),
    // new DriverActivityData(sendCommand),
    // new VehiclesUsed(sendCommand),
    // new Places(sendCommand),
    // new SpecificConditions(sendCommand),
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

  const readCardData = async () => {
    for (let file of headerFiles) {
      await file.readData();
      console.log(file.decodedData);
      dddString += file.dddFormat;
    }

    await selectTachoApp();

    for (let file of tachographFiles) {
      await file.readData();
      console.log(file.decodedData);
      dddString += file.dddFormat;
    }
  };

  const sendDataToServer = async () => {
    try {
      // const response = await axiosInstance.post('/ddd/mobile/', {
      //   file: dddString,
      // });
      // console.log(response.data);
    } catch (err) {
      console.log(err.message);
      throw new Error(err);
    }
  };

  return {
    readCardData,
    sendDataToServer,
  };
};

export default useCardReader;
