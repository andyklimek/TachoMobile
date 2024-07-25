export default class Identification {
  static dataLen = 143;
  static id = "0520";

  // Slice definitions for card data
  static CARD_IDENTIFICATION = [0, 65];
  static CARD_ISSUING_MEMBER_STATE = [0, 1];
  static CARD_NUMBER = [1, 17];
  static CARD_ISSUING_AUTHORITY_NAME = [17, 53];
  static CARD_ISSUE_DATE = [53, 57];
  static CARD_VALIDITY_BEGIN = [57, 61];
  static CARD_EXPIRY_DATE = [61, 65];

  // Slice definitions for driver card holder data
  static DRIVER_CARD_HOLDER_IDENTIFICATION = [65, 143];
  static CARD_HOLDER_NAME = [0, 72];
  static CARD_HOLDER_SURNAME = [0, 36];
  static CARD_HOLDER_FIRSTNAMES = [36, 72];
  static CARD_HOLDER_BIRTH_DATE = [72, 76];
  static CARD_HOLDER_PREFERRED_LANGUAGE = [76, 78];

  hexData: string;
  constructor(hexData: string) {
    this.hexData = hexData;
    console.log(hexData.length);
  }
}
