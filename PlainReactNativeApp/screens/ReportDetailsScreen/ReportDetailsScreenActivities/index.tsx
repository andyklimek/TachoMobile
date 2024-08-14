import React from 'react';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import useReport from '@/hooks/useReport';
import LoadingScreen from '@/screens/LoadingScreen';
import {Button, NoContent, Heading} from '@/components';
import moment from 'moment';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const ReportDetailsScreenActivities = () => {
  const route = useRoute();
  const {id} = route.params;
  const {report, loading, error} = useReport(id);
  const navigation = useNavigation();

  if (loading) {
    return <LoadingScreen />;
  }

  const handlePress = (date: string) => {
    navigation.navigate('reportDetailsActivitiesData', {id, date});
  };

  const reportActivities = report.driver_activities || [];

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex-1 px-4">
          <Heading title="Aktywności" classes="mb-10" />
          {reportActivities.length === 0 || error ? (
            <NoContent elementName="wydarzeń" />
          ) : (
            reportActivities.map((activity, idx) => (
              <Button
                key={idx}
                text={moment(activity.date).format('DD/MM/YYYY')}
                className="rounded-lg bg-lightPurple p-2 mb-3"
                onPress={() => handlePress(activity.date)}
              />
            ))
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReportDetailsScreenActivities;
