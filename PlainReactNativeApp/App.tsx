import React, {useEffect, useState, useContext} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {styled} from 'nativewind';
import {View, Text, AppState} from 'react-native';
import LoginScreen from '@/app/LoginScreen';
import DashboardScreen from '@/app/DashboardScreen';
import ReportsScreen from '@/app/ReportsScreen';
import ReportDetails from '@/app/ReportDetailsScreen';
import ReportDetailsScreenEvents from '@/app/ReportDetailsScreen/ReportDetailsScreenEvents';
import ReportDetailsScreenActivitiesData from './app/ReportDetailsScreen/ReportDetailsScreenActivities/ReportDetailsScreenActivitiesData';
// import ReportFaults from '@/app/Reports/[id]/Faults';
import ReportDetailsScreenVehicles from './app/ReportDetailsScreen/ReportDetailsScreenVehicles';
import ReportDetailsScreenPlaces from '@/app/ReportDetailsScreen/ReportDetailsScreenPlaces';
import ReportDetailsScreenActivities from '@/app/ReportDetailsScreen/ReportDetailsScreenActivities';
import DocumentsScreen from '@/app/DocumentsScreen';
import FilesScreen from '@/app/FilesScreen';
import LoadingScreen from '@/app/LoadingScreen';
import 'react-native-reanimated';
import {AuthProvider, useAuth} from '@/context/AuthContext';

const Stack = createNativeStackNavigator();
const StyledView = styled(View);
const StyledText = styled(Text);

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
        <NavigationContainer>
          <AuthProvider>
            <StyledView className="flex-1 pt-12 pb-2 bg-lightGray">
              <Navigator />
            </StyledView>
          </AuthProvider>
        </NavigationContainer>
      )}
    </>
  );
};

const Navigator = () => {
  const {loading, user} = useAuth();
  const navigaton = useNavigation();

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
            component={ReportDetails}
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
        </Stack.Navigator>
      )}
    </>
  );
};

export default App;
