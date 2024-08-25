import useApduCommand from '@/hooks/useApduCommand';

type BytePositionSlice = [number, number];
type decoderFunction = (data: number[]) => any;

interface DataField {
  position: BytePositionSlice;
  decoder: decoderFunction;
}

interface DataFields {
  [key: string]: DataField;
}

export default class CardFile {
  fileId: number[];
  name: string;
  needsSignature: boolean;

  dataFields: DataFields;

  selectCommand: number[];

  constructor(
    name: string,
    fileId: number[],
    dataFields: DataFields,
    needs_signature: boolean = false,
  ) {
    this.name = name;
    this.fileId = fileId;
    this.dataFields = dataFields;
    this.needsSignature = needs_signature;

    const commandBuilder = useApduCommand();
    this.selectCommand = commandBuilder.createSelectCommand(this.fileId);
  }

  getSelectCommand(): number[] {
    return this.selectCommand;
  }
}
