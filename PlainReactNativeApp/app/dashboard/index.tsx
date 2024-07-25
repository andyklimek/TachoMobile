import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Image} from 'react-native';
import {styled} from 'nativewind';
import LogoImage from '@/components/LogoImage/LogoImage';
import DashboardElements from '@/components/DashboardElements/DashboardElements';

const StyledSafeAreaView = styled(SafeAreaView);

const DashboardScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <LogoImage classes="mb-12" size={1} />
      <DashboardElements />
    </StyledSafeAreaView>
  );
};

export default DashboardScreen;
