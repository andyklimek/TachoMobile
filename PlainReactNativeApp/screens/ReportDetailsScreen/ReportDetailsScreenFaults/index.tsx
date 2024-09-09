import React, {useState} from 'react';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList, RefreshControl} from 'react-native';
import {useRoute} from '@react-navigation/native';
import useReport from '@/hooks/useReport';
import LoadingScreen from '@/screens/LoadingScreen';
import {DataElement, NoContent, Heading} from '@/components';
import moment from 'moment';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledFlatList = styled(FlatList);

const ReportDetailsScreenFaults = () => {
  const route = useRoute();
  const {id} = route.params;
  const {report, loading, error, translateKey, fetchReport} = useReport(id);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReport(id, true);
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const reportEvents = report.faults || [];

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <Heading title="Naruszenia" classes="mb-4" />

      {(reportEvents.length === 0 || error) && (
        <NoContent elementName="naruszeń" />
      )}

      <StyledFlatList
        className="px-4 pt-4"
        data={reportEvents}
        showsVerticalScrollIndicator={false}
        renderItem={({item, idx}) => (
          <DataElement
            key={idx}
            title={moment(item.end_time).format('DD/MM/YYYY/HH:mm')}
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
    </StyledSafeAreaView>
  );
};

export default ReportDetailsScreenFaults;
