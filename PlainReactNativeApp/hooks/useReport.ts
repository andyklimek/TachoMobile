import {useState, useEffect} from 'react';
import axiosInstance from '@/utils/axiosConfig';

const keyToTitleMapper = {
  ddd_file_url: 'Link do Pliku DDD',
  events: 'Wydarzenia',
  faults: 'Usterki',
  places: 'Miejsca',
  vehicles: 'Pojazdy',
  driver_activities: 'Aktywności Kierowcy',
  date: 'Data',
  vehicle_odometer_begin: 'Początek Licznika',
  vehicle_odometer_end: 'Koniec Licznika',
  vehicle_first_use: 'Pierwsze Użycie Pojazdu',
  vehicle_last_use: 'Ostatnie Użycie Pojazdu',
  vehicle_registration_nation: 'Kraj Rejestracji Pojazdu',
  vehicle_registration_number: 'Numer Rejestracyjny Pojazdu',
  event_type: 'Typ Wydarzenia',
  fault_type: 'Typ Naruszenia',
  begin_time: 'Czas Początkowy',
  end_time: 'Czas Końcowy',
  driving_status: 'Status Jazdy',
  card_status: 'Status Karty',
  activity: 'Aktywność',
  time_of_change: 'Czas Zmiany',
  entry_time: 'Czas Wprowadzenia',
  entry_type_work_period: 'Typ Okresu Pracy',
  daily_work_period_country: 'Kraj Okresu Pracy',
  daily_work_period_region: 'Region Okresu Pracy',
  vehicle_odometer_value: 'Wartość Licznika Pojazdu',
  slot: 'Slot',
};

const translateKey = key => keyToTitleMapper[key] || key;

const transformData = data => {
  const transformed = {};

  for (const key in data) {
    const translatedKey = translateKey(key);
    const value = data[key];

    if (key === 'vehicle_odometer_begin' || key === 'vehicle_odometer_end') {
      transformed[translatedKey] = value;
    } else if (Array.isArray(value)) {
      transformed[translatedKey] = value.map(item => transformData(item));
    } else if (typeof value === 'object' && value !== null) {
      transformed[translatedKey] = transformData(value);
    } else {
      transformed[translatedKey] = value;
    }
  }

  return transformed;
};

const useReport = (id: number) => {
  const [report, setReport] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (reportId: number, refresh: boolean = false) => {
    if (!refresh) {
      setLoading(true);
    }

    try {
      const response = await axiosInstance.get(`/report/${reportId}/`);

      const data = response.data.data;

      setReport(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReport(id);
    }
  }, [id]);

  return {
    report,
    loading,
    error,
    transformData,
    translateKey,
    fetchReport,
  };
};

export default useReport;
