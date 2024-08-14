import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, Text, View} from 'react-native';
import {styled} from 'nativewind';
import {useAuth} from '@/context/AuthContext';
import useDocuments from '@/hooks/useDocuments';
import {DataElement, NoContent, Heading} from '@/components';
import LoadingScreen from '@/screens/LoadingScreen';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);

const DocumentsScreen = () => {
  const {user} = useAuth();
  const {documents, loading, error, translateKey} = useDocuments(user?.id);
  const {t} = useTranslation();

  if (loading) {
    return <LoadingScreen />;
  }

  const filteredDocumentKeys = Object.keys(documents).filter(
    key => key !== 'id' && key !== 'user_id' && key !== 'updated_at',
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex justify-start items-center flex-col mb-4">
          <Heading title={t('Dokumenty')} classes="mb-2" />
          <StyledText className="text-slate-200">
            {t('Ostatnia aktualizacja')}:
          </StyledText>
          <StyledText className="text-slate-200 font-semibold">
            {moment(documents.updated_at).format('DD.MM.YYYY HH:mm')}
          </StyledText>
        </StyledView>

        <StyledView className="flex-1 px-4">
          {filteredDocumentKeys.length === 0 || error ? (
            <NoContent elementName="dokumentów" />
          ) : (
            filteredDocumentKeys.map(key => (
              <DataElement
                key={key}
                title={translateKey(key)}
                data={documents[key]}
                translateKey={translateKey}
              />
            ))
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default DocumentsScreen;
