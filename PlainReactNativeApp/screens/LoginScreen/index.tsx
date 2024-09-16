import React, {useEffect} from 'react';
import {
  NativeModules,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styled} from 'nativewind';
import {LoginForm, LogoImage} from '@/components';
import {useTranslation} from 'react-i18next';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);

const LoginScreen = () => {
  const {t} = useTranslation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <StyledSafeAreaView className="flex-1 justify-start items-center bg-darkPurple py-12">
        <StyledText className="text-slate-200 text-3xl mb-4 font-light">
          {t('Logowanie')}
        </StyledText>
        <LogoImage size={2} classes="mb-24" />
        <LoginForm />
      </StyledSafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
