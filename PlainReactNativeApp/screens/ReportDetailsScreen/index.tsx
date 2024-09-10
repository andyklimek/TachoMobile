import React from 'react';
import {styled} from 'nativewind';
import {Button, Heading} from '@/components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledFlatList = styled(FlatList);

const ReportDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id, date} = route.params;
  const {t} = useTranslation();

  const handlePress = (nav: string) => {
    navigation.navigate(nav, {id});
  };

  const listElements = [
    {
      title: 'Wydarzenia',
      nav: 'reportDetailsEvents',
    },
    {
      title: 'Naruszenia',
      nav: 'reportDetailsFaults',
    },
    {
      title: 'Miejsca',
      nav: 'reportDetailsPlaces',
    },
    {
      title: 'Pojazdy',
      nav: 'reportDetailsVehicles',
    },
    {
      title: 'Aktywności',
      nav: 'reportDetailsActivities',
    },
  ];

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <Heading
        title={`${moment(date).format('DD/MM/YYYY')}/${id}`}
        classes="mb-4"
      />
      <StyledFlatList
        className="px-4 pt-4"
        data={listElements}
        showsVerticalScrollIndicator={false}
        renderItem={({item, idx}) => (
          <Button
            key={idx}
            text={t(item.title)}
            onPress={() => handlePress(item.nav, id)}
            className="rounded-lg bg-lightPurple p-2 mb-2"
          />
        )}
        keyExtractor={item => item.title}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </StyledSafeAreaView>
  );
};

export default ReportDetailsScreen;
