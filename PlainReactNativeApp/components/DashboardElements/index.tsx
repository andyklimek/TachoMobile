import React from 'react';
import {styled} from 'nativewind';
import Box from '@/components/Box';
import {View} from 'react-native';
import {
  ScanEye,
  CreditCard,
  Files,
  Folder,
  BookOpenCheck,
  Settings,
} from 'lucide-react-native';

const StyledView = styled(View);

const dashboardElemsData = [
  {
    text: 'Odczyt karty',
    icon: <ScanEye className="text-lightBlue" size={40} />,
    nav: 'tachograf',
  },
  {
    text: 'Pliki',
    icon: <Folder className="text-lightBlue" size={40} />,
    nav: 'files',
  },
  {
    text: 'Dokumenty',
    icon: <Files className="text-lightBlue" size={40} />,
    nav: 'documents',
  },
  {
    text: 'Raporty',
    icon: <BookOpenCheck className="text-lightBlue" size={40} />,
    nav: 'reports',
  },
  {
    text: 'Kup czytnik',
    icon: <CreditCard className="text-lightBlue" size={40} />,
    nav: 'readers',
  },
  {
    text: 'Ustawienia',
    icon: <Settings className="text-lightBlue" size={40} />,
    nav: 'settings',
  },
];

const DashboardElements = () => {
  return (
    <StyledView className="flex flex-wrap flex-row justify-evenly">
      {dashboardElemsData.map((elem, idx) => (
        <Box text={elem.text} icon={elem.icon} nav={elem.nav} key={idx} />
      ))}
    </StyledView>
  );
};

export default DashboardElements;
