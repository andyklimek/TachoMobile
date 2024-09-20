import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {styled} from 'nativewind';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Heading} from '@/components';
import {useTranslation} from 'react-i18next';
import {ScanEye, MailCheck, RotateCw, Bluetooth} from 'lucide-react-native';
import useCardReader from '@/hooks/useCardReader';
import moment from 'moment';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledActivityIndicator = styled(ActivityIndicator);
const StyledSafeAreaView = styled(SafeAreaView);

const CardReaderScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [bluetoothState, setBluetoothState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const {
    readCardData,
    sendDataToServer,
    connectReader,
    lastRead,
    lastReadLoading,
  } = useCardReader();

  useEffect(() => {
    BluetoothStateManager.getState().then(state => {
      setBluetoothState(state);

      if (state === 'PoweredOn') {
        setLoading(false);
        Alert.alert(t('Uwaga! 📱'), t('Wyłącz bluetooth, aby kontynuować'));
      }
    });

    const subscription = BluetoothStateManager.onStateChange(state => {
      setBluetoothState(state);
    }, true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      subscription.remove();
    };
  }, []);

  const openBluetoothSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert(t('Nie można otworzyć ustawień Bluetooth'));
    }
  };

  const timeDifference = (): string => {
    const now = moment();
    const last = moment(lastRead);
    return `${now.diff(last, 'days')} ${t('dni temu')}`;
  };

  const handleRetry = () => {
    setError('');
    navigation.navigate('cardReader');
  };

  const handlePress = async () => {
    if (bluetoothState === 'PoweredOn') {
      await openBluetoothSettings();
    } else if (error.length > 0) {
      handleRetry();
    } else {
      setLoading(true);
      setSuccess(false);
      try {
        await connectReader();
        await readCardData();
        await sendDataToServer();
        setSuccess(true);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderIcon = () => {
    if (error.length > 0) {
      return <RotateCw size={72} className="text-darkPurple mb-4" />;
    }

    if (loading) {
      return <StyledActivityIndicator size="large" color="#6B46C1" />;
    }

    if (success) {
      return <MailCheck size={72} className="text-darkPurple mb-4" />;
    }

    if (bluetoothState === 'PoweredOn') {
      return <Bluetooth size={72} className="text-darkPurple mb-4" />;
    }

    return <ScanEye size={72} className="text-darkPurple mb-4" />;
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple justify-start items-center pt-6">
      <StyledView className="flex justify-start items-center flex-col mb-4">
        <Heading title={t('Odczyt karty')} classes="mb-2" />
        <StyledText className="text-slate-200">
          {`${t('Ostatni odczyt')}:`}
        </StyledText>
        {lastRead && (
          <>
            <StyledText className="text-slate-200 font-semibold">
              {lastReadLoading
                ? t('Ładowanie...')
                : `${moment(lastRead).format('DD.MM.YYYY HH:mm')}`}
            </StyledText>
            <StyledText className="text-slate-200 font-semibold">
              {!lastReadLoading && timeDifference()}
            </StyledText>
          </>
        )}
      </StyledView>

      <StyledTouchableOpacity
        className="btn bg-slate-200 w-[70vw] p-3 mb-4 rounded-xl aspect-square shadow-xl absolute top-[50%] -translate-y-20"
        onPress={handlePress}
        disabled={loading || success}>
        <StyledView className="flex-1 justify-center items-center p-4">
          {renderIcon()}
          <StyledText className="text-2xl font-light text-darkPurple">
            {bluetoothState === 'PoweredOn'
              ? t('Wyłącz Bluetooth')
              : !loading
              ? success
                ? error.length === 0
                  ? t('Plik wysłany')
                  : t('Spróbuj ponownie')
                : error.length === 0
                ? t('Kliknij, aby odczytać')
                : t('Spróbuj ponownie')
              : null}
          </StyledText>
        </StyledView>
      </StyledTouchableOpacity>
    </StyledSafeAreaView>
  );
};

export default CardReaderScreen;
