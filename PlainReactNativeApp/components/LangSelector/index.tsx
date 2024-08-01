import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropdownPicker from '@/components/DropdownPicker';
import {useTranslation} from 'react-i18next';
import {styled} from 'nativewind';
import {langItems} from './utils';

const StyledView = styled(View);

const LangSelector = () => {
  const {i18n} = useTranslation();
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
    <StyledView>
      <DropdownPicker
        title="Wybierz język"
        items={langItems}
        selected={selectedLanguage}
        onSelect={handleLanguageChange}
      />
    </StyledView>
  );
};

export default LangSelector;
