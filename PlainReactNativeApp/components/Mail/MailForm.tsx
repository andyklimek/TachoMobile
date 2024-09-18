import React, {useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Controller} from 'react-hook-form';
import {styled} from 'nativewind';
import useCustomForm from '@/hooks/useCustomForm';
import {schema} from './utils';
import {useTranslation} from 'react-i18next';
import useUserData from '../../hooks/useUserData';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

interface MailFormProps {
  onEmailChange: (email: string) => void;
  userEmail: string;
}

const MailForm: React.FC<MailFormProps> = ({onEmailChange, userEmail}) => {
  const {t} = useTranslation();

  const formDefaultValues = {
    email: userEmail || '',
  };

  const {control, errors, setValue, watch} = useCustomForm(
    schema,
    formDefaultValues,
  );

  const emailValue = watch('email');

  useEffect(() => {
    if (emailValue) {
      onEmailChange(emailValue);
    }
  }, [emailValue, onEmailChange]);

  useEffect(() => {
    if (userEmail) {
      setValue('email', userEmail);
    }
  }, [userEmail, setValue]);

  return (
    <StyledKeyboardAvoidingView
      className="w-full p-4"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StyledView>
        <StyledText className="text-xl font-light text-darkPurple text-center mb-2">
          {t('Adres email na który mają być wysyłane pliki')}
        </StyledText>
        {errors.email ? (
          <StyledText className="text-red-400 text-center mb-4">
            {t('Niepoprawny adres email')}
          </StyledText>
        ) : (
          <StyledText className="text-center text-darkBlue mb-4"> </StyledText>
        )}

        <Controller
          control={control}
          name="email"
          render={({field: {onChange, onBlur, value}}) => (
            <StyledTextInput
              className="bg-lightBeige rounded-xl p-4 mb-4"
              placeholder={t('Email')}
              placeholderTextColor="#000"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </StyledView>
    </StyledKeyboardAvoidingView>
  );
};

export default MailForm;
