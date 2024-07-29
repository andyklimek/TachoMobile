import Reacct from 'react';
import Button from '@/components/Button/Button';
import Heading from '@/components/Heading/Heading';
import LoadingScreen from '@/app/LoadingScreen';
import {useNavigation} from '@react-navigation/native';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View, Text} from 'react-native';
import useFiles from '@/hooks/useFiles';
import {useAuth} from '@/context/AuthContext';
import withAuth from '@/utils/withAuth';
import NoContent from '@/components/NoContent/NoContent';
import moment from 'moment';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const FilesScreen = () => {
  const {files, loading, error} = useFiles();

  // const handlePress = (id, date) => {
  //   navigation.navigate('reportDetails', {id, date});
  // };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <StyledScrollView contentContainerStyle={{flexGrow: 1}}>
        <StyledView className="flex-1 px-4">
          <Heading title="Pliki" classes="mb-6" />
          {files.length === 0 ? (
            <NoContent elementName="plików" />
          ) : (
            files.map((file, idx) => (
              <Button
                key={idx}
                text={file.name}
                className="rounded-lg bg-darkBlue p-2 mb-2"
              />
            ))
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default withAuth(FilesScreen);
