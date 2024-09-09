import {CardFile, DynamicCardFile} from '../base/CardFile';

export class Ic extends CardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'ic',
      [0x00, 0x05],
      0x08,
      {
        ic_serial_number: {
          position: [0, 4],
          decoder: 'decodeOctetString',
        },
        ic_manufacturing_reference: {
          position: [4, 8],
          decoder: 'decodeOctetString',
        },
      },
      false,
      sendCommand,
    );
  }
}

export class Icc extends CardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'icc',
      [0x00, 0x02],
      0x19,
      {
        clock_stop: {position: [0, 1], decoder: 'decodeOctetString'},
        card_extended_serial_number: {
          position: [1, 9],
          decoder: 'decodeOctetString',
        },
        card_approval_number: {
          position: [9, 17],
          decoder: 'decodeOctetString',
        },
        card_approval_number_interpreted: {
          position: [9, 17],
          decoder: 'decodeToAscii',
        },
        card_personalizer_id: {
          position: [17, 18],
          decoder: 'decodeOctetString',
        },
        embedder_ic_assembler_id: {
          position: [18, 23],
          decoder: 'decodeOctetString',
        },
        ic_identifier: {
          position: [23, 25],
          decoder: 'decodeOctetString',
        },
      },
      false,
      sendCommand,
    );
  }
}

export class ApplicationIdentification extends CardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'application_identification',
      [0x05, 0x01],
      0x0a,
      {
        type_of_tachograph_card_id: {
          position: [0, 1],
          decoder: 'decodeOctetString',
          mapper: 'getTachographCardType',
        },
        card_structure_version: {
          position: [1, 3],
          decoder: 'decodeOctetString',
        },
        no_of_events_per_type: {
          position: [3, 4],
          decoder: 'decodeToInt',
        },
        no_of_faults_per_type: {
          position: [4, 5],
          decoder: 'decodeToInt',
        },
        activity_structure_length: {
          position: [5, 7],
          decoder: 'decodeToInt',
        },
        no_of_card_vehicle_records: {
          position: [7, 9],
          decoder: 'decodeToInt',
        },
        no_of_card_place_records: {
          position: [9, 10],
          decoder: 'decodeToInt',
        },
      },
      true,
      sendCommand,
    );
  }
}

export class CardCertificate extends CardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'card_certificate',
      [0xc1, 0x00],
      0xc2,
      {
        card_certificate: {position: [0, 194], decoder: 'decodeOctetString'},
      },
      false,
      sendCommand,
    );
  }
}

export class CaCertificate extends CardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'ca_certificate',
      [0xc1, 0x08],
      0xc2,
      {
        member_state_certificate: {
          position: [0, 194],
          decoder: 'decodeOctetString',
        },
      },
      false,
      sendCommand,
    );
  }
}

export class CardDownload extends CardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'card_download',
      [0x05, 0x0e],
      0x04,
      {
        last_card_download: {position: [0, 4], decoder: 'decodeToDate'},
      },
      true,
      sendCommand,
    );
  }
}

export class Identification extends CardFile {
  constructor(sendCommand) {
    super(
      'identification',
      [0x05, 0x20],
      0x8f,
      {
        card_issuing_member_state: {
          position: [0, 1],
          decoder: 'decodeOctetString',
          mapper: 'getNation',
        },
        card_number: {
          position: [1, 17],
          decoder: 'decodeToAscii',
        },
        card_issuing_authority_name: {
          position: [17, 53],
          decoder: 'decodeToAscii',
        },
        card_issue_date: {
          position: [53, 57],
          decoder: 'decodeToDate',
        },
        card_validity_begin: {
          position: [57, 61],
          decoder: 'decodeToDate',
        },
        card_expiry_date: {
          position: [61, 65],
          decoder: 'decodeToDate',
        },
        card_holder_surname: {
          position: [65, 101],
          decoder: 'decodeToAscii',
        },
        card_holder_firstnames: {
          position: [101, 137],
          decoder: 'decodeToAscii',
        },
        card_holder_birth_date: {
          position: [137, 141],
          decoder: 'decodeToDate',
          onlyDate: true,
        },
        card_holder_preferred_language: {
          position: [141, 143],
          decoder: 'decodeToAscii',
        },
      },
      true,
      sendCommand,
    );
  }
}

export class DrivingLicenceInfo extends CardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'driving_licence_info',
      [0x05, 0x21],
      0x35,
      {
        driving_licence_issuing_authority: {
          position: [0, 36],
          decoder: 'decodeToAscii',
        },
        driving_licence_issuing_nation: {
          position: [36, 37],
          decoder: 'decodeOctetString',
          mapper: 'getNation',
        },
        driving_licence_number: {
          position: [37, 53],
          decoder: 'decodeToAscii',
        },
      },
      false,
      sendCommand,
    );
  }
}

