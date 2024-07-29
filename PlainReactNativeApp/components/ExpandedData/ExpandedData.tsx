import React from 'react';
import {styled} from 'nativewind';
import {View, Text} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import moment from 'moment';
import Button from '@/components/Button/Button';

const StyledView = styled(View);
const StyledText = styled(Text);

interface IExpandedDataProps {
  data: Record<string, any>;
  translateKey: (string) => string;
}

const ExpandedData: React.FC<IExpandedDataProps> = ({data, translateKey}) => {
  const formatValue = (value: any) => {
    if (moment(value, moment.ISO_8601, true).isValid()) {
      return moment(value).format('DD.MM.YYYY');
    }
    return value;
  };

  const handlePress = (data: Record<string, any>) => {
    Clipboard.setString(JSON.stringify(data));
  };

  return (
    <StyledView className="p-4 rounded-lg shadow-md">
      {Object.keys(data).map(
        key =>
          key !== 'id' && (
            <StyledView
              key={key}
              className="mb-2 flex flex-row flex-wrap gap-1">
              <StyledText className="text-lightBlue font-bold">
                {translateKey(key)}:
              </StyledText>
              <StyledText className="text-darkGray">
                {formatValue(data[key])}
              </StyledText>
            </StyledView>
          ),
      )}
      <Button
        text="Kopiuj dane"
        className="p-2 bg-lightBlue rounded-lg mt-4"
        onPress={() => handlePress(data)}
      />
    </StyledView>
  );
};

export default ExpandedData;
