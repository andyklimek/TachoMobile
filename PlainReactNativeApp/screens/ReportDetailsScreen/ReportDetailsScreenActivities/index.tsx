import React, {useState} from 'react';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList, RefreshControl} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import useReport from '@/hooks/useReport';
import LoadingScreen from '@/screens/LoadingScreen';
import {NoContent, Heading, Button} from '@/components';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledFlatList = styled(FlatList);

const ReportDetailsScreenActivities = () => {
  const route = useRoute();
  const {id} = route.params;
  const {report, loading, error, fetchReport} = useReport(id);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const {t} = useTranslation();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReport(id, true);
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const reportActivities = report.driver_activities || [];

  const handlePress = (date: string) => {
    navigation.navigate('reportDetailsActivitiesData', {id, date});
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <Heading title={t('Aktywności')} classes="mb-4" />

      {(reportActivities.length === 0 || error) && (
        <NoContent elementName="wydarzeń" />
      )}

      <StyledFlatList
        className="px-4 pt-4"
        data={reportActivities}
        showsVerticalScrollIndicator={false}
        renderItem={({item, idx}) => (
          <Button
            key={idx}
            text={`${moment(item.date).format('DD/MM/YYYY')}`}
            className="rounded-lg bg-lightPurple p-2 mb-3"
            onPress={() => handlePress(item.date)}
          />
        )}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{paddingBottom: 20}}
      />
    </StyledSafeAreaView>
  );
};

export default ReportDetailsScreenActivities;
