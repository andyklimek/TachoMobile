import React from 'react';
import {Button, Heading, NoContent} from '@/components';
import LoadingScreen from '@/screens/LoadingScreen';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View, Alert, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import useFiles from '@/hooks/useFiles';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const FilesScreen = () => {
  const {files, loading, error} = useFiles();

  const handlePress = async (fileUrl: string, fileName: string) => {
    try {
      const downloadDir =
        Platform.OS === 'ios'
          ? RNFS.DocumentDirectoryPath
          : RNFS.DownloadDirectoryPath;

      const filePath = `${downloadDir}/${fileName}`;

      const result = await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: filePath,
      }).promise;

      if (result.statusCode === 200) {
        Alert.alert('Udało się! ✅', 'Plik został pobrany.');
      } else {
        throw Error();
      }
    } catch (err) {
      Alert.alert('Błąd ❌', 'Wystąpił błąd podczas pobierania pliku.');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex-1 px-4">
          <Heading title="Pliki" classes="mb-6" />
          {files.length === 0 || error ? (
            <NoContent elementName="plików" />
          ) : (
            files.map((file, idx) => (
              <Button
                key={idx}
                text={file.name}
                onPress={() => handlePress(file.dddfile, file.name)}
                className="rounded-lg bg-darkBlue p-2 mb-2"
              />
            ))
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default FilesScreen;
