import React from 'react';
import {View} from 'react-native';
import {styled} from 'nativewind';
import Logout from '@/components/Logout';
import LangSelector from '@/components/LangSelector';
import Faq from '@/components/Faq';

const StyledView = styled(View);

const SettingsElements = () => {
  return (
    <StyledView className="flex-col px-5 justify-start">
      <StyledView className="flex-1 flex-row w-full justify-between">
        <LangSelector />
        <Faq />
      </StyledView>
      <StyledView className="flex-1 flex-row w-full justify-between">
        <Logout />
      </StyledView>
    </StyledView>
  );
};

export default SettingsElements;
