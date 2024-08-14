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
// import React from 'react';
// import {View, Text, Button, StyleSheet} from 'react-native';

// import useReaderIOS from '@/hooks/useReaderIOS';

// const App = () => {
//   const {processData, connectReader} = useReaderIOS();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Card Reader Test</Text>
//       {/* <Button title="Establish Context" onPress={testCardReaderContext} /> */}
//       <Button title="Connect to reader" onPress={connectReader} />
//       <Button title="Read header files" onPress={processData} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
// });

// export default App;

// useEffect(() => {
//   // const testCardReaderContext = async () => {
//   //   try {
//   //     await CardReader.establishContext();
//   //     Alert.alert('Success', 'Context established successfully');
//   //   } catch (error) {
//   //     Alert.alert('Error', error.message);
//   //   }
//   // };
//   // testCardReaderContext();
// }, []);

// const testCardReaderConnection = async () => {
//   try {
//     const deviceList = await CardReader.getDeviceListPromise();
//     const readerResp = await CardReader.connectReader(deviceList[0]);
//     setConnection(readerResp);
//     Alert.alert('Success', 'Device connected: ' + readerResp);
//   } catch (error) {
//     Alert.alert('Error', error.message);
//   }
// };

// const testSelectTachoApp = async () => {
//   try {
//     const apduCommand = [
//       0x00, 0xa4, 0x04, 0x0c, 0x06, 0xff, 0x54, 0x41, 0x43, 0x48, 0x4f,
//     ];
//     const response = await CardReader.sendAPDUCommand(apduCommand);
//     // eslint-disable-next-line no-console
//     console.log('Select TACHO App Response:', response);
//     Alert.alert('Select TACHO App Success', JSON.stringify(response));
//   } catch (error) {
//     Alert.alert('Select TACHO App Error', error.message);
//   }
// };

// const testCardReader = async () => {
//   try {
//     // Step 1: Select the EF_ICC file
//     const selectCommand = [0x00, 0xa4, 0x02, 0x0c, 0x02, 0x00, 0x02];
//     const selectResponse = await CardReader.sendAPDUCommand(selectCommand);
//     // eslint-disable-next-line no-console
//     console.log('Select EF_ICC Response:', selectResponse);

//     // Step 2: Read data from the selected EF_ICC file
//     const readCommand = [0x00, 0xb0, 0x00, 0x00, 0x19];
//     const readResponse = await CardReader.sendAPDUCommand(readCommand);
//     // eslint-disable-next-line no-console
//     console.log('Read Binary Response:', readResponse);
//     // eslint-disable-next-line no-console
//     console.log('Leng', readResponse.length);
//     Alert.alert('Read Binary Success', JSON.stringify(readResponse));
//   } catch (error) {
//     Alert.alert('Error', error.message);
//   }
// };
