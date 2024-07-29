import React, {useState} from 'react';
import {View, TextInput, Text} from 'react-native';
import {Controller} from 'react-hook-form';
import {styled} from 'nativewind';
import {LogIn} from 'lucide-react-native';
import useCustomForm from '@/hooks/useCustomForm';
import Button from '@/components/Button/Button';
import {schema, defaultValues} from './utils';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '@/context/AuthContext';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(Button);
const StyledIcon = styled(LogIn);
const StyledText = styled(Text);

const LoginForm = () => {
  const {control, handleSubmit, errors} = useCustomForm(schema, defaultValues);
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  const {login} = useAuth();

  const onSubmit = async (data: any) => {
    try {
      await login(data.username, data.password);
      navigation.navigate('dashboard');
    } catch (error) {
      setError(true);
    }
  };

  return (
    <StyledView className="w-full p-4">
      {errors.password || errors.username || error ? (
        <StyledText className="text-red-500 text-center mb-4">
          Niepoprawny nazw użytkownika i/lub hasło
        </StyledText>
      ) : (
        <StyledText className="text-center mb-4 text-darkBlue"> </StyledText>
      )}
      <Controller
        control={control}
        name="username"
        render={({field: {onChange, onBlur, value}}) => (
          <StyledTextInput
            className="bg-slate-100 rounded-xl p-3 mb-4 border-darkBlue border-2 focus:border-darkBlue focus:border-2 focus:border-solid"
            placeholder="Nazwa użytkownika"
            placeholderTextColor="#27374D"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({field: {onChange, onBlur, value}}) => (
          <StyledTextInput
            className="bg-slate-100 rounded-xl p-3 mb-4 border-darkBlue border-2 focus:border-darkBlue focus:border-2 focus:border-solid"
            placeholder="Hasło"
            placeholderTextColor="#27374D"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />

      <StyledButton
        text="Zaloguj"
        className="mt-4 bg-darkBlue py-3 rounded-2xl text-lightGray shadow-sm shadow-black"
        icon={<StyledIcon className="text-lightGray" />}
        onPress={handleSubmit(onSubmit)}
      />
    </StyledView>
  );
};

export default LoginForm;
