// import {useMemo} from 'react';

// export type FileType =
//   | 'icc'
//   | 'ic'
//   | 'application_identification'
//   | 'card_certificate'
//   | 'ca_certificate'
//   | 'identification'
//   | 'card_download'
//   | 'driving_licence_info'
//   | 'events_data'
//   | 'faults_data'
//   | 'driver_activity_data'
//   | 'vehicles_used'
//   | 'places'
//   | 'current_usage'
//   | 'control_activity_data'
//   | 'specific_conditions';

// const useCommands = () => {
//   const data = useMemo(
//     () => ({
//       success_command: [144, 0],
//       select_tacho_app: [
//         0x00, 0xa4, 0x04, 0x0c, 0x06, 0xff, 0x54, 0x41, 0x43, 0x48, 0x4f,
//       ],
//       hash_file: [0x80, 0x2a, 0x90, 0x00],
//       compute_digital_signature: [0x00, 0x2a, 0x9e, 0x9a, 0x80],
//       select_command_prefix: [0x00, 0xa4, 0x02, 0x0c, 0x02],
//       read_binary_prefix: [0x00, 0xb0],
//       default_offset: [0x00, 0x00],
//       files: {
//         icc: {
//           type: 'STATIC',
//           id: [0x00, 0x02],
//           size: 25,
//           needs_signature: false,
//         },
//         ic: {
//           type: 'STATIC',
//           id: [0x00, 0x05],
//           size: 8,
//           needs_signature: false,
//         },
//         application_identification: {
//           type: 'STATIC',
//           id: [0x05, 0x01],
//           size: 10,
//           needs_signature: true,
//         },
//         card_certificate: {
//           type: 'STATIC',
//           id: [0xc1, 0x00],
//           size: 194,
//           needs_signature: true,
//         },
//         ca_certificate: {
//           type: 'STATIC',
//           id: [0xc1, 0x08],
//           size: 194,
//           needs_signature: true,
//         },
//         identification: {
//           type: 'STATIC',
//           id: [0x05, 0x20],
//           size: 143,
//           needs_signature: true,
//         },
//         card_download: {
//           type: 'STATIC',
//           id: [0x05, 0x0e],
//           size: 4,
//           needs_signature: false,
//         },
//         driving_licence_info: {
//           type: 'STATIC',
//           id: [0x05, 0x21],
//           size: 53,
//           needs_signature: false,
//         },
//         events_data: {
//           type: 'DYNAMIC',
//           id: [0x05, 0x02],
//           size: 1728,
//           needs_signature: true,
//         },
//         faults_data: {
//           type: 'DYNAMIC',
//           id: [0x05, 0x03],
//           size: 1152,
//           needs_signature: true,
//         },
//         driver_activity_data: {
//           type: 'DYNAMIC',
//           id: [0x05, 0x04],
//           size: 13780,
//           needs_signature: true,
//         },
//         vehicles_used: {
//           type: 'DYNAMIC',
//           id: [0x05, 0x05],
//           size: 6202,
//           needs_signature: true,
//         },
//         places: {
//           type: 'DYNAMIC',
//           id: [0x05, 0x06],
//           size: 1121,
//           needs_signature: true,
//         },
//         current_usage: {
//           type: 'STATIC',
//           id: [0x05, 0x07],
//           size: 19,
//           needs_signature: false,
//         },
//         control_activity_data: {
//           type: 'STATIC',
//           id: [0x05, 0x08],
//           size: 46,
//           needs_signature: true,
//         },
//         specific_conditions: {
//           type: 'DYNAMIC',
//           id: [0x05, 0x22],
//           size: 280,
//           needs_signature: true,
//         },
//       },
//     }),
//     [],
//   );

//   const getSuccessCode = () => data.success_command;

//   const getSelectTachoAppCommand = () => data.select_tacho_app;

//   const getSelectFileCommand = (file: FileType): number[] => {
//     if (!data.files[file]) {
//       throw new Error(`File ${file} not found in data.files`);
//     }

//     const {id} = data.files[file];
//     return [...data.select_command_prefix, ...id];
//   };

//   const getReadBinaryCommand = (
//     file: FileType,
//     offset: number[] = data.default_offset,
//     length: number = 0xff,
//   ): number[] => {
//     if (!data.files[file]) {
//       throw new Error(`File ${file} not found in data.files`);
//     }

//     const fileData = data.files[file];
//     if (fileData.type === 'STATIC') {
//       return [...data.read_binary_prefix, ...offset, fileData.size];
//     } else if (fileData.type === 'DYNAMIC') {
//       return [...data.read_binary_prefix, ...offset, length];
//     } else {
//       throw new Error(`Unsupported file type for ${file}`);
//     }
//   };

