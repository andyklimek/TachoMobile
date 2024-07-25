import * as FileSystem from "expo-file-system";
import Identification from "./files/Identification";

export default class TachoParser {
  identification: Identification;

  constructor(private fileUri: string) {}

  private base64ToBytes(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private bytesToHex(bytes: Uint8Array): string {
    return Array.prototype.map
      .call(bytes, (byte) => {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
      })
      .join("");
  }

  async readFile(): Promise<string> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(this.fileUri);
      if (!fileInfo.exists) {
        throw new Error(`File does not exist at ${this.fileUri}`);
      }

      const { uri } = fileInfo;
      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const bytes = this.base64ToBytes(fileBase64);

      const hex = this.bytesToHex(bytes);

      return hex;
    } catch (error) {
      console.error("Error reading file:", error);
      throw error;
    }
  }

  getFileDataSlice(hexData: string, fileId: string, fileLen: number): string {
    const startIndex = hexData.search(fileId) + 8; // +8 means that we are skipping signature bytes
    const endIndex = startIndex + fileLen;
    return hexData.slice(startIndex, endIndex);
  }

  async readTachoFiles() {
    const hexData = await this.readFile();

    const identificationDataSlice = this.getFileDataSlice(
      hexData,
      Identification.id,
      Identification.dataLen
    );
    this.identification = new Identification(identificationDataSlice);
  }
}
