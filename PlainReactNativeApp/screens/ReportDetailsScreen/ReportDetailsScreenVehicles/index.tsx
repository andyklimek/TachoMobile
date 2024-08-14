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

const ReportDetailsScreenVehicles = () => {
  const route = useRoute();
  const {id} = route.params;
  const {report, loading, error, translateKey} = useReport(id);

  if (loading) {
    return <LoadingScreen />;
  }

  const reportVehicles = report[id].vehicles;

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex-1 px-4">
          <Heading title="Pojazdy" classes="mb-6" />
          {reportVehicles.length === 0 || error ? (
            <NoContent elementName="pojazdów" />
          ) : (
            reportVehicles.map((vehicle, idx) => (
              <DataElement
                key={idx}
                title={`${moment(vehicle.end_time).format('HH/MM/YYYY')}/${
                  vehicle.vehicle_registration_number
                }`}
                data={vehicle}
                translateKey={translateKey}
              />
            ))
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReportDetailsScreenVehicles;
