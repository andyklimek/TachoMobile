import {DataMapper} from '../utils/DataMapper';

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

export class CardFile {
  name: string;
  fileId: number[];
  fileSize: number;
  dataFields: DataFields;
  needsSignature: boolean;
  signature: number[];
  dddFormat: string;
  selectCommand: number[];
  readCommand: number[];
  sendCommand: (command: number[]) => Promise<number[]>;
  processedData?: number[];
  decodedData?: {[key: string]: any};
  dataMapperObject: DataMapper;
  dataMapper: {
    getTachographCardType: (type: string) => string;
    getNation: (nationCode: string) => string;
    getEventFaultType: (type: string) => string;
    getSlotValue: (slotCode: string) => string;
    getDrivingStatus: (status: string) => string;
    getCardStatus: (status: string) => string;
    getActivity: (activityCode: string) => string;
    getRegion: (regionCode: string) => string;
    getSpecialCondition: (condition: string) => string;
    getTypeWorkPeriod: (period: string) => string;
    getControlType: (binaryRepr: string) => Record<string, string>;
  };
  decodersMapper: {
    decodeOctetString: (encodedData: number[]) => string;
    decodeToAscii: (encodedData: number[]) => string;
    decodeToInt: (encodedData: number[]) => number;
    decodeToDate: (encodedData: number[], onlyDate?: boolean) => string;
  };

  constructor(
    name: string,
    fileId: number[],
    fileSize: number,
    dataFields: DataFields,
    needsSignature: boolean = false,
    sendCommand: (command: number[]) => Promise<number[]>,
  ) {
    this.name = name;
    this.fileId = fileId;
    this.fileSize = fileSize;
    this.dataFields = dataFields;
    this.sendCommand = sendCommand;
    this.needsSignature = needsSignature;
    this.signature = [];
    this.commandData = {
      select_tacho_app: [
        0x00, 0xa4, 0x04, 0x0c, 0x06, 0xff, 0x54, 0x41, 0x43, 0x48, 0x4f,
      ],
      hash_file: [0x80, 0x2a, 0x90, 0x00],
      compute_digital_signature: [0x00, 0x2a, 0x9e, 0x9a, 0x80],
      select_command_prefix: [0x00, 0xa4, 0x02, 0x0c, 0x02],
      read_binary_prefix: [0x00, 0xb0],
      default_offset: [0x00, 0x00],
    };
    this.statusData = {
      success_command: [144, 0],
    };

    this.selectCommand = this.createSelectCommand(this.fileId);
    this.readCommand = this.createReadBinaryCommand(
      this.commandData.default_offset,
      this.fileSize,
    );

    this.dataMapperObject = new DataMapper();
    this.dataMapper = {
      getTachographCardType: this.dataMapperObject.getTachographCardType,
      getNation: this.dataMapperObject.getNation,
      getEventFaultType: this.dataMapperObject.getEventFaultType,
      getSlotValue: this.dataMapperObject.getSlotValue,
      getDrivingStatus: this.dataMapperObject.getDrivingStatus,
      getCardStatus: this.dataMapperObject.getCardStatus,
      getActivity: this.dataMapperObject.getActivity,
      getRegion: this.dataMapperObject.getRegion,
      getSpecialCondition: this.dataMapperObject.getSpecialCondition,
      getTypeWorkPeriod: this.dataMapperObject.getTypeWorkPeriod,
      getControlType: this.dataMapperObject.getControlType,
    };

    this.decodersMapper = {
      decodeOctetString: this.decodeOctetString,
      decodeToAscii: this.decodeToAscii,
      decodeToInt: this.decodeToInt,
      decodeToDate: this.decodeToDate,
    };
  }

  async readData() {
    try {
      await this.sendCommand(this.selectCommand);
    } catch (error) {
      console.error('Error in selectCommand:', error);
    }
    if (this.needsSignature) {
      try {
        await this.sendCommand(this.getHashDataCommand());
        this.signature = await this.sendCommand(
          this.getDigitalSignatureCommand(),
        );
      } catch (error) {
        console.error('Error in signature commands:', error);
      }
    }
    try {
      this.processedData = await this.sendCommand(this.readCommand);
      this.decodedData = this.decodeData();
      this.dddFormat = this.convertToDdd();
    } catch (error) {
      console.error('Error in reading or decoding data:', error);
    }
  }

  decodeData() {
    if (!this.processedData) {
      throw new Error('No data to decode');
    }

    const decoded: {[key: string]: any} = {};

    for (const key in this.dataFields) {
      const {position, decoder, mapper} = this.dataFields[key];
      const [start, end] = position;

      const slice = this.processedData.slice(start, end);

      decoded[key] = this.decodersMapper[decoder](slice);

      if (mapper) {
        decoded[key] = this.dataMapper[mapper](decoded[key]);
      }
    }

    return decoded;
  }

  createSelectCommand = (fileId: number[]): number[] => [
    ...this.commandData.select_command_prefix,
    ...fileId,
  ];

  createReadBinaryCommand = (
    offset: number[],
    expected_bytes: number,
  ): number[] => {
    return [...this.commandData.read_binary_prefix, ...offset, expected_bytes];
  };

  getDigitalSignatureCommand = (): number[] =>
    this.commandData.compute_digital_signature;

