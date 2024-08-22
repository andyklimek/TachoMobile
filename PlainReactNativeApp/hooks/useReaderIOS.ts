/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import {useEffect, useMemo, useState} from 'react';
import {NativeModules} from 'react-native';
import useCommands from '@/hooks/useCommands';
import useDecoders from '@/hooks/useDecoders';
import useDataMapers from '@/hooks/useDataMaper';

const useReaderIOS = () => {
  const {CardReader} = NativeModules;
  const {
    getSelectTachoAppCommand,
    getSuccessCode,
    getSelectFileCommand,
    getReadBinaryCommand,
    getHashFileCommand,
    getDigitalSignatureCommand,
    getSelectCommandPrefix,
    getFileData,
  } = useCommands();
  const {decodeOctetString, decodeToAscii, decodeToInt, decodeToDate} =
    useDecoders();
  const {
    getTachographCardType,
    getNation,
    getEventFaultType,
    getSlotValue,
    getDrivingStatus,
    getCardStatus,
    getActivity,
    getRegion,
    getSpecialCondition,
    getTypeWorkPeriod,
    getControlType,
  } = useDataMapers();
  const [connection, setConnection] = useState(0);
  const [preDDD, setPreDDD] = useState([]);
  const [DDDFormat, setDDDFormat] = useState('');

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
        name: 'application_identification',
        needs_signature: true,
        is_dynamic: false,
        fields: {
          type_of_tachograph_card_id: {
            position: [0, 1],
            decoder: decodeOctetString,
            mapper: getTachographCardType,
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
        needs_signature: true,
        is_dynamic: false,
        fields: {
          card_certificate: {position: [0, 194], decoder: decodeOctetString},
        },
      },
      {
        name: 'ca_certificate',
        needs_signature: true,
        is_dynamic: false,
        fields: {
          member_state_certificate: {
            position: [0, 194],
            decoder: decodeOctetString,
          },
        },
      },
      {
        name: 'identification',
        needs_signature: true,
        is_dynamic: false,
        fields: {
          card_issuing_member_state: {
            position: [0, 1],
            decoder: decodeOctetString,
            mapper: getNation,
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
            position: [65, 101],
            decoder: decodeToAscii,
          },
          card_holder_firstnames: {
            position: [101, 137],
            decoder: decodeToAscii,
          },
          card_holder_birth_date: {
            position: [137, 141],
            decoder: decodeToDate,
          },
          card_holder_preferred_language: {
            position: [141, 143],
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
            mapper: getNation,
          },
          driving_licence_number: {
            position: [37, 53],
            decoder: decodeToAscii,
          },
        },
      },
      // {
      //   name: 'events_data',
      //   needs_signature: true,
      //   is_dynamic: true,
      //   reading_speed: 0x40,
      //   record_size: 24,
      //   fields: {
      //     event_type: {
      //       position: [0, 1],
      //       decoder: decodeOctetString,
      //       mapper: getEventFaultType,
      //     },
      //     event_begin_time: {
      //       position: [1, 5],
      //       decoder: decodeToDate,
      //     },
      //     event_end_time: {
      //       position: [5, 9],
      //       decoder: decodeToDate,
      //     },
      //     vehicle_registration_nation: {
      //       position: [9, 10],
      //       decoder: decodeOctetString,
      //       mapper: getNation,
      //     },
      //     vehicle_registration_number: {
      //       position: [10, 24],
      //       decoder: decodeToAscii,
      //     },
      //   },
      // },
      // {
      //   name: 'faults_data',
      //   needs_signature: true,
      //   is_dynamic: true,
      //   reading_speed: 0x40,
      //   record_size: 24,
      //   fields: {
      //     fault_type: {
      //       position: [0, 1],
      //       decoder: decodeOctetString,
      //       mapper: getEventFaultType,
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
      //       mapper: getNation,
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
      //   reading_speed: 0x41,
      //   record_size: 12,
      //   fields: {
      //     activity_pointer_oldest_record: {
      //       position: [0, 2],
      //       decoder: decodeToInt,
      //     },
      //     activity_pointer_newest_record: {
      //       position: [2, 4],
      //       decoder: decodeToInt,
      //     },
      //   },
      // },
      // {
      //   name: 'vehicles_used',
      //   needs_signature: true,
      //   is_dynamic: true,
      //   reading_speed: 0x0e,
      //   record_size: 31,
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
      //       mapper: getNation,
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
      //   reading_speed: 0x3b,
      //   record_size: 10,
      //   fields: {
      //     entry_time: {
      //       position: [0, 4],
      //       decoder: decodeToDate,
      //     },
      //     entry_type_work_period: {
      //       position: [4, 5],
      //       decoder: decodeOctetString,
      //       mapper: getTypeWorkPeriod,
      //     },
      //     daily_work_period_country: {
      //       position: [5, 6],
      //       decoder: decodeOctetString,
      //       mapper: getNation,
      //     },
      //     daily_work_period_region: {
      //       position: [6, 7],
      //       decoder: decodeOctetString,
      //       mapper: getRegion,
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
      //   reading_speed: 0x1c,
      //   record_size: 5,
      //   fields: {
      //     entry_time: {
      //       position: [0, 4],
      //       decoder: decodeToDate,
      //     },
      //     specific_condition_type: {
      //       position: [4, 5],
      //       decoder: decodeOctetString,
      //       mapper: getSpecialCondition,
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
      //       mapper: getControlType,
      //     },
      //     control_time: {
      //       position: [1, 5],
      //       decoder: decodeToDate,
      //     },
      //     card_type: {
      //       position: [5, 6],
      //       decoder: decodeOctetString,
      //       mapper: getTachographCardType,
      //     },
      //     card_issuing_member_state: {
      //       position: [6, 7],
      //       decoder: decodeOctetString,
      //       mapper: getNation,
      //     },
      //     card_number: {
      //       position: [7, 23],
      //       decoder: decodeToAscii,
      //     },
      //     vehicle_registration_nation: {
      //       position: [23, 24],
      //       decoder: decodeOctetString,
      //       mapper: getNation,
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
      //       mapper: getNation,
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

      // console.log(resp.slice(resp.length - 2));
      // if (resp[resp.length - 2] != 144 && resp[resp.length - 1] != 0) {
      //   console.log(command);
      //   throw Error('Invalid response');
      // }
      return resp.slice(0, -2);
    } catch (error) {
      throw Error(error);
    }
  };

  function hexToBigEndian(hex) {
    if (hex.startsWith('0x')) {
      hex = hex.slice(2);
    }

    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }

    const byteArray = hex.match(/.{2}/g);

    const bigEndianArray = byteArray.reverse();

    const bigEndianHex = bigEndianArray.join('');

    return bigEndianHex.toString(16).padStart(4, '0').toUpperCase();
  }

  const convertToDDDFormat = (
    file: string,
    byteData: number[],
    signature: number[] | null,
  ) => {
    const {id, size} = getFileData(file);

    const tag = `${id[0].toString(16).padStart(2, '0')}${id[1]
      .toString(16)
      .padStart(2, '0')}${(0x00).toString(16).padStart(2, '0')}`;

    const fileHeader = tag + hexToBigEndian(size.toString(16));

    let fileData;
    if (byteData.length === 0) {
      fileData = '00'.repeat(size);
    } else {
      fileData = byteData
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    }

    let formattedForDDD = fileHeader + fileData;

    if (signature) {
      const signatureHex = signature
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
      formattedForDDD += signatureHex;
    }

    // Convert the final hex string to a binary buffer and return
    console.log(formattedForDDD);
    // return Buffer.from(formattedForDDD, 'hex');
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
    reading_speed: number,
  ): Promise<number[]> => {
    let offset = 0;
    let readData: number[] = [];

    try {
      await sendCommand(selectCommand);

      while (true) {
        const readCommand = [
          ...readCommandBase,
          offset >> 8,
          offset && 0xff,
          reading_speed,
        ];
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

    // console.log(readData);
    return readData;
  };

  const areObjectsEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const processHeaderData = async () => {
    const readedData: {[key: string]: string | number} = {};
    for (const {name, fields} of headerFiles) {
      const selectCommand = getSelectFileCommand(name);

      let respRead;

      await sendCommand(selectCommand);
      const readCommand = getReadBinaryCommand(name);
      respRead = await sendCommand(readCommand);

      setPreDDD(prevState => [
        ...prevState,
        {
          name,
          binaryData: respRead,
          size: respRead.length,
          id: selectCommand.slice(-2),
          signature: null,
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

  // const processDriverActivityData = async () => {
  //   const fileConfig = tachoFiles.find(
  //     file => file.name === 'driver_activity_data',
  //   );

  //   if (!fileConfig) {
  //     throw new Error('Driver activity data configuration not found');
  //   }

  //   const {fields, reading_speed} = fileConfig;

  //   const selectCommand = getSelectFileCommand(fileConfig.name);

  //   const respRead = await readDynamicLengthFile(
  //     selectCommand,
  //     [0x00, 0xb0],
  //     reading_speed,
  //   );

  //   console.log(respRead);

  //   const oldestRecordPointer = decodeToInt(
  //     respRead.slice(
  //       fields.activity_pointer_oldest_record.position[0],
  //       fields.activity_pointer_oldest_record.position[1],
  //     ),
  //   );
  //   const newestRecordPointer = decodeToInt(
  //     respRead.slice(
  //       fields.activity_pointer_newest_record.position[0],
  //       fields.activity_pointer_newest_record.position[1],
  //     ),
  //   );

  //   console.log(oldestRecordPointer, newestRecordPointer);

  //   const records = [];
  //   let pointer = newestRecordPointer;

  //   while (true) {
  //     if (pointer < 0) {
  //       pointer = respRead.length + pointer;
  //     }

  //     const generalActivityInfo = respRead.slice(pointer, pointer + 13); // Assuming 12 bytes for general activity info
  //     const recordLength = decodeToInt(generalActivityInfo.slice(2, 4));

  //     const activityChangeInfo = respRead.slice(
  //       pointer + 12,
  //       pointer + recordLength,
  //     );

  //     // Decode general info
  //     const record = {
  //       previous_length: decodeToInt(generalActivityInfo.slice(0, 2)),
  //       record_length: recordLength,
  //       date: decodeToDate(generalActivityInfo.slice(4, 8)),
  //       presence_counter: decodeToInt(generalActivityInfo.slice(8, 10)),
  //       day_distance: decodeToInt(generalActivityInfo.slice(10, 12)),
  //       activity_changes: [],
  //     };

  //     // Decode each activity change
  //     for (let i = 0; i < activityChangeInfo.length; i += 2) {
  //       const change = decodeOctetString(activityChangeInfo.slice(i, i + 2));
  //       const binaryStr = parseInt(change, 16).toString(2).padStart(16, '0');
  //       const slot = getSlotValue(binaryStr[4]);
  //       const drivingStatus = getDrivingStatus(binaryStr[5]);
  //       const cardStatus = getCardStatus(binaryStr[6]);
  //       const activity = getActivity(binaryStr.slice(7, 9));

  //       const hours = parseInt(binaryStr.slice(-11, -6), 2);
  //       const minutes = parseInt(binaryStr.slice(-6), 2);

  //       const timeOfChange = new Date();
  //       timeOfChange.setHours(hours, minutes);

  //       record.activity_changes.push({
  //         slot,
  //         driving_status: drivingStatus,
  //         card_status: cardStatus,
  //         activity,
  //         time_of_change: timeOfChange,
  //       });
  //     }

  //     records.push(record);

  //     if (pointer === oldestRecordPointer) {
  //       break;
  //     }

  //     pointer -= decodeToInt(generalActivityInfo.slice(0, 2));
  //   }

  //   // Sort records by date if needed
  //   records.sort((a, b) => a.date - b.date);

  //   return records;
  // };

  const processTachoData = async () => {
    const readedData = {};
    await switchToTachoApp();

    for (const {
      name,
      fields,
      needs_signature,
      is_dynamic,
      reading_speed,
      record_size,
    } of tachoFiles) {
      // if (name === 'driver_activity_data') {
      //   readedData[name] = await processDriverActivityData();
      //   continue;
      // }

      const selectCommand = getSelectFileCommand(name);

      let signature = null;
      if (needs_signature) {
        await sendCommand(getHashFileCommand());
        signature = await sendCommand(getDigitalSignatureCommand());
      }

      let respRead;

      if (is_dynamic) {
        respRead = await readDynamicLengthFile(
          selectCommand,
          [0x00, 0xb0],
          reading_speed,
        );
      } else {
        await sendCommand(selectCommand);
        const readCommand = getReadBinaryCommand(name);
        respRead = await sendCommand(readCommand);
      }

      convertToDDDFormat(name, respRead, signature);

      setPreDDD(prevState => [
        ...prevState,
        {
          name,
          binaryData: respRead,
          size: respRead.length,
          id: selectCommand.slice(-2),
          signature,
        },
      ]);

      let decodedData = [];

      if (is_dynamic) {
        for (let i = 0; i < respRead.length; i += record_size) {
          const data = respRead.slice(i, i + record_size);
          const tmpData = Object.keys(fields).reduce((acc, field) => {
            const {position, decoder, mapper} = fields[field];
            let value;
            if (decoder) {
              value = decoder(data.slice(position[0], position[1]));
              if (mapper) {
                value = mapper(value);
              }
            } else {
              value = data.slice(position[0], position[1]).join('');
            }
            return {...acc, [field]: value};
          }, {});

          if (!decodedData.some(record => areObjectsEqual(record, tmpData))) {
            decodedData.push(tmpData);
          }
        }
      } else {
        decodedData = Object.keys(fields).reduce((acc, field) => {
          const {position, decoder, mapper} = fields[field];
          let value;
          if (decoder) {
            value = decoder(respRead.slice(position[0], position[1]));
            if (mapper) {
              value = mapper(value);
            }
          } else {
            value = respRead.slice(position[0], position[1]).join('');
          }
          return {...acc, [field]: value};
        }, {});

        readedData[name] = decodedData;
        continue;
      }

      readedData[name] = decodedData;
    }

    return readedData;
  };

  const processData = async () => {
    const processedData = {
      ...(await processHeaderData()),
      ...(await processTachoData()),
    };

    // console.log(preDDD);
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
