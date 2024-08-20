/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import {useEffect, useMemo, useState} from 'react';
import {NativeModules} from 'react-native';
import useCommands from '@/hooks/useCommands';
import useDecoders from '@/hooks/useDecoders';

const useReaderIOS = () => {
  const {CardReader} = NativeModules;
  const {
    getSelectTachoAppCommand,
    getSuccessCode,
    getSelectFileCommand,
    getReadBinaryCommand,
    getHashFileCommand,
    getDigitalSignatureCommand,
  } = useCommands();
  const {decodeOctetString, decodeToAscii, decodeToInt, decodeToDate} =
    useDecoders();
  const [connection, setConnection] = useState(0);
  const [preDDD, setPreDDD] = useState([]);

  const headerFiles = useMemo(
    () => [
      // {
      //   name: 'ic',
      //   needs_signature: false,
      //   is_dynamic: false,
      //   fields: {
      //     ic_serial_number: {position: [0, 4], decoder: decodeOctetString},
      //     ic_manufacturing_reference: {
      //       position: [4, 8],
      //       decoder: decodeOctetString,
      //     },
      //   },
      // },
      // {
      //   name: 'icc',
      //   needs_signature: false,
      //   is_dynamic: false,
      //   fields: {
      //     clock_stop: {position: [0, 1], decoder: decodeOctetString},
      //     card_extended_serial_number: {
      //       position: [1, 9],
      //       decoder: decodeOctetString,
      //     },
      //     card_approval_number: {position: [9, 17], decoder: decodeOctetString},
      //     card_approval_number_interpreted: {
      //       position: [9, 17],
      //       decoder: decodeToAscii,
      //     },
      //     card_personalizer_id: {
      //       position: [17, 18],
      //       decoder: decodeOctetString,
      //     },
      //     embedder_ic_assembler_id: {
      //       position: [18, 23],
      //       decoder: decodeOctetString,
      //     },
      //     ic_identifier: {position: [23, 25], decoder: decodeOctetString},
      //   },
      // },
    ],
    [],
  );

  const tachoFiles = useMemo(
    () => [
      // {
      //   name: 'application_identification',
      //   needs_signature: true,
      //   is_dynamic: false,
      //   fields: {
      //     type_of_tachograph_card_id: {
      //       position: [0, 1],
      //       decoder: decodeOctetString,
      //     },
      //     card_structure_version: {
      //       position: [1, 3],
      //       decoder: decodeOctetString,
      //     },
      //     no_of_events_per_type: {
      //       position: [3, 4],
      //       decoder: decodeToInt,
      //     },
      //     no_of_faults_per_type: {
      //       position: [4, 5],
      //       decoder: decodeToInt,
      //     },
      //     activity_structure_length: {
      //       position: [5, 7],
      //       decoder: decodeToInt,
      //     },
      //     no_of_card_vehicle_records: {
      //       position: [7, 9],
      //       decoder: decodeToInt,
      //     },
      //     no_of_card_place_records: {
      //       position: [9, 10],
      //       decoder: decodeToInt,
      //     },
      //   },
      // },
      // {
      //   name: 'card_certificate',
      //   needs_signature: true,
      //   is_dynamic: false,
      //   fields: {
      //     card_certificate: {position: [0, 194], decoder: decodeOctetString},
      //   },
      // },
      // {
      //   name: 'ca_certificate',
      //   needs_signature: true,
      //   is_dynamic: false,
      //   fields: {
      //     member_state_certificate: {
      //       position: [0, 194],
      //       decoder: decodeOctetString,
      //     },
      //   },
      // },
      // {
      //   name: 'identification',
      //   needs_signature: true,
      //   is_dynamic: false,
      //   fields: {
      //     card_issuing_member_state: {
      //       position: [0, 1],
      //       decoder: decodeOctetString,
      //     },
      //     card_number: {
      //       position: [1, 17],
      //       decoder: decodeToAscii,
      //     },
      //     card_issuing_authority_name: {
      //       position: [17, 53],
      //       decoder: decodeToAscii,
      //     },
      //     card_issue_date: {
      //       position: [53, 57],
      //       decoder: decodeToDate,
      //     },
      //     card_validity_begin: {
      //       position: [57, 61],
      //       decoder: decodeToDate,
      //     },
      //     card_expiry_date: {
      //       position: [61, 65],
      //       decoder: decodeToDate,
      //     },
      //     card_holder_surname: {
      //       position: [65, 101],
      //       decoder: decodeToAscii,
      //     },
      //     card_holder_firstnames: {
      //       position: [101, 137],
      //       decoder: decodeToAscii,
      //     },
      //     card_holder_birth_date: {
      //       position: [137, 141],
      //       decoder: decodeToDate,
      //     },
      //     card_holder_preferred_language: {
      //       position: [141, 143],
      //       decoder: decodeToAscii,
      //     },
      //   },
      // },
      // {
      //   name: 'card_download',
      //   needs_signature: false,
      //   is_dynamic: false,
      //   fields: {
      //     last_card_download: {position: [0, 4], decoder: decodeToDate},
      //   },
      // },
      // {
      //   name: 'driving_licence_info',
      //   needs_signature: false,
      //   is_dynamic: false,
      //   fields: {
      //     driving_licence_issuing_authority: {
      //       position: [0, 36],
      //       decoder: decodeToAscii,
      //     },
      //     driving_licence_issuing_nation: {
      //       position: [36, 37],
      //       decoder: decodeOctetString,
      //     },
      //     driving_licence_number: {
      //       position: [37, 53],
      //       decoder: decodeToAscii,
      //     },
      //   },
      // },
      {
        name: 'events_data',
        needs_signature: true,
        is_dynamic: true,
        fields: {
          event_type: {
            position: [0, 1],
            decoder: decodeOctetString,
          },
          event_begin_time: {
            position: [1, 5],
            decoder: decodeToDate,
          },
          event_end_time: {
            position: [5, 9],
            decoder: decodeToDate,
          },
          vehicle_registration_nation: {
            position: [9, 10],
            decoder: decodeOctetString,
          },
          vehicle_registration_number: {
            position: [10, 24],
            decoder: decodeToAscii,
          },
        },
      },
      // {
      //   name: 'faults_data',
      //   needs_signature: true,
      //   is_dynamic: true,
      //   fields: {
      //     fault_type: {
      //       position: [0, 1],
      //       decoder: decodeOctetString,
      //     },
      //     fault_begin_time: {
      //       position: [1, 5],
      //       decoder: decodeToDate,
      //     },
      //     fault_end_time: {
      //       position: [5, 9],
      //       decoder: decodeToDate,
      //     },
      //     vehicle_registration_nation: {
      //       position: [9, 10],
      //       decoder: decodeOctetString,
      //     },
      //     vehicle_registration_number: {
      //       position: [10, 24],
      //       decoder: decodeToAscii,
      //     },
      //   },
      // },
      // {
      //   name: 'driver_activity_data',
      //   needs_signature: true,
      //   is_dynamic: true,
      //   fields: {
      //     activity_pointer_oldest_day_record: {
      //       position: [0, 2],
      //       decoder: decodeToInt,
      //     },
      //     activity_pointer_newest_record: {
      //       position: [2, 4],
      //       decoder: decodeToInt,
      //     },
      //     activity_daily_records: {
      //       position: [4, undefined],
      //       decoder: decodeOctetString,
      //     },
      //   },
      // },
      // {
      //   name: 'vehicles_used',
      //   needs_signature: true,
      //   is_dynamic: true,
      //   fields: {
      //     vehicle_odometer_begin: {
      //       position: [0, 3],
      //       decoder: decodeToInt,
      //     },
      //     vehicle_odometer_end: {
      //       position: [3, 6],
      //       decoder: decodeToInt,
      //     },
      //     vehicle_first_use: {
      //       position: [6, 10],
      //       decoder: decodeToDate,
      //     },
      //     vehicle_last_use: {
      //       position: [10, 14],
      //       decoder: decodeToDate,
      //     },
      //     vehicle_registration_nation: {
      //       position: [14, 15],
      //       decoder: decodeOctetString,
      //     },
      //     vehicle_registration_number: {
      //       position: [15, 29],
      //       decoder: decodeToAscii,
      //     },
      //     vehicle_data_counter: {
      //       position: [29, 31],
      //       decoder: decodeToInt,
      //     },
      //   },
      // },
      // {
      //   name: 'places',
      //   needs_signature: true,
      //   is_dynamic: true,
      //   fields: {
      //     entry_time: {
      //       position: [0, 4],
      //       decoder: decodeToDate,
      //     },
      //     entry_type_work_period: {
      //       position: [4, 5],
      //       decoder: decodeOctetString,
      //     },
      //     daily_work_period_country: {
      //       position: [5, 6],
      //       decoder: decodeOctetString,
      //     },
      //     daily_work_period_region: {
      //       position: [6, 7],
      //       decoder: decodeOctetString,
      //     },
      //     vehicle_odometer_value: {
      //       position: [7, 10],
      //       decoder: decodeToInt,
      //     },
      //   },
      // },
      // {
      //   name: 'specific_conditions',
      //   needs_signature: true,
      //   is_dynamic: true,
      //   fields: {
      //     entry_time: {
      //       position: [0, 4],
      //       decoder: decodeToDate,
      //     },
      //     specific_condition_type: {
      //       position: [4, 5],
      //       decoder: decodeOctetString,
      //     },
      //   },
      // },
      // {
      //   name: 'control_activity_data',
      //   needs_signature: true,
      //   is_dynamic: false,
      //   fields: {
      //     control_type: {
      //       position: [0, 1],
      //       decoder: decodeOctetString,
      //     },
      //     control_time: {
      //       position: [1, 5],
      //       decoder: decodeToDate,
      //     },
      //     card_type: {
      //       position: [5, 6],
      //       decoder: decodeOctetString,
      //     },
      //     card_issuing_member_state: {
      //       position: [6, 7],
      //       decoder: decodeOctetString,
      //     },
      //     card_number: {
      //       position: [7, 23],
      //       decoder: decodeToAscii,
      //     },
      //     vehicle_registration_nation: {
      //       position: [23, 24],
      //       decoder: decodeOctetString,
      //     },
      //     vehicle_registration_number: {
      //       position: [24, 38],
      //       decoder: decodeToAscii,
      //     },
      //     control_download_period_begin: {
      //       position: [38, 42],
      //       decoder: decodeToDate,
      //     },
      //     control_download_period_end: {
      //       position: [42, 46],
      //       decoder: decodeToDate,
      //     },
      //   },
      // },
      // {
      //   name: 'current_usage',
      //   needs_signature: false,
      //   is_dynamic: false,
      //   fields: {
      //     session_open_time: {position: [0, 4], decoder: decodeToDate},
      //     vehicle_registration_nation: {
      //       position: [4, 5],
      //       decoder: decodeOctetString,
      //     },
      //     vehicle_registration_number: {
      //       position: [5, 19],
      //       decoder: decodeToAscii,
      //     },
      //   },
      // },
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

  const sendCommand = async (command: number[]): Promise<number[]> => {
    try {
      const resp = await CardReader.sendAPDUCommand(command);
      return resp.slice(0, -2);
    } catch (error) {
      throw Error(error);
    }
  };

  const switchToTachoApp = async () => {
    try {
      await sendCommand(getSelectTachoAppCommand());
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
        console.log(responseData);
        offset += responseData.length;
      }
    } catch (error) {
      throw Error(error);
    }

    return readData;
  };

  const processHeaderData = async () => {
    const readedData: {[key: string]: string | number} = {};
    for (const {name, fields, needs_signature, is_dynamic} of headerFiles) {
      const selectCommand = getSelectFileCommand(name);
      const readCommand = getReadBinaryCommand(name);

      let respRead;

      if (is_dynamic) {
        respRead = await readDynamicLengthFile(selectCommand, readCommand);
      } else {
        await sendCommand(selectCommand);
        respRead = await sendCommand(readCommand);
      }

      if (needs_signature) {
        console.log('needs sign');
        // await sendCommand(getHashFileCommand());
        // const signature = await sendCommand(getDigitalSignatureCommand());
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
    }
    return readedData;
  };

  const processTachoData = async () => {
    const readedData: {[key: string]: string | number} = {};
    await switchToTachoApp();
    for (const {name, fields, needs_signature, is_dynamic} of tachoFiles) {
      const selectCommand = getSelectFileCommand(name);
      const readCommand = getReadBinaryCommand(name);

      let respRead;

      if (is_dynamic) {
        respRead = await readDynamicLengthFile(selectCommand, readCommand);
      } else {
        await sendCommand(selectCommand);
        respRead = await sendCommand(readCommand);
      }

      if (needs_signature) {
        console.log('needs sign');
        // await sendCommand(getHashFileCommand());
        // const signature = await sendCommand(getDigitalSignatureCommand());
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
    }

    return readedData;
  };

  const processData = async () => {
    const processedData = {
      ...(await processHeaderData()),
      ...(await processTachoData()),
    };

    console.log(processedData);
  };

  const connectReader = async () => {
    try {
      const deviceList = await CardReader.getDeviceListPromise();
      const readerResp = await CardReader.connectReader(deviceList[0]);

      setConnection(readerResp);
      console.log('Connected: ', readerResp);
    } catch (error) {
      console.log('Error: ', error);
      throw Error(error);
    }
  };

  const connectAndRead = async () => {
    try {
      await connectReader();
      await processData();
    } catch (error) {
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
