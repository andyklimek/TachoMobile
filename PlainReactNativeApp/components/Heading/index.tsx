import React from 'react';
import {Text, View} from 'react-native';
import BackBtn from '@/components/BackBtn';
import {styled} from 'nativewind';

const StyledText = styled(Text);
const StyledView = styled(View);

interface IHeading {
  title: string;
  classes?: string;
}

const Heading: React.FC<IHeading> = ({title, classes}) => {
  return (
    <StyledView
      className={`relative w-[100%] flex justify-center items-center ${classes}`}>
      <BackBtn />
      <StyledText className="text-2xl font-semibold text-lightBlue">
        {title}
      </StyledText>
    </StyledView>
  );
};

export default Heading;