//   const getHashFileCommand = () => data.hash_file;

//   const getDigitalSignatureCommand = () => data.compute_digital_signature;

//   return {
//     data,
//     getSelectTachoAppCommand,
//     getSelectFileCommand,
//     getReadBinaryCommand,
//     getHashFileCommand,
//     getDigitalSignatureCommand,
//     getSuccessCode,
//   };
// };

// export default useCommands;
import {useMemo} from 'react';

export type FileType =
  | 'icc'
  | 'ic'
  | 'application_identification'
  | 'card_certificate'
  | 'ca_certificate'
  | 'identification'
  | 'card_download'
  | 'driving_licence_info'
  | 'events_data'
  | 'faults_data'
  | 'driver_activity_data'
  | 'vehicles_used'
  | 'places'
  | 'specific_conditions'
  | 'control_activity_data'
  | 'current_usage';

const useCommands = () => {
  const data = useMemo(
    () => ({
      success_command: [144, 0],
      select_tacho_app: [
        0x00, 0xa4, 0x04, 0x0c, 0x06, 0xff, 0x54, 0x41, 0x43, 0x48, 0x4f,
      ],
      hash_file: [0x80, 0x2a, 0x90, 0x00],
      compute_digital_signature: [0x00, 0x2a, 0x9e, 0x9a, 0x80],
      select_command_prefix: [0x00, 0xa4, 0x02, 0x0c, 0x02],
      read_binary_prefix: [0x00, 0xb0],
      default_offset: [0x00, 0x00],
      files: {
        icc: {
          type: 'STATIC',
          id: [0x00, 0x02],
          size: 0x19,
        },
        ic: {
          type: 'STATIC',
          id: [0x00, 0x05],
          size: 0x08,
        },
        application_identification: {
          type: 'STATIC',
          id: [0x05, 0x01],
          size: 0x0a,
        },
        card_certificate: {
          type: 'STATIC',
          id: [0xc1, 0x00],
          size: 0xc2,
        },
        ca_certificate: {
          type: 'STATIC',
          id: [0xc1, 0x08],
          size: 0xc2,
        },
        identification: {
          type: 'STATIC',
          id: [0x05, 0x20],
          size: 0x8f,
        },
        card_download: {
          type: 'STATIC',
          id: [0x05, 0x0e],
          size: 0x04,
        },
        driving_licence_info: {
          type: 'STATIC',
          id: [0x05, 0x21],
          size: 0x35,
        },
        events_data: {
          type: 'DYNAMIC',
          id: [0x05, 0x02],
          size: undefined,
        },
        faults_data: {
          type: 'DYNAMIC',
          id: [0x05, 0x03],
          size: undefined,
        },
        driver_activity_data: {
          type: 'DYNAMIC',
          id: [0x05, 0x04],
          size: undefined,
        },
        vehicles_used: {
          type: 'DYNAMIC',
          id: [0x05, 0x05],
          size: undefined,
        },
        places: {
          type: 'DYNAMIC',
          id: [0x05, 0x06],
          size: undefined,
        },
        specific_conditions: {
          type: 'DYNAMIC',
          id: [0x05, 0x22],
          size: undefined,
        },
        control_activity_data: {
          type: 'STATIC',
          id: [0x05, 0x08],
          size: 0x2e,
        },
        current_usage: {
          type: 'STATIC',
          id: [0x05, 0x07],
          size: 0x13,
        },
      },
    }),
    [],
  );

  const getSuccessCode = () => data.success_command;

  const getSelectTachoAppCommand = () => data.select_tacho_app;

  const getSelectFileCommand = (file: FileType): number[] => {
    if (!data.files[file]) {
      throw new Error(`File ${file} not found in data.files`);
    }

    const {id} = data.files[file];
    return [...data.select_command_prefix, ...id];
  };

  const getReadBinaryCommand = (
    file: FileType,
    offset: number[] = data.default_offset,
    length: number = 0xff,
  ): number[] => {
    if (!data.files[file]) {
      throw new Error(`File ${file} not found in data.files`);
    }

    const fileData = data.files[file];
    if (fileData.type === 'STATIC') {
      return [...data.read_binary_prefix, ...offset, fileData.size];
    } else if (fileData.type === 'DYNAMIC') {
      return [...data.read_binary_prefix, ...offset, length];
    } else {
      throw new Error(`Unsupported file type for ${file}`);
    }
  };

  const getHashFileCommand = () => data.hash_file;

  const getDigitalSignatureCommand = () => data.compute_digital_signature;

  return {
    data,
    getSelectTachoAppCommand,
    getSelectFileCommand,
    getReadBinaryCommand,
    getHashFileCommand,
    getDigitalSignatureCommand,
    getSuccessCode,
  };
};

export default useCommands;
