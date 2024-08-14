import React from 'react';
import {TouchableOpacity, Text, View, Linking} from 'react-native';
import {styled} from 'nativewind';
import {useNavigation} from '@react-navigation/native';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledView = styled(View);

interface IBox {
  text: string;
  icon?: React.ReactNode;
  nav: string | (() => void);
}

const Box: React.FC<IBox> = ({text, icon, nav}) => {
  const navigation = useNavigation();

  const isWebUrl = (url: string) => {
    if (!url) return false;
    return url.startsWith('http') || url.startsWith('www');
  };

  const handlePress = () => {
    if (typeof nav === 'function') {
      nav();
    } else if (typeof nav === 'string' && isWebUrl(nav)) {
      Linking.openURL(nav);
    } else if (typeof nav === 'string') {
      navigation.navigate(nav);
    }
  };

  return (
    <StyledTouchableOpacity
      onPress={handlePress}
      className="btn bg-slate-200 w-[40vw] p-3 mb-4 rounded-xl aspect-square shadow-xl">
      <StyledView className="h-full flex-col items-center justify-center">
        <StyledView className="mb-2">{icon}</StyledView>
        <StyledText className="text-lg text-center text-darkPurple leading-6">
          {text}
        </StyledText>
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default Box;
