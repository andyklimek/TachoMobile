import React, {useState} from 'react';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList, RefreshControl} from 'react-native';
import {useRoute} from '@react-navigation/native';
import useReport from '@/hooks/useReport';
import LoadingScreen from '@/screens/LoadingScreen';
import {DataElement, NoContent, Heading} from '@/components';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledFlatList = styled(FlatList);

const ReportDetailsScreenVehicles = () => {
  const route = useRoute();
  const {id} = route.params;
  const {report, loading, error, translateKey, fetchReport} = useReport(id);
  const [refreshing, setRefreshing] = useState(false);
  const {t} = useTranslation();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReport(id, true);
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const reportVehicles = report.vehicles_used || [];

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <Heading title={t('Pojazdy')} classes="mb-4" />

      {reportVehicles.length === 0 || error ? (
        <NoContent elementName="pojazdów" />
      ) : (
        <StyledFlatList
          className="px-4 pt-4"
          data={reportVehicles}
          showsVerticalScrollIndicator={false}
          renderItem={({item, idx}) => (
            <DataElement
              key={idx}
              title={`${item.vehicle_registration_number} - ${moment(
                item.vehicle_first_use,
              ).format('DD/MM/YYYY')}`}
              data={item}
              translateKey={translateKey}
            />
          )}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}
    </StyledSafeAreaView>
  );
};

export default ReportDetailsScreenVehicles;
