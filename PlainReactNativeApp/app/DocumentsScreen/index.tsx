import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, Text, View} from 'react-native';
import {styled} from 'nativewind';
import Heading from '@/components/Heading/Heading';
import {useAuth} from '@/context/AuthContext';
import useDocuments from '@/hooks/useDocuments';
import DataElement from '@/components/DataElement/DataElement';
import LoadingScreen from '@/app/LoadingScreen';
import NoContent from '@/components/NoContent/NoContent';
import moment from 'moment';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);

const DocumentsScreen = () => {
  const {user} = useAuth();
  const {documents, loading, error, translateKey} = useDocuments(user?.id);

  if (loading) {
    return <LoadingScreen />;
  }

  const filteredDocumentKeys = Object.keys(documents).filter(
    key => key !== 'id' && key !== 'user_id' && key !== 'updated_at',
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex-1 px-4">
          <StyledView className="flex justify-start items-center flex-col mb-4">
            <Heading title="Dokumenty" classes="mb-2" />
            <StyledText className="text-lightBlue">
              Ostatnia aktualizacja:
            </StyledText>
            <StyledText className="text-lightBlue font-semibold">
              {moment(documents.updated_at).format('DD.MM.YYYY HH:mm')}
            </StyledText>
          </StyledView>

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