export class CurrentUsage extends CardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'current_usage',
      [0x05, 0x07],
      0x13,
      {
        session_open_time: {position: [0, 4], decoder: 'decodeToDate'},
        vehicle_registration_nation: {
          position: [4, 5],
          decoder: 'decodeOctetString',
          mapper: 'getNation',
        },
        vehicle_registration_number: {
          position: [5, 19],
          decoder: 'decodeToAscii',
        },
      },
      false,
      sendCommand,
    );
  }
}

export class ControlActivityData extends CardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'control_activity_data',
      [0x05, 0x08],
      0x2e,
      {
        control_type: {
          position: [0, 1],
          decoder: 'decodeOctetString',
          mapper: 'getControlType',
        },
        control_time: {position: [1, 5], decoder: 'decodeToDate'},
        card_type: {
          position: [5, 6],
          decoder: 'decodeOctetString',
          mapper: 'getTachographCardType',
        },
        card_issuing_member_state: {
          position: [6, 7],
          decoder: 'decodeOctetString',
          mapper: 'getNation',
        },
        card_number: {position: [7, 23], decoder: 'decodeToAscii'},
        vechicle_registration_nation: {
          position: [23, 24],
          decoder: 'decodeOctetString',
        },
        vehicle_registration_number: {
          position: [24, 38],
          decoder: 'decodeToAscii',
        },
        control_download_period_begin: {
          position: [38, 42],
          decoder: 'decodeToDate',
        },
        control_download_period_end: {
          position: [42, 46],
          decoder: 'decodeToDate',
        },
      },
      true,
      sendCommand,
    );
  }
}

export class EventsData extends DynamicCardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'events_data',
      [0x05, 0x02],
      0x6c0,
      {
        event_type: {position: [0, 1], decoder: 'decodeToInt'},
        begin_time: {position: [1, 5], decoder: 'decodeToDate'},
        end_time: {position: [5, 9], decoder: 'decodeToDate'},
        vehicle_registration_nation: {
          position: [9, 10],
          decoder: 'decodeOctetString',
        },
        vehicle_registration_number: {
          position: [10, 24],
          decoder: 'decodeToAscii',
        },
      },
      true,
      sendCommand,
      0x40,
    );
  }

  decodeData() {
    const defaultTime = '1970-01-01T00:00:00.000Z';

    if (!this.processedData) {
      throw new Error('No data to decode');
    }

    const decoded = [];

    for (let i = 0; i < this.processedData.length; i += 24) {
      const record = this.processedData.slice(i, i + 24);

      const decodedRecord = {};

      for (const key in this.dataFields) {
        const {position, decoder, mapper} = this.dataFields[key];
        const [start, end] = position;

        const slice = record.slice(start, end);

        let decodedValue = this.decodersMapper[decoder](slice);

        if (mapper) {
          decodedValue = this.dataMapper[mapper](decodedValue);
        }

        decodedRecord[key] = decodedValue;
      }

      if (decodedRecord.begin_time === defaultTime) {
        continue;
      }

      decoded.push(decodedRecord);
    }

    decoded.sort((a, b) => new Date(a.begin_time) - new Date(b.begin_time));

    return decoded;
  }
}

export class FaultsData extends DynamicCardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'faults_data',
      [0x05, 0x03],
      0x480,
      {
        fault_type: {position: [0, 1], decoder: 'decodeToInt'},
        begin_time: {position: [1, 5], decoder: 'decodeToDate'},
        end_time: {position: [5, 9], decoder: 'decodeToDate'},
        vehicle_registration_nation: {
          position: [9, 10],
          decoder: 'decodeOctetString',
        },
        vehicle_registration_number: {
          position: [10, 24],
          decoder: 'decodeToAscii',
        },
      },
      true,
      sendCommand,
      0x40,
    );
  }

  decodeData() {
    const defaultTime = '1970-01-01T00:00:00.000Z';

    if (!this.processedData) {
      throw new Error('No data to decode');
    }

    const decoded = [];

    for (let i = 0; i < this.processedData.length; i += 24) {
      const record = this.processedData.slice(i, i + 24);

      const decodedRecord = {};

      for (const key in this.dataFields) {
        const {position, decoder, mapper} = this.dataFields[key];
        const [start, end] = position;

        const slice = record.slice(start, end);

        let decodedValue = this.decodersMapper[decoder](slice);

        if (mapper) {
          decodedValue = this.dataMapper[mapper](decodedValue);
        }

        decodedRecord[key] = decodedValue;
      }

      if (decodedRecord.begin_time === defaultTime) {
        continue;
      }

      decoded.push(decodedRecord);
    }

    decoded.sort((a, b) => new Date(a.begin_time) - new Date(b.begin_time));

    return decoded;
  }
}

