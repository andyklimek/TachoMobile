import React, {useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styled} from 'nativewind';
import LoginForm from '@/components/LoginForm/LoginForm';
import LogoImage from '@/components/LogoImage/LogoImage';

const StyledSafeAreaView = styled(SafeAreaView);

const LoginScreen = () => {
  const {login} = useAuth();

  return (
    <StyledSafeAreaView className="flex-1 justify-center items-center bg-lightGray">
      <LogoImage classes="absolute top-12" size={2} />
      <LoginForm />
    </StyledSafeAreaView>
  );
};

export default LoginScreen;
