import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { Controller } from 'react-hook-form';
import { styled } from 'nativewind';
import { LogIn } from 'lucide-react-native';
import useCustomForm from '@/hooks/useCustomForm';
import Button from '@/components/Button/Button';
import { schema, defaultValues } from './utils';
import { useNavigation } from '@react-navigation/native';

// Define styled components
const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(Button);
const StyledIcon = styled(LogIn);
const StyledText = styled(Text);

const LoginForm = ({ navigation }) => {
  const { control, handleSubmit, errors } = useCustomForm(schema, defaultValues);
  const { navigate } = useNavigation();

  const onSubmit = (data: any) => {
    navigate('dashboard');
  };

  return (
    <StyledView className="w-full p-4">
      {(errors.password || errors.email) && (
        <StyledText className="text-red-500 text-center font-semibold mb-4">Niepoprawny email i/lub hasło</StyledText>
      )}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledTextInput
            className="bg-slate-100 rounded-xl p-3 mb-4 border-darkBlue border-2 focus:border-darkBlue focus:border-2 focus:border-solid"
            placeholder="Email"
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
        render={({ field: { onChange, onBlur, value } }) => (
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
        className="mt-8 bg-darkBlue py-3 rounded-2xl text-lightGray shadow-sm shadow-black"
        icon={<StyledIcon className="text-lightGray" />}
        onPress={handleSubmit(onSubmit)}
      />
    </StyledView>
  );
};

export default LoginForm;
