import React from 'react';
import {styled} from 'nativewind';
import {View, Text, Alert} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import moment from 'moment';
import Button from '@/components/Button';
import {useTranslation} from 'react-i18next';

const StyledView = styled(View);
const StyledText = styled(Text);

interface IExpandedDataProps {
  data: Record<string, any>;
  translateKey: (string) => string;
}

const ExpandedData: React.FC<IExpandedDataProps> = ({data, translateKey}) => {
  const {t} = useTranslation();

  const formatValue = (value: any) => {
    if (moment(value, moment.ISO_8601, true).isValid()) {
      return moment(value).format('DD.MM.YYYY HH:mm');
    }
    return value;
  };

  const handlePress = (data: Record<string, any>) => {
    Clipboard.setString(JSON.stringify(data));
    Alert.alert('Skopiowano! 📋', 'Dane zostały skopiowane do schowka.');
  };

  return (
    <StyledView className="p-4 rounded-b-lg shadow-2xl bg-slate-100">
      {Object.keys(data).map(
        key =>
          key !== 'id' && (
            <StyledView
              key={key}
              className="mb-2 flex flex-row flex-wrap gap-1">
              <StyledText className="text-darkPurple font-bold">
                {translateKey(key)}:
              </StyledText>
              <StyledText className="text-darkPurple">
                {formatValue(data[key])}
              </StyledText>
            </StyledView>
          ),
      )}
      <Button
        text={t('Kopiuj dane')}
        className="p-2 bg-darkPurple rounded-lg mt-4"
        onPress={() => handlePress(data)}
      />
    </StyledView>
  );
};

export default ExpandedData;
