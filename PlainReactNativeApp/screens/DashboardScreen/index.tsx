import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, Text} from 'react-native';
import {styled} from 'nativewind';
import {DashboardElements, LogoImage} from '@/components';
import {useTranslation} from 'react-i18next';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);

const DashboardScreen = () => {
  const {t} = useTranslation();

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple min-h-screen items-end pt-6">
      <StyledScrollView
        contentContainerStyle={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'space-center',
        }}>
        <StyledText className="text-slate-200 text-3xl mb-4 font-light text-center">
          {t('Panel główny')}
        </StyledText>
        <LogoImage classes="mb-16" size={1} />
        <DashboardElements />
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default DashboardScreen;
