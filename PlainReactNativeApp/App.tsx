import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {styled} from 'nativewind';
import 'intl-pluralrules';
import {View, AppState} from 'react-native';
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
  CardReaderScreen,
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
              <StyledView className="flex-1 bg-darkPurple">
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
            name="cardReader"
            component={CardReaderScreen}
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
