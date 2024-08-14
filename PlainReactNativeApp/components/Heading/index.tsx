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
      className={`relative w-[90vw] flex justify-center items-center mx-auto ${classes}`}>
      <BackBtn />
      <StyledText className="text-slate-200 text-3xl font-light">
        {title}
      </StyledText>
    </StyledView>
  );
};

export default Heading;
