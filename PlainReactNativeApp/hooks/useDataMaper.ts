import {useMemo} from 'react';

type TachographCardType = '00' | '01' | '02' | '03' | '04' | '05' | '06' | '07';
type NationCode = string;
type EventFaultType = string;
type SlotValue = '0' | '1';
type DrivingStatus = '0' | '1';
type CardStatus = '0' | '1';
type ActivityType = '00' | '01' | '10' | '11';
type RegionCode = string;
type SpecialCondition = '00' | '01' | '02' | '03';
type WorkPeriod = '00' | '01' | '02' | '03' | '04' | '05';
type ControlTypeBinary = string;

export const useTachographData = () => {
  const data = useMemo(
    () => ({
      type_of_tachograph_card: {
        '00': 'Reserved',
        '01': 'Driver card',
        '02': 'Workshop card',
        '03': 'Control card',
        '04': 'Company card',
        '05': 'Manufacturing card',
        '06': 'Vehicle unit',
        '07': 'Motion sensor',
      },
      nation: {
        '00': 'No information available',
        '01': 'Austria',
        '02': 'Albania',
        '03': 'Andorra',
        '04': 'Armenia',
        '05': 'Azerbaijan',
        '06': 'Belgium',
        '07': 'Bulgaria',
        '08': 'Bosnia and Herzegovina',
        '09': 'Belarus',
        '0A': 'Switzerland',
        '0B': 'Cyprus',
        '0C': 'Czech Republic',
        '0D': 'Germany',
        '0E': 'Denmark',
        '0F': 'Spain',
        '10': 'Estonia',
        '11': 'France',
        '12': 'Finland',
        '13': 'Liechtenstein',
        '14': 'Faeroe Islands',
        '15': 'United Kingdom',
        '16': 'Georgia',
        '17': 'Greece',
        '18': 'Hungary',
        '19': 'Croatia',
        '1A': 'Italy',
        '1B': 'Ireland',
        '1C': 'Iceland',
        '1D': 'Kazakhstan',
        '1E': 'Luxembourg',
        '1F': 'Lithuania',
        '20': 'Latvia',
        '21': 'Malta',
        '22': 'Monaco',
        '23': 'Republic of Moldova',
        '24': 'The former Yugoslav Rep. of Macedonia',
        '25': 'Norway',
        '26': 'Netherlands',
        '27': 'Portugal',
        '28': 'Poland',
        '29': 'Romania',
        '2A': 'San Marino',
        '2B': 'Russian Federation',
        '2C': 'Sweden',
        '2D': 'Slovakia',
        '2E': 'Slovenia',
        '2F': 'Turkmenistan',
        '30': 'Turkey',
        '31': 'Ukraine',
        '32': 'Vatican City',
        '33': 'Serbia',
        '34': 'RFU',
        FD: 'European Community',
        FE: 'Rest of Europe',
        FF: 'Rest of the world',
      },
      tacho_work_period: {
        '00': 'Begin, related time = card insertion time or time of entry',
        '01': 'End, related time = card withdrawal time or time of entry',
        '02': 'Begin, related time manually entered (start time)',
        '03': 'End, related time manually entered (end of work period)',
        '04': 'Begin, related time assumed by VU',
        '05': 'End, related time assumed by VU',
      },
      region: {
        '00': 'No information available',
        '01': 'Andalucía',
        '02': 'Aragón',
        '03': 'Asturias',
        '04': 'Cantabria',
        '05': 'Cataluña',
        '06': 'Castilla-León',
        '07': 'Castilla-La-Mancha',
        '08': 'Valencia',
        '09': 'Extremadura',
        '0A': 'Galicia',
        '0B': 'Baleares',
        '0C': 'Canarias',
        '0D': 'La Rioja',
        '0E': 'Madrid',
        '0F': 'Murcia',
        '10': 'Navarra',
        '11': 'País Vasco',
      },
      event_fault_type: {
        '0x': 'General events',
        '00': 'No further details',
        '01': 'Insertion of a non valid card',
        '02': 'Card conflict',
        '03': 'Time overlap',
        '04': 'Driving without an appropriate card',
        '05': 'Card insertion while driving',
        '06': 'Last card session not correctly closed',
        '07': 'Over speeding',
        '08': 'Power supply interruption',
        '09': 'Motion data error',
        '0A': 'RFU',
        '0B': 'RFU',
        '0C': 'RFU',
        '0D': 'RFU',
        '0E': 'RFU',
        '0F': 'RFU',
        '1x': 'Vehicle unit related security breach attempt events',
        '10': 'No further details',
        '11': 'Motion sensor authentication failure',
        '12': 'Tachograph card authentication failure',
        '13': 'Unauthorised change of motion sensor',
        '14': 'Card data input integrity error',
        '15': 'Stored user data integrity error',
        '16': 'Internal data transfer error',
        '17': 'Unauthorised case opening',
        '18': 'Hardware sabotage',
        '19': 'RFU',
        '2x': 'Sensor related security breach attempt events',
        '20': 'No further details',
        '21': 'Authentication failure',
        '22': 'Stored data integrity error',
        '23': 'Internal data transfer error',
        '24': 'Unauthorised case opening',
        '25': 'Hardware sabotage',
        '26': 'RFU',
        '3x': 'Control device faults',
        '30': 'No further details',
        '31': 'VU internal fault',
        '32': 'Printer fault',
        '33': 'Display fault',
        '34': 'Downloading fault',
        '35': 'Sensor fault',
        '36': 'RFU',
        '4x': 'Card faults',
        '40': 'No further details',
        '41': 'RFU',
        '50': 'RFU',
      },
      slot: {'0': 'Driver', '1': 'Co-driver'},
      driving_status: {'0': 'Single', '1': 'Crew'},
      card_status: {'0': 'Inserted', '1': 'Not inserted'},
      activity: {
        '00': 'Break/Rest',
        '01': 'Availability',
        '10': 'Work',
        '11': 'Driving',
      },
      special_conditions: {
        '00': 'RFU',
        '01': 'Out of scope - Begin',
        '02': 'Out of scope - End',
        '03': 'Ferry / Train crossing',
      },
      control_type: {
        '0': {
          c: 'card not downloaded during this control activity',
          v: 'VU not downloaded during this control activity',
          p: 'no printing done during this control activity',
          d: 'no display used during this control activity',
        },
        '1': {
          c: 'card downloaded during this control activity',
          v: 'VU downloaded during this control activity',
          p: 'printing done during this control activity',
          d: 'display used during this control activity',
        },
      },
    }),
    [],
  );

  const getTachographCardType = (type: TachographCardType) =>
    data.type_of_tachograph_card[type];
  const getNation = (nationCode: NationCode) =>
    data.nation[nationCode] || 'RFU';
  const getEventFaultType = (type: EventFaultType) =>
    data.event_fault_type[type] || 'Manufacturer specific';
  const getSlotValue = (slotCode: SlotValue) => data.slot[slotCode];
  const getDrivingStatus = (status: DrivingStatus) =>
    data.driving_status[status];
  const getCardStatus = (status: CardStatus) => data.card_status[status];
  const getActivity = (activityCode: ActivityType) =>
    data.activity[activityCode];
  const getRegion = (regionCode: RegionCode) => data.region[regionCode];
  const getSpecialCondition = (condition: SpecialCondition) =>
    data.special_conditions[condition] || 'RFU';
  const getTypeWorkPeriod = (period: WorkPeriod) =>
    data.tacho_work_period[period];
  const getControlType = (binaryRepr: ControlTypeBinary) => {
    const controlTypeData: Record<string, string> = {};
    const controlDataSigns = ['c', 'v', 'p', 'd'];

    for (let i = 0; i < binaryRepr.length; i++) {
      const sign = controlDataSigns[i];
      const index = binaryRepr[i];
      controlTypeData[sign] = data.control_type[index][sign];
    }

    return controlTypeData;
  };

  return {
    data,
    getTachographCardType,
    getNation,
    getEventFaultType,
    getSlotValue,
    getDrivingStatus,
    getCardStatus,
    getActivity,
    getRegion,
    getSpecialCondition,
    getTypeWorkPeriod,
    getControlType,
  };
};
