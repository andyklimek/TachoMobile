import React from 'react';
import { styled } from 'nativewind';
import { Text, View } from 'react-native';

const StyledText = styled(Text);
const StyledView = styled(View);

interface INoContent {
  elementName?: string;
}

const NoContent: React.FC<INoContent> = ({ elementName = 'elementów' }) => {
  return (
    <StyledView className="flex-1 items-center justify-center">
      <StyledText className="text-center text-lg text-darkGray">Brak {elementName} do wyświetlenia</StyledText>
    </StyledView>
  );
};

export default NoContent;
