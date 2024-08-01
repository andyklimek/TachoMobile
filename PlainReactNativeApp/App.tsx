import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {styled} from 'nativewind';
import 'intl-pluralrules';
import {View, AppState} from 'react-native';
// import LoginScreen from '@/screens/LoginScreen';
// import DashboardScreen from '@/screens/DashboardScreen';
// import ReportsScreen from '@/screens/ReportsScreen';
// import ReportDetails from '@/screens/ReportDetailsScreen';
// import ReportDetailsScreenEvents from '@/screens/ReportDetailsScreen/ReportDetailsScreenEvents';
// import ReportDetailsScreenActivitiesData from './screens/ReportDetailsScreen/ReportDetailsScreenActivities/ReportDetailsScreenActivitiesData';
// // import ReportFaults from '@/screens/Reports/[id]/Faults';
// import ReportDetailsScreenVehicles from './screens/ReportDetailsScreen/ReportDetailsScreenVehicles';
// import ReportDetailsScreenPlaces from '@/screens/ReportDetailsScreen/ReportDetailsScreenPlaces';
// import ReportDetailsScreenActivities from '@/screens/ReportDetailsScreen/ReportDetailsScreenActivities';
// import DocumentsScreen from '@/screens/DocumentsScreen';
// import FilesScreen from '@/screens/FilesScreen';
// import LoadingScreen from '@/screens/LoadingScreen';
// import ReadersScreen from '@/screens/ReadersScreen';
// import SettingsScreen from '@/screens/SettingsScreen';
import {
  LoginScreen,
  DashboardScreen,
  ReportsScreen,
  ReportDetailsScreen,
  ReportDetailsScreenEvents,
  ReportDetailsScreenVehicles,
  ReportDetailsScreenPlaces,
  ReportDetailsScreenActivities,
  ReportDetailsScreenActivitiesData,
  DocumentsScreen,
  FilesScreen,
  LoadingScreen,
  ReadersScreen,
  SettingsScreen,
} from '@/screens';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import '@/utils/i18n.ts';
import 'react-native-reanimated';
import {AuthProvider, useAuth} from '@/context/AuthContext';

const Stack = createNativeStackNavigator();
const StyledView = styled(View);

const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      {appState === 'active' && (
        <I18nextProvider i18n={i18next}>
          <NavigationContainer>
            <AuthProvider>
              <StyledView className="flex-1 pt-12 pb-2 bg-lightGray">
                <Navigator />
              </StyledView>
            </AuthProvider>
          </NavigationContainer>
        </I18nextProvider>
      )}
    </>
  );
};

const Navigator = () => {
  const {loading, user} = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {!user ? (
        <Stack.Navigator intialRoute="login">
          <Stack.Screen
            name="login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRoute="dashboard">
          <Stack.Screen
            name="dashboard"
            component={DashboardScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="reports"
            component={ReportsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="reportDetails"
            component={ReportDetailsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="reportDetailsEvents"
            component={ReportDetailsScreenEvents}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="reportDetailsVehicles"
            component={ReportDetailsScreenVehicles}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="reportDetailsPlaces"
            component={ReportDetailsScreenPlaces}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="reportDetailsActivities"
            component={ReportDetailsScreenActivities}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="reportDetailsActivitiesData"
            component={ReportDetailsScreenActivitiesData}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="documents"
            component={DocumentsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="files"
            component={FilesScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="readers"
            component={ReadersScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="settings"
            component={SettingsScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

export default App;
