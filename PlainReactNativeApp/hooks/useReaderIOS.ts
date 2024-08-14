import {useEffect, useMemo, useState} from 'react';
import {NativeModules} from 'react-native';
import useCommands from '@/hooks/useCommands';
import useDecoders from '@/hooks/useDecoders';
import axiosInstance from '@/utils/axiosConfig';

const useReaderIOS = () => {
  const {CardReader} = NativeModules;
  const {
    getSelectTachoAppCommand,
    getSuccessCode,
    getSelectFileCommand,
    getReadBinaryCommand,
  } = useCommands();
  const {decodeOctetString, decodeToAscii, decodeToInt, decodeToDate} =
    useDecoders();
  const [connection, setConnection] = useState(0);
  const [preDDD, setPreDDD] = useState([]);

  const headerFiles = useMemo(
    () => [
      {
        name: 'ic',
        needs_signature: false,
        is_dynamic: false,
        fields: {
          ic_serial_number: {position: [0, 4], decoder: decodeOctetString},
          ic_manufacturing_reference: {
            position: [4, 8],
            decoder: decodeOctetString,
          },
        },
      },
      {
        name: 'icc',
        needs_signature: false,
        is_dynamic: false,
        fields: {
          clock_stop: {position: [0, 1], decoder: decodeOctetString},
          card_extended_serial_number: {
            position: [1, 9],
            decoder: decodeOctetString,
          },
          card_approval_number: {position: [9, 17], decoder: decodeOctetString},
          card_approval_number_interpreted: {
            position: [9, 17],
            decoder: decodeToAscii,
          },
          card_personalizer_id: {
            position: [17, 18],
            decoder: decodeOctetString,
          },
          embedder_ic_assembler_id: {
            position: [18, 23],
            decoder: decodeOctetString,
          },
          ic_identifier: {position: [23, 25], decoder: decodeOctetString},
        },
      },
    ],
    [],
  );

  const tachoFiles = useMemo(
    () => [
      {
        // TODO: Add card_type mapper for this file
        name: 'application_identification',
        needs_signature: false,
        is_dynamic: false,
        fields: {
          type_of_tachograph_card_id: {
            position: [0, 1],
            decoder: decodeOctetString,
          },
          card_structure_version: {
            position: [1, 3],
            decoder: decodeOctetString,
          },
          no_of_events_per_type: {
            position: [3, 4],
            decoder: decodeToInt,
          },
          no_of_faults_per_type: {
            position: [4, 5],
            decoder: decodeToInt,
          },
          activity_structure_length: {
            position: [5, 7],
            decoder: decodeToInt,
          },
          no_of_card_vehicle_records: {
            position: [7, 9],
            decoder: decodeToInt,
          },
          no_of_card_place_records: {
            position: [9, 10],
            decoder: decodeToInt,
          },
        },
      },
      {
        name: 'card_certificate',
        needs_signature: false,
        is_dynamic: false,
        fields: {
          card_certificate: {position: [0, 194], decoder: decodeOctetString},
        },
      },
      {
        name: 'ca_certificate',
        needs_signature: false,
        is_dynamic: false,
        fields: {
          member_state_certificate: {
            position: [0, 194],
            decoder: decodeOctetString,
          },
        },
      },
      {
        // TODO: Add nation mapper for this file
        name: 'identification',
        needs_signature: false,
        is_dynamic: false,
        fields: {
          card_issuing_member_state: {
            position: [0, 1],
            decoder: decodeOctetString,
          },
          card_number: {
            position: [1, 17],
            decoder: decodeToAscii,
          },
          card_issuing_authority_name: {
            position: [17, 53],
            decoder: decodeToAscii,
          },
          card_issue_date: {
            position: [53, 57],
            decoder: decodeToDate,
          },
          card_validity_begin: {
            position: [57, 61],
            decoder: decodeToDate,
          },
          card_expiry_date: {
            position: [61, 65],
            decoder: decodeToDate,
          },
          card_holder_surname: {
            position: [0 + 65, 36 + 65],
            decoder: decodeToAscii,
          },
          card_holder_firstnames: {
            position: [36 + 65, 72 + 65],
            decoder: decodeToAscii,
          },
          card_holder_birth_date: {
            position: [72 + 65, 76 + 65],
            decoder: decodeToDate,
          },
          card_holder_preferred_language: {
            position: [76 + 65, 78 + 65],
            decoder: decodeToAscii,
          },
        },
      },
      {
        name: 'card_download',
        needs_signature: false,
        is_dynamic: false,
        fields: {
          last_card_download: {position: [0, 4], decoder: decodeToDate},
        },
      },
      {
        // TODO: Add nation mapper for this file
        name: 'driving_licence_info',
        needs_signature: false,
        is_dynamic: false,
        fields: {
          driving_licence_issuing_authority: {
            position: [0, 36],
            decoder: decodeToAscii,
          },
          driving_licence_issuing_nation: {
            position: [36, 37],
            decoder: decodeOctetString,
          },
          driving_licence_number: {
            position: [37, 53],
            decoder: decodeToAscii,
          },
        },
      },
    ],
    [],
  );

  useEffect(() => {
    const establishReaderContext = async () => {
      try {
        await CardReader.establishContext();
      } catch (error) {
        throw Error(error);
      }
    };

    establishReaderContext();
  }, []);

  const sendCommand = async (command: number[]): number[] => {
    try {
      const resp = await CardReader.sendAPDUCommand(command);
      // eslint-disable-next-line no-console
      //   console.log(resp.slice(-2) == [144, 0]);
      //   if (resp.slice(-2) !== getSuccessCode()) {
      //     throw new Error('Failed to send command');
      //   }
      return resp.slice(0, -2);
    } catch (error) {
      throw Error(error);
    }
  };

  const readDynamicLengthFile = async (
    selectCommand: number[],
    readCommandBase: number[],
  ): Promise<number[]> => {
    let offset = 0;
    let readData: number[] = [];

    try {
      await sendCommand(selectCommand);

      while (true) {
        const readCommand = [...readCommandBase, offset >> 8, offset & 0xff];
        const responseData = await sendCommand(readCommand);

        if (responseData.length === 0) {
          break;
        }

        readData = [...readData, ...responseData];
        offset += responseData.length;
      }
    } catch (error) {
      throw Error(error);
    }

    return readData;
  };

  const switchToTachoApp = async () => {
    try {
      await sendCommand(getSelectTachoAppCommand());
    } catch (error) {
      throw Error(error);
    }
  };

  const processHeaderData = async () => {
    const readedData: {[key: string]: string | number} = {};
    for (const {name, fields, needs_signature, is_dynamic} of headerFiles) {
      const selectCommand = getSelectFileCommand(name);
      const readCommand = getReadBinaryCommand(name);

      if (needs_signature) {
        // eslint-disable-next-line no-console
        console.log('Needs signature');
      }

      try {
        let respRead;

        if (is_dynamic) {
          // eslint-disable-next-line no-console
          console.log('Is dynamic');
        } else {
          await sendCommand(selectCommand);
          respRead = await sendCommand(readCommand);
        }

        setPreDDD(prevState => [
          ...prevState,
          {
            name,
            binaryData: respRead,
            size: respRead.length,
            id: selectCommand.slice(-2),
          },
        ]);

        const decodedData = Object.keys(fields).reduce((acc, field) => {
          const {position, decoder} = fields[field];
          let value;
          if (decoder) {
            value = decoder(respRead.slice(position[0], position[1]));
          } else {
            value = respRead.slice(position[0], position[1]).join('');
          }

          return {...acc, [field]: value};
        }, {});

        readedData[name] = decodedData;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
        throw Error(error);
      }
    }
    return readedData;
  };

  const processTachoData = async () => {
    const readedData: {[key: string]: string | number} = {};
    await switchToTachoApp();
    for (const {name, fields, needs_signature} of tachoFiles) {
      const selectCommand = getSelectFileCommand(name);

      if (needs_signature) {
        // eslint-disable-next-line no-console
        console.log('Needs signature');
      }

      const readCommand = getReadBinaryCommand(name);
      try {
        await sendCommand(selectCommand);
        const respRead = await sendCommand(readCommand);

        setPreDDD(prevState => [
          ...prevState,
          {
            name,
            binaryData: respRead,
            size: respRead.length,
            id: selectCommand.slice(-2),
          },
        ]);

        const decodedData = Object.keys(fields).reduce((acc, field) => {
          const {position, decoder} = fields[field];
          let value;
          if (decoder) {
            value = decoder(respRead.slice(position[0], position[1]));
          } else {
            value = respRead.slice(position[0], position[1]).join('');
          }
          return {...acc, [field]: value};
        }, {});

        readedData[name] = decodedData;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
        throw Error(error);
      }
    }

    return readedData;
  };

  const processData = async () => {
    let processedData: {[key: string]: string | number};
    processedData = {
      ...(await processHeaderData()),
      ...(await processTachoData()),
    };

    // eslint-disable-next-line no-console
    console.log(processedData);

    try {
      const response = await axiosInstance.post('/ddd/mail/', {
        file_data: preDDD,
        email: 'monkey@test.com',
      });
      // eslint-disable-next-line no-console
      console.log(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const connectReader = async () => {
    try {
      const deviceList = await CardReader.getDeviceListPromise();
      const readerResp = await CardReader.connectReader(deviceList[0]);

      // eslint-disable-next-line no-console
      console.log('Connected: ', readerResp);
      setConnection(readerResp);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error: ', error);
      throw Error(error);
    }
  };

  const connectAndRead = async () => {
    try {
      await connectReader();
      await processData();
    } catch (error) {
      // eslint-disable-next-line no-console
      return Promise.reject(error);
    }
  };

  return {
    connection,
    switchToTachoApp,
    sendCommand,
    processData,
    connectReader,
    connectAndRead,
  };
};

export default useReaderIOS;
