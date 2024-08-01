import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styled} from 'nativewind';
import {LoginForm, LogoImage} from '@/components';

const StyledSafeAreaView = styled(SafeAreaView);

const LoginScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 justify-center items-center bg-lightGray">
      <LogoImage classes="absolute top-12" size={2} />
      <LoginForm />
    </StyledSafeAreaView>
  );
};

export default LoginScreen;
