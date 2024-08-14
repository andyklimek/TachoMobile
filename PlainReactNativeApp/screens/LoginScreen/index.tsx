import React from 'react';
import {Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styled} from 'nativewind';
import {LoginForm, LogoImage} from '@/components';
import {useTranslation} from 'react-i18next';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);

const LoginScreen = () => {
  const {t} = useTranslation();

  return (
    <StyledSafeAreaView className="flex-1 justify-start items-center bg-darkPurple py-12">
      <StyledText className="text-slate-200 text-3xl mb-4 font-light">
        {t('Logowanie')}
      </StyledText>
      <LogoImage size={2} classes="mb-24" />
      <LoginForm />
    </StyledSafeAreaView>
  );
};

export default LoginScreen;
