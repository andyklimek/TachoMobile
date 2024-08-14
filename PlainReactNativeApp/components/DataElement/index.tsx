import React, {useState} from 'react';
import {View} from 'react-native';
import {styled} from 'nativewind';
import Button from '@/components/Button';
import ExpandedData from '@/components/ExpandedData';

const StyledView = styled(View);

interface IDataElement {
  data: Record<string, any>;
  title: string;
  translateKey: (string) => string;
}

const DataElement: React.FC<IDataElement> = ({data, title, translateKey}) => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    setExpanded(prevState => !prevState);
  };

  return (
    <StyledView className="rounded-lg bg-lightPurple mb-3">
      <Button
        onPress={handlePress}
        className="rounded-lg bg-lightPurple p-2"
        text={title}
      />
      {expanded && <ExpandedData data={data} translateKey={translateKey} />}
    </StyledView>
  );
};

export default DataElement;
