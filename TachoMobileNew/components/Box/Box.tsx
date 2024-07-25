import React from 'react';
import { TouchableOpacity, Text, View, GestureResponderEvent } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledView = styled(View);

interface IBox {
  text: string;
  icon?: React.ReactNode;
  nav?: string;
}

const Box: React.FC<IBox> = ({ navigation, text, icon, nav }) => {
  const { navigate } = useNavigation();

  const handlePress = (nav: string) => {
    navigate(nav);
  };

  return (
    <StyledTouchableOpacity
      onPress={() => handlePress(nav)}
      className="btn bg-darkBlue w-[40%] p-5 mb-4 rounded-xl shadow-sm shadow-black aspect-square "
    >
      <StyledView className="h-full flex-col items-center justify-center">
        <StyledView className="mb-2">{icon}</StyledView>
        <StyledText className="text-lg text-center text-lightGray leading-6">{text}</StyledText>
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default Box;
