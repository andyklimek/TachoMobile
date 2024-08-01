import React from 'react';
import {styled} from 'nativewind';
import Box from '@/components/Box';
import {View} from 'react-native';
import {Timer, Store, ShoppingBag, CircleX} from 'lucide-react-native';

const StyledView = styled(View);

const readersElemsData = [
  {
    text: 'Sklep Online',
    icon: <ShoppingBag className="text-lightBlue" size={36} />,
    nav: 'https://mtacho.pl/sklep/',
  },
  {
    text: 'Allegro',
    icon: <Store className="text-lightBlue" size={36} />,
    nav: 'https://allegro.pl/uzytkownik/Tachoss',
  },
  {
    text: 'Rozliczanie czasu pracy',
    icon: <Timer className="text-lightBlue" size={36} />,
    nav: 'https://mtacho.pl/produkt/rozliczanie-czasu-pracy-kierowcow/',
  },
  {
    text: 'Naruszenia czasu pracy',
    icon: <CircleX className="text-lightBlue" size={36} />,
    nav: 'https://mtacho.pl/produkt/sprawdzanie-naruszen-czasu-pracy-itd-4/',
  },
];

const ReadersElements = () => {
  return (
    <StyledView className="flex flex-wrap flex-row justify-evenly">
      {readersElemsData.map((elem, idx) => (
        <Box text={elem.text} icon={elem.icon} nav={elem.nav} key={idx} />
      ))}
    </StyledView>
  );
};

export default ReadersElements;
