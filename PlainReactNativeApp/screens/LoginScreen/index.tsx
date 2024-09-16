import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {styled} from 'nativewind';
import {LoginForm, LogoImage} from '@/components';
import {useTranslation} from 'react-i18next';

const StyledText = styled(Text);
const StyledView = styled(View);

const LoginScreen = () => {
  const {t} = useTranslation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
          style={{backgroundColor: '#2D2A57'}}>
          <StyledView className="flex-1 justify-center items-center bg-darkPurple py-4">
            <StyledText className="text-slate-200 text-3xl mb-4 font-light">
              {t('Logowanie')}
            </StyledText>
            <LogoImage size={2} classes="mb-24" />
            <LoginForm />
          </StyledView>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
