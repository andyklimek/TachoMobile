import React from 'react';
import {styled} from 'nativewind';
import Heading from '@/components/Heading/Heading';
import Button from '@/components/Button/Button';
import withAuth from '@/utils/withAuth';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View, Text} from 'react-native';
import moment from 'moment';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const ReportDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id, date} = route.params;

  const handlePress = (nav: string, id: number) => {
    navigation.navigate(nav, {id});
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex-1 px-4">
          <Heading title={moment(date).format('DD/MM/YYYY')} classes="mb-6" />
          <Button
            text="Wydarzenia"
            onPress={() => handlePress('reportDetailsEvents', id)}
            className="rounded-lg bg-darkBlue p-2 mb-3"
          />
          <Button
            text="Naruszenia"
            onPress={() => handlePress('reportDetailsEvents', id)}
            className="rounded-lg bg-darkBlue p-2 mb-3"
          />
          <Button
            text="Miejsca"
            onPress={() => handlePress('reportDetailsPlaces', id)}
            className="rounded-lg bg-darkBlue p-2 mb-3"
          />
          <Button
            text="Pojazdy"
            onPress={() => handlePress('reportDetailsVehicles', id)}
            className="rounded-lg bg-darkBlue p-2 mb-3"
          />
          <Button
            text="Aktywności"
            onPress={() => handlePress('reportDetailsActivities', id)}
            className="rounded-lg bg-darkBlue p-2 mb-3"
          />
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default withAuth(ReportDetailsScreen);
