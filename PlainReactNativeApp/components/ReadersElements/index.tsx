import React from 'react';
import {styled} from 'nativewind';
import Box from '@/components/Box';
import {View} from 'react-native';
import {Timer, Store, ShoppingBag, CircleX} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';

const StyledView = styled(View);

const readersElemsData = [
  {
    text: 'Sklep Online',
    icon: <ShoppingBag className="text-darkPurple" size={36} />,
    nav: 'https://mtacho.pl/sklep/',
  },
  {
    text: 'Allegro',
    icon: <Store className="text-darkPurple" size={36} />,
    nav: 'https://allegro.pl/uzytkownik/Tachoss',
  },
  {
    text: 'Rozliczanie czasu pracy',
    icon: <Timer className="text-darkPurple" size={36} />,
    nav: 'https://mtacho.pl/produkt/rozliczanie-czasu-pracy-kierowcow/',
  },
  {
    text: 'Naruszenia czasu pracy',
    icon: <CircleX className="text-darkPurple" size={36} />,
    nav: 'https://mtacho.pl/produkt/sprawdzanie-naruszen-czasu-pracy-itd-4/',
  },
];

const ReadersElements = () => {
  const {t} = useTranslation();
  return (
    <StyledView className="flex flex-wrap flex-row justify-between px-5">
      {readersElemsData.map((elem, idx) => (
        <Box text={t(elem.text)} icon={elem.icon} nav={elem.nav} key={idx} />
      ))}
    </StyledView>
  );
};

export default ReadersElements;
