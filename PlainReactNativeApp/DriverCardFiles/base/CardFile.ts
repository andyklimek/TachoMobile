import useApduCommand from '@/hooks/useApduCommand';
import {NativeModules} from 'react-native';

type BytePositionSlice = [number, number];
type decoderFunction = (data: number[]) => any;
// type mapperFunction = (data: string) => any;

interface DataField {
  position: BytePositionSlice;
  decoder: decoderFunction;
  //   mapper?: mapperFunction;
}

interface DataFields {
  [key: string]: DataField;
}

export default class CardFile {
  name: string;
  fileId: number[];
  fileSize: number;

  dataFields: DataFields;

  needsSignature: boolean;
  selectCommand: number[];
  readCommand: number[];

  processedData?: number[];
  decodedData?: {[key: string]: any};

  constructor(
    name: string,
    fileId: number[],
    fileSize: number,
    dataFields: DataFields,
    needsSignature: boolean = false,
  ) {
    this.name = name;
    this.fileId = fileId;
    this.fileSize = fileSize;

    this.dataFields = dataFields;

    this.needsSignature = needsSignature;

    const commandBuilder = useApduCommand();
    this.selectCommand = commandBuilder.createSelectCommand(this.fileId);
    this.readCommand = commandBuilder.createReadBinaryCommand(
      [0, 0],
      this.fileSize,
    );
  }

  async readData() {
    const commandBuilder = useApduCommand();
    commandBuilder.makeCommand(this.selectCommand);

    this.processedData = await commandBuilder.makeCommand(this.readCommand);
    this.decodedData = this.decodeData();
  }

  decodeData() {
    if (!this.processedData) {
      throw new Error('No data to decode');
    }

    const decoded: {[key: string]: any} = {};

    for (const key in this.dataFields) {
      const {position, decoder} = this.dataFields[key];
      const [start, end] = position;

      const slice = this.processedData.slice(start, end);

      decoded[key] = decoder(slice);
    }

    return decoded;
  }

  convertToDdd() {}
}
