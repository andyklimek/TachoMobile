import React from 'react';
import { styled } from 'nativewind';
import { View, ScrollView, Text } from 'react-native';
import data from '@/data.json';
import LogoImage from '@/components/LogoImage/LogoImage';
import Button from '@/components/Button/Button';
import NoContent from '@/components/NoContent/NoContent';
import BackBtn from '@/components/BackBtn/BackBtn';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);

const ReportsScreen = () => {
  const navigation = useNavigation();

  const reportsData = data?.data;

  const handlePress = (reportId) => {
    navigation.navigate('reportDetails', { id: reportId });
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <BackBtn />
      <StyledScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5">
        <StyledText className="text-3xl text-darkBlue text-center px-3 mb-12 ">Raporty</StyledText>
        <StyledView className="flex-1">
          {Object.keys(reportsData).length ? (
            Object.keys(reportsData).map((key) => (
              <Button
                key={key}
                text={`Raport nr. ${key}`}
                onPress={() => handlePress(key)}
                className="mb-6 bg-darkBlue py-2 rounded-2xl text-lightGray shadow-sm shadow-black"
              />
            ))
          ) : (
            <NoContent elementName="raportów" />
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReportsScreen;
