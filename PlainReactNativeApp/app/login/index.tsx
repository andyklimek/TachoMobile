import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { View, Image } from 'react-native';
import LoginForm from '@/components/LoginForm/LoginForm';
import LogoImage from '@/components/LogoImage/LogoImage';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledImage = styled(Image);

const LoginScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray justify-center items-center px-5">
      <LogoImage classes="absolute top-32" size={2} />
      <LoginForm />
    </StyledSafeAreaView>
  );
};

export default LoginScreen;
