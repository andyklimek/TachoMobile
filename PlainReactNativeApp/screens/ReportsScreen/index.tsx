import React from 'react';
import {Button, Heading, NoContent} from '@/components';
import LoadingScreen from '@/screens/LoadingScreen';
import {useNavigation} from '@react-navigation/native';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View} from 'react-native';
import useReports from '@/hooks/useReports';
import moment from 'moment';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const ReportsScreen = () => {
  const navigation = useNavigation();

  const {reports, loading, error} = useReports();

  const handlePress = (id, date) => {
    navigation.navigate('reportDetails', {id, date});
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex-1 px-4">
          <Heading title="Raporty" classes="mb-6" />
          {reports.length === 0 || error ? (
            <NoContent elementName="raportów" />
          ) : (
            reports.map((report, idx) => (
              <Button
                key={idx}
                onPress={() => handlePress(report.id, report.created_at)}
                text={moment(report.created_at).format('DD/MM/YYYY')}
                className="rounded-lg bg-darkBlue p-2 mb-2"
              />
            ))
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReportsScreen;
