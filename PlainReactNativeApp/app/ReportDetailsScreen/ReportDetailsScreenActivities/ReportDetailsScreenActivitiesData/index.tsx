import React from 'react';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View} from 'react-native';
import Heading from '@/components/Heading/Heading';
import {useRoute} from '@react-navigation/native';
import useReport from '@/hooks/useReport';
import LoadingScreen from '@/app/LoadingScreen';
import NoContent from '@/components/NoContent/NoContent';
import DataElement from '@/components/DataElement/DataElement';
import moment from 'moment';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const ReportDetailsScreenActivitiesData = () => {
  const route = useRoute();
  const {id, date} = route.params;
  const {report, loading, error, translateKey} = useReport(id);

  if (loading) {
    return <LoadingScreen />;
  }

  const reportActivities = report[id].driver_activities.find(
    activity => activity.date === date,
  ).activity_changes;

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex-1 px-4">
          <Heading title={moment(date).format('DD/MM/YYYY')} classes="mb-6" />
          {reportActivities.length === 0 || error ? (
            <NoContent elementName="aktywności" />
          ) : (
            reportActivities.map((activity, idx) => (
              <DataElement
                key={idx}
                title={`${activity.time_of_change} - ${activity.activity}`}
                data={activity}
                translateKey={translateKey}
              />
            ))
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReportDetailsScreenActivitiesData;
