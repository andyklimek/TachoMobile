import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View} from 'react-native';
import {styled} from 'nativewind';
import {BackBtn, LogoImage, ReadersElements} from '@/components';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);

const ReadersScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="px-4">
          <StyledView className="relative w-[100%] flex justify-center items-center mb-12">
            <LogoImage size={1} />
            <BackBtn />
          </StyledView>
        </StyledView>
        <ReadersElements />
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReadersScreen;
