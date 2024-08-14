import React, {useState} from 'react';
import Box from '@/components/Box';
import Modal from '@/components/Modal';
import {View} from 'react-native';
import {MessageCircleQuestion} from 'lucide-react-native';
import FaqModal from './FaqModal';
import {styled} from 'nativewind';
import {useTranslation} from 'react-i18next';

const StyledModal = styled(Modal);
const StyledView = styled(View);

const Faq = () => {
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
        content={<FaqModal />}
        openingElement={
          <Box
            icon={
              <MessageCircleQuestion size={36} className="text-darkPurple" />
            }
            nav={toggleOpen}
            text={t('FAQ')}
          />
        }
      />
    </StyledView>
  );
};

export default Faq;
