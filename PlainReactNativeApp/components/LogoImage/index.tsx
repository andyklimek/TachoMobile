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
        ? 'w-[140px] h-[70px]  mx-auto'
        : 'w-[200px] h-[100px]  mx-auto';

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
      source={require('../../assets/images/tacho_logo.webp')}
    />
  );
};

export default LogoImage;
