import React from 'react';
import {styled} from 'nativewind';
import {TouchableOpacity, View, GestureResponderEvent} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

const BackBtn = () => {
  const navigation = useNavigation();

  const handlePress = (event: GestureResponderEvent) => {
    navigation.goBack();
  };

  return (
    <StyledTouchableOpacity
      className="btn z-50 absolute left-0"
      onPress={handlePress}>
      <StyledView>
        {<ChevronLeft className="text-darkBlue" size={40} />}
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default BackBtn;
