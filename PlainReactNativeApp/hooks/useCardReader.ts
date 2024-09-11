import {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import {NativeModules} from 'react-native';
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
  const [connection, setConnection] = useState('');
  const [lastRead, setLastRead] = useState(null);
  const [lastReadLoading, setLastReadLoading] = useState(false);

  const {CardReader} = NativeModules;

  useEffect(() => {
    const establishReaderContext = async () => {
      try {
        if (Platform.OS === 'ios') {
          await CardReader.establishContext();
        } else {
          await CardReader.connectToUsbReader();
        }
      } catch (error) {
        throw Error(error);
      }
    };

    getLastRead();
    establishReaderContext();
  }, []);

  const getLastRead = async () => {
    try {
      setLastReadLoading(true);
      const resp = await axiosInstance.get('/ddd/last-read/');
      setLastRead(resp.data.last_read);
    } catch (error) {
      setLastRead(null);
      throw Error(error);
    } finally {
      setLastReadLoading(false);
    }
  };

  const connectReader = async () => {
    try {
      let readerResp;
      if (Platform.OS === 'ios') {
        const deviceList = await CardReader.getDeviceListPromise();
        readerResp = await CardReader.connectReader(deviceList[0]);
      } else {
        readerResp = await CardReader.connectToUsbReader();
      }
      setConnection(readerResp);
    } catch (error) {
      throw Error(error);
    }
  };

  const sendCommand = async (command: number[]): Promise<number[]> => {
    try {
      const resp = await CardReader.sendAPDUCommand(command);
      if (resp[resp.length - 2] !== 144 || resp[resp.length - 1] !== 0) {
        throw Error('Invalid response');
      }
      return resp.slice(0, -2);
    } catch (error) {
      throw Error(error);
    }
  };

  let dddString = '';
  const dataForPostRequest = {
    body: {},
  };

  const dataForDriverCardPostRequest = {};

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
    new EventsData(sendCommand),
    new FaultsData(sendCommand),
    new DriverActivityData(sendCommand),
    new VehiclesUsed(sendCommand),
    new Places(sendCommand),
    new SpecificConditions(sendCommand),
  ];

  const filesForReport = [
    'events_data',
    'faults_data',
    'specific_conditions',
    'vehicles_used',
    'places',
    'driver_activity_data',
    'card_download',
  ];

  const filesForDriverCard = [
    'icc',
    'ic',
    'application_identification',
    'card_certificate',
    'ca_certificate',
    'identification',
    'driving_licence_info',
  ];

  const transformData = (input: any): any => {
    return {
      icc_file: {
        clock_stop: input.icc.clock_stop,
        card_extended_serial_number:
          input.icc.card_extended_serial_number.toUpperCase(),
        card_approval_number: input.icc.card_approval_number.toUpperCase(),
        card_approval_number_interpreted:
          input.icc.card_approval_number_interpreted,
        ic_identifier: input.icc.ic_identifier,
        card_personalizer_id: input.icc.card_personalizer_id.toUpperCase(),
        embedder_ic_assembler_id:
          input.icc.embedder_ic_assembler_id.toUpperCase(),
      },
      ic_file: {
        ic_serial_number: input.ic.ic_serial_number.toUpperCase(),
        ic_manufacturing_reference:
          input.ic.ic_manufacturing_reference.toUpperCase(),
      },
      application_identification: {
        type_of_tachograph_card_id:
          input.application_identification.type_of_tachograph_card_id,
        card_structure_version:
          input.application_identification.card_structure_version,
        no_of_events_per_type:
          input.application_identification.no_of_events_per_type,
        no_of_faults_per_type:
          input.application_identification.no_of_faults_per_type,
        activity_structure_length:
          input.application_identification.activity_structure_length,
        no_of_card_vehicle_records:
          input.application_identification.no_of_card_vehicle_records,
        no_of_card_place_records:
          input.application_identification.no_of_card_place_records,
      },
      card_certificate: {
        certificate: input.card_certificate.card_certificate.toUpperCase(),
      },
      card_ca_certificate: {
        certificate:
          input.ca_certificate.member_state_certificate.toUpperCase(),
      },
      card_identification: {
        card_issuing_member_state:
          input.identification.card_issuing_member_state,
        card_number: input.identification.card_number,
        card_issuing_authority_name:
          input.identification.card_issuing_authority_name,
        card_issue_date: input.identification.card_issue_date,
        card_validity_begin: input.identification.card_validity_begin,
        card_expiry_date: input.identification.card_expiry_date,
        card_holder_surname: input.identification.card_holder_surname,
        card_holder_firstnames: input.identification.card_holder_firstnames,
        card_holder_birth_date: input.identification.card_holder_birth_date,
        card_holder_prefered_language:
          input.identification.card_holder_preferred_language,
      },
      driving_licence: {
        driving_licence_issuing_authority:
          input.driving_licence_info.driving_licence_issuing_authority,
        driving_licence_issuing_nation:
          input.driving_licence_info.driving_licence_issuing_nation,
        driving_licence_number:
          input.driving_licence_info.driving_licence_number,
      },
    };
  };

  const createDriverCardIfNeeded = async (data: any) => {
    const response = await axiosInstance.get('/driver-card/needs-data/');

    if (response.data === true) {
      await axiosInstance.post(
        '/driver-card/',
        JSON.stringify(transformData(data)),
      );
    }
  };

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
      dddString += file.dddFormat;

      if (filesForDriverCard.includes(file.name)) {
        dataForDriverCardPostRequest[file.name] = file.decodedData;
      }
    }

    await selectTachoApp();

    for (let file of tachographFiles) {
      await file.readData();
      dddString += file.dddFormat;

      if (filesForReport.includes(file.name)) {
        if (file.name === 'card_download') {
          dataForPostRequest.body.last_card_download = {
            time: file.decodedData.last_card_download,
          };
        } else if (file.name === 'driver_activity_data') {
          dataForPostRequest.body.driver_activities = file.decodedData;
        } else if (file.name === 'events_data') {
          dataForPostRequest.body.events = file.decodedData;
        } else if (file.name === 'vehicles_used') {
          dataForPostRequest.body.vehicles = file.decodedData;
        } else {
          dataForPostRequest.body[file.name] = file.decodedData;
        }
      }

      if (filesForDriverCard.includes(file.name)) {
        dataForDriverCardPostRequest[file.name] = file.decodedData;
      }
    }
  };

  const sendDataToServer = async () => {
    try {
      const response = await axiosInstance.post('/ddd/mobile/', {
        file: dddString,
      });

      const {id} = response.data;
      dataForPostRequest.ddd_file_id = id;

      await createDriverCardIfNeeded(dataForDriverCardPostRequest);
      await axiosInstance.post('/report/', JSON.stringify(dataForPostRequest));
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    lastRead,
    lastReadLoading,
    getLastRead,
    connectReader,
    connection,
    readCardData,
    sendDataToServer,
  };
};

export default useCardReader;
