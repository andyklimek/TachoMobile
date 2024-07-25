import React, { useState } from 'react';
import data from '@/dokumenty.json';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import Button from '@/components/Button/Button';
import ExpandedData from '@/components/ExpandedData/ExpandedData';
import NoContent from '@/components/NoContent/NoContent';
import BackBtn from '@/components/BackBtn/BackBtn';
import moment from 'moment';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

const DocumentsScreen = () => {
  const [expanded, setExpanded] = useState([]);

  const documentsData = data?.data;

  const keysToFilter = ['id', 'user_id', 'updated_at'];
  const documentsKeys = Object.keys(documentsData).filter((key) => keysToFilter.indexOf(key) === -1);

  const handlePress = (idx: number) => {
    if (expanded.includes(idx)) {
      setExpanded(expanded.filter((item) => item !== idx));
    } else {
      setExpanded([...expanded, idx]);
    }
  };

  const namesMapper = (name: string, data: Record<string, any>): string => {
    let newName: string = '';

    if (!data[name]) {
      newName = name;
    }

    switch (name) {
      case 'card_extended_serial_number':
        newName = 'numer_seryjny_karty';
        break;
      case 'card_approval_number':
        newName = 'numer_zatwierdzenia_karty';
        break;
      case 'ic_identifier':
        newName = 'identyfikator_IC';
        break;
      case 'embedder_ic_assembler_id':
        newName = 'identyfikator_IC_assemblera';
        break;
      case 'card_personalizer_id':
        newName = 'identyfikator_personalizatora_karty';
        break;
      case 'ic_serial_number':
        newName = 'numer_seryjny_IC';
        break;
      case 'ic_manufacturing_reference':
        newName = 'referencja_produkcji_IC';
        break;
      case 'certificate':
        newName = 'certyfikat';
        break;
      case 'card_issuing_member_state':
        newName = 'wydający_państwo_członkowskie';
        break;
      case 'card_number':
        newName = 'numer_karty';
        break;
      case 'card_issuing_authority_name':
        newName = 'nazwa_wydającego_autorytetu';
        break;
      case 'card_issue_date':
        newName = 'data_wydania_karty';
        break;
      case 'card_validity_begin':
        newName = 'ważność_karty_początek';
        break;
      case 'card_expiry_date':
        newName = 'ważność_karty_koniec';
        break;
      case 'card_holder_surname':
        newName = 'nazwisko_posiadacza_karty';
        break;
      case 'card_holder_firstnames':
        newName = 'imiona_posiadacza_karty';
        break;
      case 'card_holder_birth_date':
        newName = 'data_urodzenia_posiadacza_karty';
        break;
      case 'card_holder_prefered_language':
        newName = 'preferowany_język_posiadacza_karty';
        break;
      case 'driving_licence_issuing_authority':
        newName = 'wydający_uprawnienia';
        break;
      case 'driving_licence_issuing_nation':
        newName = 'wydający_państwo';
        break;
      case 'driving_licence_number':
        newName = 'numer_uprawnienia';
        break;
      case 'id':
        newName = 'ID';
        break;
      default:
        newName = name;
    }

    const words = newName.split('_');

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(' ');
  };

  const keysMapper = (name: string): string => {
    let newKey: string = '';

    switch (name) {
      case 'id':
        newKey = 'ID';
        break;
      case 'user_id':
        newKey = 'ID_użytkownika';
        break;
      case 'updated_at':
        newKey = 'ostatnia_aktuazlizacja';
        break;
      case 'icc_file':
        newKey = 'plik_ICC';
        break;
      case 'ic_file':
        newKey = 'plik_IC';
        break;
      case 'card_certificate':
        newKey = 'certyfikat_karty';
        break;
      case 'card_ca_certificate':
        newKey = 'certyfikat_autoryzacji_karty';
        break;
      case 'card_identification':
        newKey = 'identyfikacja_karty';
        break;
      case 'driving_licence':
        newKey = 'prawo_jazdy';
        break;
      default:
        newKey = name;
    }

    const words = newKey.split('_');

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(' ');
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <BackBtn />
      <StyledScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5">
        <StyledText className="text-3xl text-darkBlue text-center px-3 mb-3">Dokumenty</StyledText>
        {documentsData['updated_at'] && (
          <StyledView className="flex flex-col">
            <StyledText className="text-lg text-darkBlue text-center px-3 mb-1">Ostatnia aktualizacja:</StyledText>
            <StyledText className="text-md text-darkBlue text-center px-3 mb-12">
              {moment(documentsData['updated_at']).format('DD.MM.YYYY HH:mm:ss')}
            </StyledText>
          </StyledView>
        )}

        {documentsKeys.length ? (
          documentsKeys.map((key, idx) => (
            <StyledView
              className="bg-white rounded-2xl shadow-md mb-6"
              key={idx + 1}
              onPress={() => console.log('clicked')}
            >
              <Button
                text={keysMapper(key)}
                onPress={() => handlePress(idx)}
                className=" bg-darkBlue py-2 rounded-2xl text-lightGray shadow-sm shadow-black"
              />
              <ExpandedData data={documentsData[key]} expanded={expanded} idx={idx} namesMapper={namesMapper} />
            </StyledView>
          ))
        ) : (
          <NoContent elementName="dokumentów" />
        )}
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default DocumentsScreen;
