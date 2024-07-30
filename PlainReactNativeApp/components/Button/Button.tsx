import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  GestureResponderEvent,
} from 'react-native';
import {styled} from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledView = styled(View);

interface IButtonProps {
  text: string;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
  onPress: (event: GestureResponderEvent) => void;
  className?: string;
}

const Button: React.FC<IButtonProps> = ({
  text,
  icon,
  onPress,
  className,
  ...props
}) => {
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      {...props}
      className={`relative btn ${className}`}>
      <StyledView className="flex-row items-center justify-center">
        <StyledText className="text-lg text-white">{text}</StyledText>
        {icon && <StyledView className="ml-2">{icon}</StyledView>}
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default Button;
