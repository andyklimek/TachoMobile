import React from 'react';
import { styled } from 'nativewind';
import Box from '@/components/Box/Box';
import { View } from 'react-native';
import { Compass, CreditCard, Files, Folder, BookOpenCheck, ShieldQuestion } from 'lucide-react-native';

const StyledView = styled(View);

const dashboardElemsData = [
  { text: 'Tachograf', icon: <Compass className="text-lightBlue" size={40} />, nav: 'tachograf' },
  { text: 'Czytnik kart', icon: <CreditCard className="text-lightBlue" size={40} />, nav: 'czytnik' },
  { text: 'Pliki', icon: <Folder className="text-lightBlue" size={40} />, nav: 'pliki' },
  { text: 'Dokumenty', icon: <Files className="text-lightBlue" size={40} />, nav: 'documents' },
  { text: 'Raporty Online', icon: <BookOpenCheck className="text-lightBlue" size={40} />, nav: 'reports' },
  { text: 'Zgłoszenia Online', icon: <ShieldQuestion className="text-lightBlue" size={40} />, nav: 'zgłoszenia' },
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
