import React, {useState} from 'react';
import {Modal as DefModal, View, Text} from 'react-native';
import {styled} from 'nativewind';
import Button from '@/components/Button';
import {CircleX} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';
import LoadingScreen from '@/screens/LoadingScreen';

interface IModal {
  content: React.ReactNode;
  openingElement: React.ReactNode;
  modalVisible: boolean;
  toggleOpen: () => void;
  isLoading?: boolean;
}

const StyledModal = styled(DefModal);
const StyledView = styled(View);

const Modal: React.FC<IModal> = ({
  content,
  openingElement,
  modalVisible,
  toggleOpen,
  isLoading,
}) => {
  const {t} = useTranslation();

  return (
    <StyledView className="flex-1 justify-center">
      <StyledModal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleOpen}>
        <StyledView className="flex-1 justify-center items-center bg-transparent bg-opacity-50 bg-darkPurple">
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <StyledView className="w-[90%] p-4 rounded-xl bg-slate-200 shadow-xl">
              {content}
              <Button
                text={t('Zamknij')}
                onPress={toggleOpen}
                className="rounded-lg bg-darkPurple p-2 mt-4"
                icon={<CircleX size={24} className="text-slate-200" />}
              />
            </StyledView>
          )}
        </StyledView>
      </StyledModal>
      {openingElement}
    </StyledView>
  );
};

export default Modal;
