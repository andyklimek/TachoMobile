import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native';
import {styled} from 'nativewind';
import {ReadersElements, Heading} from '@/components';
import {useTranslation} from 'react-i18next';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const ReadersScreen = () => {
  const {t} = useTranslation();
  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <Heading title={t('Sklep')} classes="mb-12" />
        <ReadersElements />
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReadersScreen;
