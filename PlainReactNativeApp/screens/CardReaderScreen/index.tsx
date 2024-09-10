import React, {useState, useEffect} from 'react';
import {styled} from 'nativewind';
import {TouchableOpacity, Text, View, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Heading} from '@/components';
import {useTranslation} from 'react-i18next';
import {ScanEye, MailCheck, CircleX} from 'lucide-react-native';
import useCardReader from '@/hooks/useCardReader';
import moment from 'moment';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledActivityIndicator = styled(ActivityIndicator);
const StyledSafeAreaView = styled(SafeAreaView);

const CardReaderScreen = () => {
  const {t} = useTranslation();
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
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  const timeDifference = (): string => {
    const now = moment();
    const last = moment(lastRead);
    return `${now.diff(last, 'days')} ${t('dni temu')}`;
  };

  const handlePress = async () => {
    setLoading(true);
    try {
      await connectReader();
      await readCardData();
      await sendDataToServer();
      setSuccess(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = () => {
    if (loading) {
      return <StyledActivityIndicator size="large" color="#6B46C1" />;
    }

    if (success) {
      return <MailCheck size={72} className="text-darkPurple mb-4" />;
    }

    if (error) {
      return <CircleX size={72} className="text-darkPurple mb-4" />;
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
              {success
                ? t('Teraz')
                : lastReadLoading
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
        disabled={loading || success || !!error}>
        <StyledView className="flex-1 justify-center items-center p-4">
          {renderIcon()}
          <StyledText className="text-2xl font-light text-darkPurple">
            {!loading && !success && !error && t('Kliknij, aby odczytać')}
            {!loading && success && !error && t('Plik wysłany')}
            {!loading && !success && error && t('Błąd')}
            {/* TODO Improve error handling */}
          </StyledText>
        </StyledView>
      </StyledTouchableOpacity>
    </StyledSafeAreaView>
    // TODO Preview of newly created file
  );
};

export default CardReaderScreen;