export class DriverActivityData extends DynamicCardFile {
  constructor(sendCommand) {
    super(
      'driver_activity_data',
      [0x05, 0x04],
      0x35d4,
      {
        previous_length: {
          position: [0, 2],
          decoder: 'decodeToInt',
        },
        record_length: {
          position: [2, 4],
          decoder: 'decodeToInt',
        },
        date: {
          position: [4, 8],
          decoder: 'decodeToDate',
        },
        presence_counter: {
          position: [8, 10],
          decoder: 'decodeToInt',
        },
        day_distance: {
          position: [10, 12],
          decoder: 'decodeToInt',
        },
      },
      true,
      sendCommand,
      0x41,
    );
  }

  decodeData() {
    if (!this.processedData) {
      throw new Error('No data to decode');
    }

    const DEFAULT_CARD_DATE = '1970-01-01T00:00:00.000Z';

    const newestRecordPointer = this.decodersMapper.decodeToInt(
      this.processedData.slice(2, 4),
    );
    const oldestRecordPointer = this.decodersMapper.decodeToInt(
      this.processedData.slice(0, 2),
    );

    let readData = this.processedData.slice(4);

    let pointer = newestRecordPointer;
    const dataLength = readData.length;
    const records = [];

    while (true) {
      if (pointer < 0) {
        pointer = dataLength + pointer;
      }

      const generalInfoEnd = pointer + 12;
      const record = this.decodeGeneralActivityInfo(
        readData.slice(pointer, generalInfoEnd + 1),
      );

      if (record.date === DEFAULT_CARD_DATE) {
        break;
      }

      const activityChangeInfoStart = generalInfoEnd;
      const activityChangeInfoEnd =
        generalInfoEnd + (record.record_length - 12);

      const activityChangeData = readData.slice(
        activityChangeInfoStart,
        activityChangeInfoEnd,
      );

      record.activity_changes =
        this.decodeActivityChangeInfo(activityChangeData);

      records.push(record);

      if (pointer === oldestRecordPointer || record.previous_length === 0) {
        break;
      }

      pointer -= record.previous_length;
    }

    records.sort((a, b) => new Date(a.date) - new Date(b.date));

    return records;
  }

  decodeGeneralActivityInfo(data) {
    const previousLength = this.decodersMapper.decodeToInt(data.slice(0, 2));
    const recordLength = this.decodersMapper.decodeToInt(data.slice(2, 4));
    const date = this.decodersMapper.decodeToDate(data.slice(4, 8));
    const presenceCounter = this.decodersMapper.decodeToInt(data.slice(8, 10));
    const dayDistance = this.decodersMapper.decodeToInt(data.slice(10, 12));

    return {
      previous_length: previousLength,
      record_length: recordLength,
      date: date,
      presence_counter: presenceCounter,
      day_distance: dayDistance,
    };
  }

  decodeActivityChangeInfo(data) {
    const activities = [];
    const step = 2;

    for (let i = 0; i < data.length; i += step) {
      const record = data.slice(i, i + step);
      const hexStr = this.decodersMapper.decodeOctetString(record);
      const binaryStr = parseInt(hexStr, 16).toString(2).padStart(16, '0');

      const slot = binaryStr[4];
      const drivingStatus = binaryStr[5];
      const cardStatus = binaryStr[6];
      const activity = binaryStr.slice(7, 9);

      const slotValue = this.dataMapper.getSlotValue(slot);
      const drivingStatusValue =
        this.dataMapper.getDrivingStatus(drivingStatus);
      const cardStatusValue = this.dataMapper.getCardStatus(cardStatus);
      const activityValue = this.dataMapper.getActivity(activity);

      const timeOfChangeBits = binaryStr.slice(-11);
      const hours = parseInt(timeOfChangeBits.slice(0, 5), 2);
      const minutes = parseInt(timeOfChangeBits.slice(5), 2);

      const timeOfChange = new Date();
      timeOfChange.setHours(hours);
      timeOfChange.setMinutes(minutes);

      activities.push({
        slot: slotValue,
        driving_status: drivingStatusValue,
        card_status: cardStatusValue,
        activity: activityValue,
        time_of_change: timeOfChange.toISOString().slice(11, 16),
      });
    }

    return activities;
  }
}

