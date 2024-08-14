import React from 'react';
import {ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styled} from 'nativewind';

const StyledSafeAreaView = styled(SafeAreaView);

const LoadingScreen: React.FC = () => {
  return (
    <StyledSafeAreaView className="flex-1 justify-center items-center bg-darkPurple">
      <ActivityIndicator size="large" color="#ffffff" />
    </StyledSafeAreaView>
  );
};

export default LoadingScreen;
