import {useMemo} from 'react';
import {NativeModules} from 'react-native';

const useApduCommand = () => {
  const {CardReader} = NativeModules;

  const commandData = useMemo(
    () => ({
      select_tacho_app: [
        0x00, 0xa4, 0x04, 0x0c, 0x06, 0xff, 0x54, 0x41, 0x43, 0x48, 0x4f,
      ],
      hash_file: [0x80, 0x2a, 0x90, 0x00],
      compute_digital_signature: [0x00, 0x2a, 0x9e, 0x9a, 0x80],
      select_command_prefix: [0x00, 0xa4, 0x02, 0x0c, 0x02],
      read_binary_prefix: [0x00, 0xb0],
      default_offset: [0x00, 0x00],
    }),
    [],
  );

  const statusData = useMemo(
    () => ({
      success_command: [144, 0],
    }),
    [],
  );

  const selectTachoAppCommand = () => commandData.select_tacho_app;

  const createSelectCommand = (fileId: number[]): number[] => [
    ...commandData.select_command_prefix,
    ...fileId,
  ];

  const createReadBinaryCommand = (
    offset: number[],
    expected_bytes: number,
  ): number[] => [...commandData.read_binary_prefix, ...offset, expected_bytes];

  const getDigitalSignatureCommand = (fileId: number[]): number[] =>
    commandData.compute_digital_signature;

  const getHashDataCommand = (fileId: number[]): number[] =>
    commandData.hash_file;

  const makeCommand = async (command: number[]) => {
    try {
      const resp = CardReader.sendAPDUCommand(command);
      return resp.slice(0, -2);
    } catch (e) {
      throw Error(e as string);
    }
  };

  return {
    selectTachoAppCommand,
    createSelectCommand,
    createReadBinaryCommand,
    getDigitalSignatureCommand,
    getHashDataCommand,
    makeCommand,
  };
};

export default useApduCommand;
