import React, {useState} from 'react';
import Box from '@/components/Box';
import Modal from '@/components/Modal';
import {View} from 'react-native';
import {Globe} from 'lucide-react-native';
import {styled} from 'nativewind';
import LangSelectorPicker from './LangSelectorPicker';
import {useTranslation} from 'react-i18next';

const StyledModal = styled(Modal);
const StyledView = styled(View);

const LangSelector = () => {
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
        content={<LangSelectorPicker />}
        openingElement={
          <Box
            icon={<Globe size={36} className="text-darkPurple" />}
            nav={toggleOpen}
            text={t('Wybierz język')}
          />
        }
      />
    </StyledView>
  );
};

export default LangSelector;
