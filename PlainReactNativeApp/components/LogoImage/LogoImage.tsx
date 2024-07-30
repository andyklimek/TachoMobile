import React from 'react';
import {styled} from 'nativewind';
import {Image} from 'react-native';

const StyledImage = styled(Image);

interface ILogoImage {
  classes?: string;
  size: 1 | 2;
}

const LogoImage: React.FC<ILogoImage> = ({classes, size}) => {
  const createClassName = () => {
    let name =
      size === 1
        ? 'w-[240px] h-[60px]  mx-auto'
        : 'w-[320px] h-[80px]  mx-auto';

    if (!classes) {
      return name;
    }

    const additioanlClasses = classes.split(' ');
    additioanlClasses.forEach(className => {
      name += ` ${className}`;
    });

    return name;
  };

  return (
    <StyledImage
      className={createClassName(classes)}
      source={require('../../assets/images/logo_tachoapp.png')}
    />
  );
};

export default LogoImage;
