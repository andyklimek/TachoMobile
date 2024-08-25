import CardFile from '../base/CardFile';
import useDecoders from '@/hooks/useDecoders';

//TODO: Mappers

export class Ic extends CardFile {
  constructor() {
    const {decodeOctetString} = useDecoders();

    super(
      'ic',
      [0x00, 0x05],
      {
        ic_serial_number: {position: [0, 4], decoder: decodeOctetString},
        ic_manufacturing_reference: {
          position: [4, 8],
          decoder: decodeOctetString,
        },
      },
      false,
    );
  }
}

export class Icc extends CardFile {
  constructor() {
    const {decodeOctetString, decodeToAscii} = useDecoders();

    super(
      'icc',
      [0x00, 0x02],
      {
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
      false,
    );
  }
}

export class ApplicationIdentification extends CardFile {
  constructor() {
    const {decodeOctetString, decodeToInt} = useDecoders();

    super(
      'application_identification',
      [0x05, 0x01],
      {
        type_of_tachograph_card_id: {
          position: [0, 1],
          decoder: decodeOctetString,
          //   mapper: getTachographCardType,
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
      true,
    );
  }
}

export class CardCertificate extends CardFile {
  constructor() {
    const {decodeOctetString} = useDecoders();

    super(
      'card_certificate',
      [0xc1, 0x00],
      {
        card_certificate: {position: [0, 194], decoder: decodeOctetString},
      },
      true,
    );
  }
}

export class CaCertificate extends CardFile {
  constructor() {
    const {decodeOctetString} = useDecoders();

    super(
      'ca_certificate',
      [0xc1, 0x08],
      {
        member_state_certificate: {
          position: [0, 194],
          decoder: decodeOctetString,
        },
      },
      true,
    );
  }
}

export class Identification extends CardFile {
  constructor() {
    const {decodeOctetString, decodeToDate, decodeToAscii} = useDecoders();

    super(
      'identification',
      [0x05, 0x20],
      {
        card_issuing_member_state: {
          position: [0, 1],
          decoder: decodeOctetString,
          //   mapper: getNation,
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
      true,
    );
  }
}

export class CardDownload extends CardFile {
  constructor() {
    const {decodeToDate} = useDecoders();

    super(
      'card_download',
      [0x05, 0x0e],
      {
        last_card_download: {position: [0, 4], decoder: decodeToDate},
      },
      false,
    );
  }
}

export class DrivingLicenceInfo extends CardFile {
  constructor() {
    const {decodeToDate} = useDecoders();

    super(
      'driving_licence_info',
      [0x05, 0x21],
      {
        last_card_download: {position: [0, 4], decoder: decodeToDate},
      },
      false,
    );
  }
}
