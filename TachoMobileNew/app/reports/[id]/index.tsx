import React, { useState, useEffect } from 'react';
import { styled } from 'nativewind';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import LogoImage from '@/components/LogoImage/LogoImage';
import BackBtn from '@/components/BackBtn/BackBtn';
import Button from '@/components/Button/Button';
import { useAuth } from '@/context/AuthContext';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);

const ReportDetails = () => {
  const { checkAuth } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        navigation.navigate('login');
      }
    };

    verifyAuth();
  }, []);

  const handleEventsPress = () => {
    navigation.navigate('reportEvents', { id });
  };

  const handleFaultsPress = () => {
    navigation.navigate('reportFaults', { id });
  };

  const handleActivitiesPress = () => {
    navigation.navigate('reportActivities', { id });
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray px-5">
      <BackBtn />
      <StyledText className="text-3xl text-darkBlue text-center px-3 mb-12 ">Raport nr. {id}</StyledText>
      <Button
        text="Zdarzenia"
        onPress={handleEventsPress}
        className="mb-6 bg-darkBlue py-2 rounded-2xl text-lightGray shadow-sm shadow-black"
      />
      <Button
        text="Naruszenia"
        onPress={handleFaultsPress}
        className="mb-6 bg-darkBlue py-2 rounded-2xl text-lightGray shadow-sm shadow-black"
      />
      <Button
        text="Aktywność kierowcy"
        onPress={handleActivitiesPress}
        className="mb-6 bg-darkBlue py-2 rounded-2xl text-lightGray shadow-sm shadow-black"
      />
    </StyledSafeAreaView>
  );
};

export default ReportDetails;