export class VehiclesUsed extends DynamicCardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'vehicles_used',
      [0x05, 0x05],
      0x183a,
      {
        vehicle_odometer_begin: {
          position: [0, 3],
          decoder: 'decodeToInt',
        },
        vehicle_odometer_end: {
          position: [3, 6],
          decoder: 'decodeToInt',
        },
        vehicle_first_use: {
          position: [6, 10],
          decoder: 'decodeToDate',
        },
        vehicle_last_use: {
          position: [10, 14],
          decoder: 'decodeToDate',
        },
        vehicle_registration_nation: {
          position: [14, 15],
          decoder: 'decodeOctetString',
          mapper: 'getNation',
        },
        vehicle_registration_number: {
          position: [15, 29],
          decoder: 'decodeToAscii',
        },
        vehicle_data_counter: {
          position: [29, 31],
          decoder: 'decodeToInt',
        },
      },
      true,
      sendCommand,
      0xe,
    );
  }

  decodeData() {
    const defaultTime = '1970-01-01T00:00:00.000Z';

    if (!this.processedData) {
      throw new Error('No data to decode');
    }

    const decoded = [];

    for (let i = 2; i < this.processedData.length; i += 31) {
      const record = this.processedData.slice(i, i + 31);

      if (record.length != 31) {
        break;
      }

      const decodedRecord = {};

      for (const key in this.dataFields) {
        const {position, decoder, mapper} = this.dataFields[key];
        const [start, end] = position;

        const slice = record.slice(start, end);

        let decodedValue = this.decodersMapper[decoder](slice);

        if (mapper) {
          decodedValue = this.dataMapper[mapper](decodedValue);
        }

        decodedRecord[key] = decodedValue;
      }

      if (
        decodedRecord.vehicle_first_use === defaultTime ||
        decodedRecord.vehicle_last_use === defaultTime
      ) {
        continue;
      }

      decoded.push(decodedRecord);
    }

    return decoded;
  }
}

export class Places extends DynamicCardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'places',
      [0x05, 0x06],
      0x461,
      {
        entry_time: {
          position: [0, 4],
          decoder: 'decodeToDate',
        },
        entry_type_work_period: {
          position: [4, 5],
          decoder: 'decodeOctetString',
          mapper: 'getTypeWorkPeriod',
        },
        daily_work_period_country: {
          position: [5, 6],
          decoder: 'decodeOctetString',
          mapper: 'getNation',
        },
        daily_work_period_region: {
          position: [6, 7],
          decoder: 'decodeOctetString',
          mapper: 'getRegion',
        },
        vehicle_odometer_value: {
          position: [7, 10],
          decoder: 'decodeToInt',
        },
      },
      true,
      sendCommand,
      0x3b,
    );
  }

  decodeData() {
    const defaultTime = '1970-01-01T00:00:00.000Z';

    if (!this.processedData) {
      throw new Error('No data to decode');
    }

    const decoded = [];

    for (let i = 1; i < this.processedData.length; i += 10) {
      const record = this.processedData.slice(i, i + 10);

      if (record.length != 10) {
        break;
      }

      const decodedRecord = {};

      for (const key in this.dataFields) {
        const {position, decoder, mapper} = this.dataFields[key];
        const [start, end] = position;

        const slice = record.slice(start, end);

        let decodedValue = this.decodersMapper[decoder](slice);

        if (mapper) {
          decodedValue = this.dataMapper[mapper](decodedValue);
        }

        decodedRecord[key] = decodedValue;
      }

      if (decodedRecord.entry_time === defaultTime) {
        continue;
      }

      decoded.push(decodedRecord);
    }

    return decoded;
  }
}

export class SpecificConditions extends DynamicCardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'specific_conditions',
      [0x05, 0x22],
      0x118,
      {
        entry_time: {
          position: [0, 4],
          decoder: 'decodeToDate',
        },
        condition_type: {
          position: [4, 5],
          decoder: 'decodeOctetString',
          mapper: 'getSpecialCondition',
        },
      },
      true,
      sendCommand,
      0x1c,
    );
  }

  decodeData() {
    const defaultTime = '1970-01-01T00:00:00.000Z';

    if (!this.processedData) {
      throw new Error('No data to decode');
    }

    const decoded = [];

    for (let i = 0; i < this.fileSize; i += 5) {
      const record = this.processedData.slice(i, i + 5);

      if (record.length != 5) {
        continue;
      }

      const decodedRecord = {};

      for (const key in this.dataFields) {
        const {position, decoder, mapper} = this.dataFields[key];
        const [start, end] = position;

        const slice = record.slice(start, end);

        let decodedValue = this.decodersMapper[decoder](slice);

        if (mapper) {
          decodedValue = this.dataMapper[mapper](decodedValue);
        }

        decodedRecord[key] = decodedValue;
      }

      if (decodedRecord.entry_time === defaultTime) {
        continue;
      }

      decoded.push(decodedRecord);
    }

    return decoded;
  }
}
