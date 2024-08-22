import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {styled} from 'nativewind';
import {useTranslation} from 'react-i18next';

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);

const FaqModal = () => {
  const {t} = useTranslation();

  const qs = {
    'Czy jest dostępna wersja aplikacji dla systemu Windows lub iOS?':
      'Obecnie poza wersją na Androida nie mamy możliwości rozwijania naszej aplikacji na inne systemy operacyjne.',
    'Czy mój telefon nadaje się do odczytu karty kierowcy?':
      'Telefony same w sobie nie nadają się do odczytu karty kierowcy, potrzebny będzie czytnik kart USB zgodny z CCID (Chip Card Interface Device). Musisz podłączyć go do kompatybilnego złącza USB telefonu OTG (On-The-Go). Istnieje kilka typów złączy USB (typ A, typ C, mikro), więc do podłączenia czytnika kart do telefonu może być potrzebny konwerter.',
    'Ile różnych kart kierowców mogę odczytać za pomocą aplikacji?':
      'Obecnie nie ma limitu.',
  };

  return (
    <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
      <StyledView className="gap-12 py-4">
        {Object.keys(qs).map(q => (
          <StyledView key={q}>
            <StyledText className="font-bold color-darkPurple text-center mb-2">
              {t(q)}
            </StyledText>
            <StyledText className="color-darkPurple text-center">
              {t(qs[q])}
            </StyledText>
          </StyledView>
        ))}
      </StyledView>
    </StyledScrollView>
  );
};

export default FaqModal;