  getHashDataCommand = (): number[] => this.commandData.hash_file;

  decodeOctetString = (encodedData: number[]): string => {
    const decodedData = encodedData
      .map(octet => octet.toString(16).padStart(2, '0'))
      .join('');
    return decodedData.trim();
  };

  decodeToAscii = (encodedData: number[]): string => {
    const decodedString = encodedData
      .map(byte => String.fromCharCode(byte))
      .join('');

    return decodedString
      .replace(/^\x01+/, '')
      .replace(/^\x02+/, '')
      .trim();
  };

  decodeToInt = (encodedData: number[]): number => {
    const byteData = new Uint8Array(encodedData);
    return parseInt(byteData.join(''), 10);
  };

  decodeToDate = (encodedData: number[], onlyDate = false): string => {
    if (encodedData.length !== 4) {
      throw new Error(
        'encodedData must be exactly 4 bytes long to decode into a date.',
      );
      return '';
    }

    const hexString = this.decodeOctetString(encodedData);

    if (!onlyDate) {
      const timestamp = parseInt(hexString, 16);
      const date = new Date(timestamp * 1000);
      return date.toISOString();
    } else {
      const year = parseInt(hexString.slice(0, 4), 16);
      const month = parseInt(hexString.slice(4, 6), 16);
      const day = parseInt(hexString.slice(6, 8), 16);
      const date = new Date(year, month - 1, day);
      return date.toISOString().split('T')[0].trim();
    }
  };

  hexToBigEndian(hex) {
    if (hex.startsWith('0x')) {
      hex = hex.slice(2);
    }

    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }

    return hex.toUpperCase().padStart(4, '0');
  }

  getSignature() {
    const signature = `${this.fileId[0]
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()}${this.fileId[1]
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()}${(0x01).toString(16).padStart(2, '0').toUpperCase()}`;

    const signatureSize = (128).toString(16).padStart(4, '0').toUpperCase();

    const combinedSignature =
      signature +
      signatureSize +
      this.signature
        .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
        .join('');

    return combinedSignature;
  }

  convertToDdd() {
    const tag = `${this.fileId[0]
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()}${this.fileId[1]
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()}${(0x00).toString(16).padStart(2, '0').toUpperCase()}`;

    const fileHeader = tag + this.hexToBigEndian(this.fileSize.toString(16));

    let fileData;
    if (!this.processedData || this.processedData.length === 0) {
      fileData = '00'.repeat(this.fileSize);
    } else {
      fileData = this.processedData
        .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
        .join('');
    }

    let formattedForDDD = fileHeader + fileData;

    if (this.needsSignature) {
      formattedForDDD += this.getSignature();
    }

    return formattedForDDD.toLowerCase();
  }
}

export class DynamicCardFile extends CardFile {
  readingSpeed: number;

  constructor(
    name: string,
    fileId: number[],
    fileSize: number,
    dataFields: DataFields,
    needsSignature: boolean = false,
    sendCommand: (command: number[]) => Promise<number[]>,
    readingSpeed: number,
  ) {
    super(name, fileId, fileSize, dataFields, needsSignature, sendCommand);
    this.readingSpeed = readingSpeed;
  }

  hexToBigEndian(hex) {
    if (hex.startsWith('0x')) {
      hex = hex.slice(2);
    }

    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }

    return hex.toUpperCase().padStart(4, '0');
  }

  convertToDdd() {
    let fileData;
    if (!this.processedData || this.processedData.length === 0) {
      fileData = '00'.repeat(this.fileSize);
    } else {
      fileData = this.processedData
        .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
        .join('');

      if (self.fileSize > this.processedData.length) {
        fileData += '00'.repeat(self.fileSize - fileData.length);
      }
    }

    const tag = `${this.fileId[0]
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()}${this.fileId[1]
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()}${(0x00).toString(16).padStart(2, '0').toUpperCase()}`;

    const fileHeader = tag + this.hexToBigEndian(this.fileSize.toString(16));

    let formattedForDDD = fileHeader + fileData;

    if (this.needsSignature) {
      formattedForDDD += this.getSignature();
    }

    return formattedForDDD.toLowerCase();
  }

  async readData() {
    const readData: number[] = [];
    try {
      await this.sendCommand(this.selectCommand);

      if (this.needsSignature) {
        await this.sendCommand(this.getHashDataCommand());
        this.signature = await this.sendCommand(
          this.getDigitalSignatureCommand(),
        );
      }

      let offset = 0;

      while (readData.length != this.fileSize) {
        const readCommand = [
          ...this.commandData.read_binary_prefix,
          offset >> 8,
          offset & 0xff,
          this.readingSpeed,
        ];

        const responseData = await this.sendCommand(readCommand);

        if (!responseData.length) {
          console.log('Ending:', responseData);
          break;
        }

        readData.push(...responseData);
        offset += responseData.length;
      }

      this.processedData = readData;
      // this.decodedData = this.decodeData();
      this.dddFormat = this.convertToDdd();
      this.wasReadSuccessfully = true;
    } catch (error) {
      if (readData.length > 0) {
        this.processedData = readData;
        // this.decodedData = this.decodeData();
        this.wasReadSuccessfully = true;
      } else {
        // this.decodedData = null;
        console.error(error);
        this.wasReadSuccessfully = false;
      }
    }
  }
}
