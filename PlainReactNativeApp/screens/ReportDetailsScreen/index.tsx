import React from 'react';
import {styled} from 'nativewind';
import {Button, Heading} from '@/components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View} from 'react-native';
import moment from 'moment';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const ReportDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id, date} = route.params;

  const handlePress = (nav: string) => {
    navigation.navigate(nav, {id});
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <Heading
          title={`${moment(date).format('DD/MM/YYYY')}/${id}`}
          classes="mb-10"
        />
        <StyledView className="flex-1 px-4">
          <Button
            text="Wydarzenia"
            onPress={() => handlePress('reportDetailsEvents', id)}
            className="rounded-lg bg-lightPurple p-2 mb-3"
          />
          <Button
            text="Naruszenia"
            onPress={() => handlePress('reportDetailsFaults', id)}
            className="rounded-lg bg-lightPurple p-2 mb-3"
          />
          <Button
            text="Miejsca"
            onPress={() => handlePress('reportDetailsPlaces', id)}
            className="rounded-lg bg-lightPurple p-2 mb-3"
          />
          <Button
            text="Pojazdy"
            onPress={() => handlePress('reportDetailsVehicles', id)}
            className="rounded-lg bg-lightPurple p-2 mb-3"
          />
          <Button
            text="Aktywności"
            onPress={() => handlePress('reportDetailsActivities', id)}
            className="rounded-lg bg-lightPurple p-2 mb-3"
          />
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ReportDetailsScreen;
