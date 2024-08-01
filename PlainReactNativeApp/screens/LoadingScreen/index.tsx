import React from 'react';
import {ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styled} from 'nativewind';

const StyledSafeAreaView = styled(SafeAreaView);

const LoadingScreen: React.FC = () => {
  return (
    <StyledSafeAreaView className="flex-1 justify-center items-center bg-lightGray">
      <ActivityIndicator size="large" color="#9DB2BF" />
    </StyledSafeAreaView>
  );
};

export default LoadingScreen;
