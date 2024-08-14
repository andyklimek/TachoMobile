import React from 'react';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import useReport from '@/hooks/useReport';
import LoadingScreen from '@/screens/LoadingScreen';
import {DataElement, NoContent, Heading} from '@/components';
import moment from 'moment';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const ReportDetailsScreenEvents = () => {
  const route = useRoute();
  const {id} = route.params;
  const {report, loading, error, translateKey} = useReport(id);

  if (loading) {
    return <LoadingScreen />;
  }

  const reportEvents = report.events || [];

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex-1 px-4">
          <Heading title="Wydarzenia" classes="mb-10" />
          {reportEvents.length === 0 || !reportEvents || error ? (
            <NoContent elementName="wydarzeń" />
          ) : (
            reportEvents?.map((event, idx) => (
              <DataElement
                key={idx}
                title={moment(event.end_time).format('DD/MM/YYYY/HH:mm')}
                data={event}
                translateKey={translateKey}
              />
            ))
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReportDetailsScreenEvents;
