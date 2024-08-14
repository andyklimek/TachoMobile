import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {styled} from 'nativewind';
import {DataElement} from '@/components';
// import {useTranslation} from 'react-i18next';

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);

const FaqModal = () => {
  //   const {t} = useTranslation();

  const qs = {
    'Czy jest dostępna wersja aplikacji dla systemu Windows lub iOS?':
      'Obecnie poza wersją na Androida nie mamy możliwości rozwijania naszej aplikacji na inne systemy operacyjne.',
  };

  return (
    <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
      {/* <StyledView>
        {Object.keys(qs).map(q => (
          <DataElement
            key={q}
            title={q}
            data={qs[q]}
            translateKey={(key: string) => key}
          />
        ))}
      </StyledView> */}
    </StyledScrollView>
  );
};

export default FaqModal;
