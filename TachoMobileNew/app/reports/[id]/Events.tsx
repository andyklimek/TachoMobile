import React, { useState, useEffect } from 'react';
import data from '@/data.json';
import { styled } from 'nativewind';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import BackBtn from '@/components/BackBtn/BackBtn';
import NoContent from '@/components/NoContent/NoContent';
import Button from '@/components/Button/Button';
import ExpandedData from '@/components/ExpandedData/ExpandedData';
import { useAuth } from '@/context/AuthContext';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

const ReportEvents = () => {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  const [expanded, setExpanded] = useState([]);
  const route = useRoute();
  const { id } = route.params;

  const reportsData = data?.data;
  const events = reportsData[id]?.events;

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
      case 'report':
        newName = 'raport';
        break;
      case 'event_type':
        newName = 'typ';
        break;
      case 'begin_time':
        newName = 'początek';
        break;
      case 'end_time':
        newName = 'koniec';
        break;
      case 'vehicle_registration_nation':
        newName = 'kraj_rejestracji_pojazdu';
        break;
      case 'vehicle_registration_number':
        newName = 'numer_rejestracyjny_pojazdu';
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

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <BackBtn />
      <StyledScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5">
        <StyledText className="text-3xl text-darkBlue text-center px-3 mb-12">Zdarzenia</StyledText>
        {events.length ? (
          events.map((event, idx) => (
            <StyledView
              className="bg-white rounded-2xl shadow-md mb-6"
              key={idx + 1}
              onPress={() => console.log('clicked')}
            >
              <Button
                text={`Zdarzenie nr. ${idx + 1}`}
                onPress={() => handlePress(idx)}
                className=" bg-darkBlue py-2 rounded-2xl text-lightGray shadow-sm shadow-black"
              />
              <ExpandedData data={event} expanded={expanded} idx={idx} namesMapper={namesMapper} />
            </StyledView>
          ))
        ) : (
          <NoContent elementName="zdarzeń" />
        )}
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReportEvents;
