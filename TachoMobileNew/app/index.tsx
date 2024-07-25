import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styled } from 'nativewind';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from './login';
import DashboardScreen from './dashboard';
import ReportsScreen from './reports';
import ReportDetails from './reports/[id]';
import ReportEvents from './reports/[id]/Events';
import ReportFaults from './reports/[id]/Faults';
import ReportActivities from './reports/[id]/Activities';
import DocumentsScreen from './documents';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const Stack = createNativeStackNavigator();
const StyledView = styled(View);

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <StyledView className="flex-1 pt-12 pb-0 bg-lightGray">
        <Navigator />
      </StyledView>
    </AuthProvider>
  );
};

const Navigator = () => {
  const { loading } = useAuth();

  if (loading) {
    return <SplashScreenComponent />;
  }

  return (
    <Stack.Navigator initialRouteName="dashboard">
      <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="reports" component={ReportsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="reportDetails" component={ReportDetails} options={{ headerShown: false }} />
      <Stack.Screen name="reportEvents" component={ReportEvents} options={{ headerShown: false }} />
      <Stack.Screen name="reportFaults" component={ReportFaults} options={{ headerShown: false }} />
      <Stack.Screen name="reportActivities" component={ReportActivities} options={{ headerShown: false }} />
      <Stack.Screen name="documents" component={DocumentsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const SplashScreenComponent = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default App;
