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
      0x8f, // 143 in decimal
      {
        card_issuing_member_state: {
          position: [0, 1], // Same as slice(0, 1) in Python
          decoder: 'decodeOctetString',
        },
        card_number: {
          position: [1, 17], // Same as slice(1, 17) in Python
          decoder: 'decodeToAscii',
        },
        card_issuing_authority_name: {
          position: [17, 53], // Same as slice(17, 53) in Python
          decoder: 'decodeToAscii',
        },
        card_issue_date: {
          position: [53, 57], // Same as slice(53, 57) in Python
          decoder: 'decodeToDate',
        },
        card_validity_begin: {
          position: [57, 61], // Same as slice(57, 61) in Python
          decoder: 'decodeToDate',
        },
        card_expiry_date: {
          position: [61, 65], // Same as slice(61, 65) in Python
          decoder: 'decodeToDate',
        },
        card_holder_surname: {
          position: [65, 101], // Note: slice(0, 36) within the name structure in Python
          decoder: 'decodeToAscii',
        },
        card_holder_firstnames: {
          position: [101, 137], // Note: slice(36, 72) within the name structure in Python
          decoder: 'decodeToAscii',
        },
        card_holder_birth_date: {
          position: [137, 141], // Same as slice(72, 76) in Python
          decoder: 'decodeToDate',
        },
        card_holder_preferred_language: {
          position: [141, 143], // Same as slice(76, 78) in Python
          decoder: 'decodeToAscii',
        },
      },
      true, // Requires a signature
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
        // TODO - Fields are not correct
        event_type: {position: [0, 1], decoder: 'decodeToInt'},
        begin_time: {position: [1, 5], decoder: 'decodeToDateTime'},
        end_time: {position: [5, 9], decoder: 'decodeToDateTime'},
        vehicle_registration_nation: {
          position: [9, 10],
          decoder: 'decodeOctetString',
        },
        vehicle_registration_number: {
          position: [10, 24],
          decoder: 'decodeToAscii',
        },
        // event_data: {position: [14, 15], decoder: 'decodeToInt'},
      },
      true,
      sendCommand,
      0x40,
    );
  }
}

export class FaultsData extends DynamicCardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'faults_data',
      [0x05, 0x03],
      0x480,
      {
        // TODO - Fields are not correct
        fault_type: {position: [0, 1], decoder: 'decodeToInt'},
        begin_time: {position: [1, 5], decoder: 'decodeToDateTime'},
        end_time: {position: [5, 9], decoder: 'decodeToDateTime'},
        vehicle_registration_nation: {
          position: [9, 10],
          decoder: 'decodeOctetString',
        },
        vehicle_registration_number: {
          position: [10, 24],
          decoder: 'decodeToAscii',
        },
        // fault_data: {position: [14, 15], decoder: 'decodeToInt'},
      },
      true,
      sendCommand,
      0x40,
    );
  }
}

export class DriverActivityData extends DynamicCardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'driver_activity_data',
      [0x05, 0x04],
      0x35d4,
      {
        // TODO - Fields are not correct
        activity_type: {position: [0, 1], decoder: 'decodeToInt'},
        begin_time: {position: [1, 5], decoder: 'decodeToDateTime'},
        end_time: {position: [5, 9], decoder: 'decodeToDateTime'},
        vehicle_registration_nation: {
          position: [9, 10],
          decoder: 'decodeOctetString',
        },
        vehicle_registration_number: {
          position: [10, 24],
          decoder: 'decodeToAscii',
        },
        // activity_data: {position: [14, 15], decoder: 'decodeToInt'},
      },
      true,
      sendCommand,
      0x41,
    );
  }
}

export class VehiclesUsed extends DynamicCardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'vehicles_used',
      [0x05, 0x05],
      0x183a,
      {
        // TODO - Fields are not correct
        vehicle_registration_nation: {
          position: [0, 1],
          decoder: 'decodeOctetString',
        },
        vehicle_registration_number: {
          position: [1, 15],
          decoder: 'decodeToAscii',
        },
        vehicle_last_entry_time: {
          position: [15, 19],
          decoder: 'decodeToDateTime',
        },
        vehicle_first_exit_time: {
          position: [19, 23],
          decoder: 'decodeToDateTime',
        },
      },
      true,
      sendCommand,
      0xe,
    );
  }
}

export class Places extends DynamicCardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'places',
      [0x05, 0x06],
      0x461,
      {
        // TODO - Fields are not correct
        place_registration_nation: {
          position: [0, 1],
          decoder: 'decodeOctetString',
        },
        place_registration_number: {
          position: [1, 15],
          decoder: 'decodeToAscii',
        },
        place_last_entry_time: {
          position: [15, 19],
          decoder: 'decodeToDateTime',
        },
        place_first_exit_time: {
          position: [19, 23],
          decoder: 'decodeToDateTime',
        },
      },
      true,
      sendCommand,
      0x3b,
    );
  }
}

export class SpecificConditions extends DynamicCardFile {
  constructor(sendCommand: (command: number[]) => Promise<number[]>) {
    super(
      'specific_conditions',
      [0x05, 0x22],
      0x118,
      {
        // TODO - Fields are not correct
        specific_condition_type: {
          position: [0, 1],
          decoder: 'decodeOctetString',
        },
        specific_condition_start_time: {
          position: [1, 5],
          decoder: 'decodeToDateTime',
        },
        specific_condition_end_time: {
          position: [5, 9],
          decoder: 'decodeToDateTime',
        },
      },
      true,
      sendCommand,
      0x1c,
    );
  }
}
