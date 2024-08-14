import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';
import {styled} from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledActivityIndicator = styled(ActivityIndicator);

interface IButtonProps {
  text: string;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
  onPress: (event: GestureResponderEvent) => void;
  className?: string;
  rotateIcon?: boolean;
  loading?: boolean;
}

const Button: React.FC<IButtonProps> = ({
  text,
  icon,
  onPress,
  className,
  rotateIcon,
  loading,
  ...props
}) => {
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      {...props}
      className={`relative btn ${className}`}>
      <StyledView className="flex-row items-center justify-center">
        {loading ? (
          <StyledActivityIndicator
            size="small"
            color="#ffffff"
            className="p-1"
          />
        ) : (
          <>
            <StyledText className="text-xl text-white">{text}</StyledText>
            {icon && (
              <StyledView
                className={
                  rotateIcon ? 'absolute right-8 rotate-90' : 'absolute right-8'
                }>
                {icon}
              </StyledView>
            )}
          </>
        )}
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default Button;
