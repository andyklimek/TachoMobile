import React from 'react';
import { styled } from 'nativewind';
import { View, Text } from 'react-native';
import moment from 'moment';

const StyledView = styled(View);
const StyledText = styled(Text);

interface IExpandedDataProps {
  data: Record<string, any>;
  expanded: number[];
  idx: number;
  namesMapper: (name: string, data: Record<string, any>) => string;
}

const ExpandedData: React.FC<IExpandedDataProps> = ({ data, expanded, idx, namesMapper }) => {
  const formatValue = (value: any) => {
    if (moment(value, moment.ISO_8601, true).isValid()) {
      return moment(value).format('DD.MM.YYYY HH:mm:ss');
    }
    return value;
  };

  return (
    <>
      {expanded.includes(idx) && (
        <StyledView className="p-4 rounded-lg shadow-md">
          {Object.keys(data).map((key) => (
            <StyledView key={key} className="mb-2 flex flex-row flex-wrap gap-1">
              <StyledText className="text-darkGray font-bold">{namesMapper(key, data)}:</StyledText>
              <StyledText className="text-darkGray">{formatValue(data[key])}</StyledText>
            </StyledView>
          ))}
        </StyledView>
      )}
    </>
  );
};

export default ExpandedData;
