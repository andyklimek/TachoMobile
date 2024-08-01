import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {styled} from 'nativewind';
import {ChevronDown} from 'lucide-react-native';
import Button from '@/components/Button';

interface IDropdownPicker {
  items: any[];
  title: string;
  onSelect: (item: string) => void;
}

const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledFlatList = styled(FlatList);

const DropdownPicker: React.FC<IDropdownPicker> = ({
  items,
  title,
  onSelect,
  selected,
}) => {
  const [open, setOpen] = useState(false);

  const handlePress = () => {
    setOpen(prevState => !prevState);
  };

  return (
    <StyledView className="bg-slate-100 rounded-lg">
      <Button
        onPress={handlePress}
        className="rounded-lg bg-darkBlue p-2"
        text={title}
      />
      {open && (
        <StyledFlatList
          className="p-4"
          data={items}
          renderItem={({item}) => (
            <StyledTouchableOpacity
              className="mb-2 flex-row"
              onPress={() => {
                onSelect(item);
              }}>
              <StyledView
                className={
                  item.value === selected
                    ? 'bg-darkBlue rounded-lg p-2 mr-1'
                    : 'bg-transparent rounded-lg p-2 mr-1'
                }
              />
              <Text>{item.label}</Text>
            </StyledTouchableOpacity>
          )}
          keyExtractor={item => item.value}
        />
      )}
    </StyledView>
  );
};

export default DropdownPicker;
