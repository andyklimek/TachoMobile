import React, {useState} from 'react';
import {Button, Heading, NoContent} from '@/components';
import LoadingScreen from '@/screens/LoadingScreen';
import {useNavigation} from '@react-navigation/native';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View, RefreshControl} from 'react-native';
import useReports from '@/hooks/useReports';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const ReportsScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {reports, loading, error, fetchReportsRefresh} = useReports();
  const [refreshing, setRefreshing] = useState(false);

  const handlePress = (id, date) => {
    navigation.navigate('reportDetails', {id, date});
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
      <StyledScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Heading title={t('Raporty')} classes="mb-10" />
        <StyledView className="flex-1 px-4">
          {reports.length === 0 || error ? (
            <NoContent elementName="raportów" />
          ) : (
            reports.map((report, idx) => (
              <Button
                key={idx}
                onPress={() => handlePress(report.id, report.created_at)}
                text={moment(report.created_at).format('DD/MM/YYYY')}
                className="rounded-lg bg-lightPurple p-2 mb-2"
              />
            ))
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReportsScreen;
