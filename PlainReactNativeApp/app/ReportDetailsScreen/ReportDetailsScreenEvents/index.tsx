import React from 'react';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View, Text} from 'react-native';
import Heading from '@/components/Heading/Heading';
import withAuth from '@/utils/withAuth';
import {useRoute} from '@react-navigation/native';
import useReport from '@/hooks/useReport';
import LoadingScreen from '@/app/LoadingScreen';
import NoContent from '@/components/NoContent/NoContent';
import DataElement from '@/components/DataElement/DataElement';
import moment from 'moment';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const ReportDetailsScreenEvents = () => {
  const route = useRoute();
  const {id} = route.params;
  const {report, loading, error, translateKey} = useReport(id);

  if (loading) {
    return <LoadingScreen />;
  }

  const reportEvents = report[id]['events'];

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex-1 px-4">
          <Heading title="Wydarzenia" classes="mb-6" />
          {reportEvents.length === 0 ? (
            <NoContent elementName="wydarzeń" />
          ) : (
            reportEvents.map((event, idx) => (
              <DataElement
                key={idx}
                title={moment(event.end_time).format(`DD/MM/YYYY/HH:mm`)}
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

export default withAuth(ReportDetailsScreenEvents);
