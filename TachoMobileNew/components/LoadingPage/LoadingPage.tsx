import React from 'react';
import { styled } from 'nativewind';
import { View, ActivityIndicator } from 'react-native';

const StyledView = styled(View);

const LoadingPage = () => {
  return (
    <StyledView className="flex-1 justify-center items-center bg-lightGray">
      <ActivityIndicator size="large" />
    </StyledView>
  );
};

export default LoadingPage;
