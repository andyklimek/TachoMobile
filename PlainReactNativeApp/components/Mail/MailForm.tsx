import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Controller} from 'react-hook-form';
import {styled} from 'nativewind';
import useCustomForm from '@/hooks/useCustomForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {schema, defaultValues} from './utils';
import {useTranslation} from 'react-i18next';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

const MailForm = () => {
  const [formDefaultValues, setFormDefaultValues] = useState(defaultValues);
  const {control, errors} = useCustomForm(schema, formDefaultValues);
  const {t} = useTranslation();

  useEffect(() => {
    const getStoredEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        if (email !== null) {
          setFormDefaultValues(prev => ({...prev, email}));
        }
      } catch (error) {
        console.error('Error retrieving email from AsyncStorage:', error);
      }
    };

    getStoredEmail();
  }, []);

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
              onChangeText={text => {
                onChange(text);
                AsyncStorage.setItem('email', text);
              }}
              value={value}
            />
          )}
        />
      </StyledView>
    </StyledKeyboardAvoidingView>
  );
};

export default MailForm;
