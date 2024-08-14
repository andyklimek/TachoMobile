import React, {useState} from 'react';
import Box from '@/components/Box';
import Modal from '@/components/Modal';
import {View} from 'react-native';
import {Mail as MailIcon} from 'lucide-react-native';
import {styled} from 'nativewind';
import MailForm from './MailForm';
import {useTranslation} from 'react-i18next';

const StyledModal = styled(Modal);
const StyledView = styled(View);

const Mail = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {t} = useTranslation();

  const toggleOpen = () => {
    setModalVisible(prev => !prev);
  };

  return (
    <StyledView>
      <StyledModal
        modalVisible={modalVisible}
        toggleOpen={toggleOpen}
        content={<MailForm />}
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
