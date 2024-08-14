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

const ReportDetailsScreenActivitiesData = () => {
  const route = useRoute();
  const {id, date} = route.params;
  const {report, loading, error, translateKey} = useReport(id);

  if (loading) {
    return <LoadingScreen />;
  }

  const reportActivities =
    report.driver_activities.find(activity => activity.date === date)
      .activity_changes || [];

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex-1 px-4">
          <Heading title={moment(date).format('DD/MM/YYYY')} classes="mb-10" />
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
