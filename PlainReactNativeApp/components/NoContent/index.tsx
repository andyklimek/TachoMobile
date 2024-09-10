import React from 'react';
import {styled} from 'nativewind';
import {Text, View} from 'react-native';

const StyledText = styled(Text);
const StyledView = styled(View);

interface INoContent {
  elementName?: string;
}

const NoContent: React.FC<INoContent> = ({elementName = 'elementów'}) => {
  return (
    <StyledView className="absolute top-[50%] translate-y-[-50%] w-full text-center">
      <StyledText className="text-center text-lg text-slate-200 -translate-y-10">
        Brak {elementName} do wyświetlenia
      </StyledText>
    </StyledView>
  );
};

export default NoContent;
