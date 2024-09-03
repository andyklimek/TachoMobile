import React, {useState} from 'react';
import {Button, Heading, NoContent} from '@/components';
import LoadingScreen from '@/screens/LoadingScreen';
import {useNavigation} from '@react-navigation/native';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RefreshControl, FlatList} from 'react-native';
import useReports from '@/hooks/useReports';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const StyledFlatList = styled(FlatList);
const StyledSafeAreaView = styled(SafeAreaView);

const ReportsScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {reports, loading, error, fetchReportsRefresh} = useReports();
  const [refreshing, setRefreshing] = useState(false);

  const handlePress = (id, date, idx) => {
    navigation.navigate('reportDetails', {id, date, idx});
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReportsRefresh();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <Heading title={t('Raporty')} classes="mb-10" />

      {(reports.length === 0 || error) && <NoContent elementName="raportów" />}

      <StyledFlatList
        className="px-4"
        contentContainerStyle={{flexGrow: 1}}
        data={reports}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <Button
            key={item.id}
            text={`${moment(item.created_at).format('DD/MM/YYYY')}/${item.id}`}
            onPress={() => handlePress(item.id, item.created_at, item.id)}
            className="rounded-lg bg-lightPurple p-2 mb-2"
          />
        )}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </StyledSafeAreaView>
  );
};

export default ReportsScreen;
