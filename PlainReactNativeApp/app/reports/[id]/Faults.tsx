import React from 'react';
import data from '@/data.json';
import { styled } from 'nativewind';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import BackBtn from '@/components/BackBtn/BackBtn';
import NoContent from '@/components/NoContent/NoContent';
import Button from '@/components/Button/Button';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

const ReportFaults = () => {
  const route = useRoute();
  const { id } = route.params;

  const reportsData = data?.data;
  const faults = reportsData[id]?.faults;

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <BackBtn />
      <StyledScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5">
        <StyledText className="text-3xl text-darkBlue text-center px-3 mb-12">Naruszenia</StyledText>
        {faults.length ? (
          faults.map((event, idx) => (
            <Button
              key={idx + 1}
              text={`Naruszenie nr. ${idx + 1}`}
              onPress={() => handlePress(id)}
              className="mb-6 bg-darkBlue py-2 rounded-2xl text-lightGray shadow-sm shadow-black"
            />
          ))
        ) : (
          <NoContent elementName="naruszeń" />
        )}
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReportFaults;
