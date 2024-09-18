import React, {useState} from 'react';
import Box from '@/components/Box';
import Modal from '@/components/Modal';
import {View} from 'react-native';
import {Mail as MailIcon} from 'lucide-react-native';
import {styled} from 'nativewind';
import MailForm from './MailForm';
import {useTranslation} from 'react-i18next';
import useUserData from '../../hooks/useUserData';

const StyledModal = styled(Modal);
const StyledView = styled(View);

const Mail = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const {t} = useTranslation();
  const {updateEmail, userData, isLoading} = useUserData();

  const toggleOpen = async () => {
    if (modalVisible) {
      if (email) {
        try {
          await updateEmail(email);
          setModalVisible(prev => !prev);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to update email:', error);
        }
      }
    } else {
      setModalVisible(prev => !prev);
    }
  };

  return (
    <StyledView>
      <StyledModal
        modalVisible={modalVisible}
        toggleOpen={toggleOpen}
        isLoading={isLoading}
        content={
          <MailForm
            onEmailChange={setEmail}
            userEmail={userData?.receiving_email}
          />
        }
        openingElement={
          <Box
            icon={<MailIcon size={36} className="text-darkPurple" />}
            nav={toggleOpen}
            text={t('Pliki')}
          />
        }
      />
    </StyledView>
  );
};

export default Mail;
