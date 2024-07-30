import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native';
import {styled} from 'nativewind';
import LogoImage from '@/components/LogoImage/LogoImage';
import DashboardElements from '@/components/DashboardElements/DashboardElements';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const DashboardScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <LogoImage classes="mb-12" size={1} />
        <DashboardElements />
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default DashboardScreen;
