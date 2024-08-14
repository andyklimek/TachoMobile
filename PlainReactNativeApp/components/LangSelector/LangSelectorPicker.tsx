import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {useTranslation} from 'react-i18next';
import {styled} from 'nativewind';
import {langItems} from './utils';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPicker = styled(Picker);

const LangSelectorPicker = () => {
  const {i18n, t} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('user-language');
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
        i18n.changeLanguage(storedLanguage);
      }
    };

    loadLanguage();
  }, []);

  const handleLanguageChange = async language => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    await AsyncStorage.setItem('user-language', language);
  };

  return (
    <StyledView className="p-4">
      <StyledText className="text-3xl font-light text-darkPurple text-center mb-4">
        {t('Wybierz język')}
      </StyledText>
      <StyledPicker
        selectedValue={selectedLanguage}
        onValueChange={handleLanguageChange}
        className="">
        {langItems.map(item => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </StyledPicker>
    </StyledView>
  );
};

export default LangSelectorPicker;
