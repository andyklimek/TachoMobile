import React, {useState} from 'react';
import {Button, Heading, NoContent} from '@/components';
import LoadingScreen from '@/screens/LoadingScreen';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Alert, Platform, RefreshControl, FlatList} from 'react-native';
import RNFS from 'react-native-fs';
import useFiles from '@/hooks/useFiles';
import {useTranslation} from 'react-i18next';

const StyledFlatList = styled(FlatList);
const StyledSafeAreaView = styled(SafeAreaView);

const FilesScreen = () => {
  const {files, loading, fetchFilesRefresh, fetchNextPage} = useFiles();
  const [refreshing, setRefreshing] = useState(false);
  const {t} = useTranslation();

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
        Alert.alert(t('Udało się! ✅'), t('Plik został pobrany.'));
      } else {
        throw Error();
      }
    } catch (err) {
      Alert.alert(t('Błąd ❌'), t('Wystąpił błąd podczas pobierania pliku.'));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFilesRefresh();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <Heading title={t('Pliki')} classes="mb-6" />

      {files.length === 0 && <NoContent text={t('plików')} />}

      <StyledFlatList
        className="px-4"
        data={files}
        showsVerticalScrollIndicator={false}
        renderItem={({item, idx}) => (
          <Button
            key={idx}
            text={item.name}
            onPress={() => handlePress(item.dddfile, item.name)}
            className="rounded-lg bg-lightPurple p-2 mb-2"
          />
        )}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={fetchNextPage}
        onEndReachedThreshold={2}
      />
    </StyledSafeAreaView>
  );
};

export default FilesScreen;
