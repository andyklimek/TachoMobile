import React, {useState} from 'react';
import {View, TextInput, Text} from 'react-native';
import {Controller} from 'react-hook-form';
import {styled} from 'nativewind';
import {ChevronRight} from 'lucide-react-native';
import useCustomForm from '@/hooks/useCustomForm';
import Button from '@/components/Button';
import {schema, defaultValues} from './utils';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '@/context/AuthContext';
import {useTranslation} from 'react-i18next';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);

const LoginForm = () => {
  const {control, handleSubmit, errors} = useCustomForm(schema, defaultValues);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const {login} = useAuth();
  const {t} = useTranslation();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await login(data.username, data.password);
      navigation.navigate('dashboard');
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledView className="w-full px-4">
      {errors.password || errors.username || error ? (
        <StyledText className="text-red-400 text-center mb-4">
          {t('Niepoprawna nazwa użytkownika lub hasło')}
        </StyledText>
      ) : (
        <StyledText className="text-center text-darkBlue mb-4"> </StyledText>
      )}

      <Controller
        control={control}
        name="username"
        render={({field: {onChange, onBlur, value}}) => (
          <StyledTextInput
            className="bg-lightBeige rounded-xl px-2 py-4 mb-4"
            placeholder={t('Nazwa użytkownika')}
            placeholderTextColor="#000"
            onBlur={onBlur}
            onChangeText={onChange}
            autoCapitalize="none"
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({field: {onChange, onBlur, value}}) => (
          <StyledTextInput
            className="bg-lightBeige rounded-xl px-2 py-4 mb-4"
            placeholder={t('Hasło')}
            placeholderTextColor="#000"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            secureTextEntry
          />
        )}
      />

      <Button
        text={t('Zaloguj')}
        loading={loading}
        className="mt-4 bg-lightPurple shadow-md py-3 rounded-full text-darkPurple"
        icon={<ChevronRight className="text-white" size={28} />}
        onPress={handleSubmit(onSubmit)}
      />
    </StyledView>
  );
};

export default LoginForm;
