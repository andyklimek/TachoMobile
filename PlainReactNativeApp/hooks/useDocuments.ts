import {useState, useEffect} from 'react';
import axiosInstance from '@/utils/axiosConfig';

const keyToTitleMapper = {
  card_ca_certificate: 'Certyfikat CA Karty',
  certificate: 'Certyfikat',
  card_certificate: 'Certyfikat Karty',
  card_identification: 'Identyfikacja Karty',
  card_expiry_date: 'Data Ważności Karty',
  card_holder_birth_date: 'Data Urodzenia Posiadacza Karty',
  card_holder_firstnames: 'Imiona Posiadacza Karty',
  card_holder_prefered_language: 'Preferowany Język Posiadacza Karty',
  card_holder_surname: 'Nazwisko Posiadacza Karty',
  card_issue_date: 'Data Wydania Karty',
  card_issuing_authority_name: 'Nazwa Organów Wydających Karty',
  card_issuing_member_state: 'Państwo Członkowskie Wydające Kartę',
  card_number: 'Numer Karty',
  card_validity_begin: 'Początek Ważności Karty',
  driving_licence: 'Prawo Jazdy',
  driving_licence_issuing_authority: 'Organ Wydający Prawo Jazdy',
  driving_licence_issuing_nation: 'Kraj Wydania Prawa Jazdy',
  driving_licence_number: 'Numer Prawa Jazdy',
  ic_file: 'Plik IC',
  ic_manufacturing_reference: 'Referencja Produkcji IC',
  ic_serial_number: 'Numer Seryjny IC',
  icc_file: 'Plik ICC',
  card_approval_number: 'Numer Zatwierdzenia Karty',
  card_extended_serial_number: 'Rozszerzony Numer Seryjny Karty',
  card_personalizer_id: 'Identyfikator Personalizatora Karty',
  embedder_ic_assembler_id: 'Identyfikator Montażysty IC',
  ic_identifier: 'Identyfikator IC',
  updated_at: 'Data Aktualizacji',
  user_id: 'Identyfikator Użytkownika',
  id: 'Identyfikator',
};

const translateKey = key => keyToTitleMapper[key] || key;

const transformData = data => {
  const transformed = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (typeof data[key] === 'object') {
        transformed[translateKey(key)] = transformData(data[key]);
      } else {
        transformed[translateKey(key)] = data[key];
      }
    }
  }
  return transformed;
};

const useDocuments = (id: number) => {
  const [documents, setDocuments] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/driver-card/${id}/`);
      const data = response.data.data;

      setDocuments(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentsRefresh = async () => {
    try {
      const response = await axiosInstance.get(`/driver-card/${id}/`);
      const data = response.data.data;

      setDocuments(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching documents');
    }
  };

  useEffect(() => {
    if (id) {
      fetchDocuments(id);
    }
  }, [id]);

  return {
    documents,
    loading,
    error,
    transformData,
    translateKey,
    fetchDocumentsRefresh,
  };
};

export default useDocuments;
