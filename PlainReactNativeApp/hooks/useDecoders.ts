// const useDecoders = () => {
//   const decodeOctetString = (encodedData: number[]): string => {
//     const decodedData = encodedData
//       .map(octet => octet.toString(16).padStart(2, '0'))
//       .join('');
//     return decodedData.trim();
//   };

//   const decodeToAscii = (encodedData: number[]): string => {
//     const decodedData = encodedData
//       .map(octet => String.fromCharCode(octet))
//       .join('')
//       .replace(/^\x01+/, '')
//       .replace(/^\x02+/, '')
//       .replace(/\x00+$/, '');
//     return decodedData.trim();
//   };

//   const decodeToInt = (encodedData: number[]): number => {
//     const byteData = new Uint8Array(encodedData);
//     return parseInt(byteData.join(''), 10);
//   };

//   const decodeToDate = (encodedData: number[], onlyDate = false): string => {
//     if (encodedData.length !== 4) {
//       // eslint-disable-next-line no-console
//       console.log(encodedData);
//       throw new Error(
//         'encodedData must be exactly 4 bytes long to decode into a date.',
//       );
//     }

//     const hexString = decodeOctetString(encodedData);

//     if (!onlyDate) {
//       const timestamp = parseInt(hexString, 16);
//       const date = new Date(timestamp * 1000);
//       return date.toISOString();
//     } else {
//       const year = parseInt(hexString.slice(0, 4), 16);
//       const month = parseInt(hexString.slice(4, 6), 16);
//       const day = parseInt(hexString.slice(6, 8), 16);
//       const date = new Date(year, month - 1, day);
//       return date.toISOString().split('T')[0].trim();
//     }
//   };

//   return {decodeOctetString, decodeToAscii, decodeToInt, decodeToDate};
// };

// export default useDecoders;
const useDecoders = () => {
  const decodeOctetString = (encodedData: number[]): string => {
    const decodedData = encodedData
      .map(octet => octet.toString(16).padStart(2, '0'))
      .join('');
    return decodedData.trim();
  };

  const decodeToAscii = (encodedData: number[]): string => {
    const decodedData = encodedData
      .map(octet => String.fromCharCode(octet))
      .join('')
      .replace(/^\x01+/, '')
      .replace(/^\x02+/, '')
      .replace(/\x00+$/, '');
    return decodedData.trim();
  };

  const decodeToInt = (encodedData: number[]): number => {
    const byteData = new Uint8Array(encodedData);
    return parseInt(byteData.join(''), 10);
  };

  const decodeToDate = (encodedData: number[], onlyDate = false): string => {
    if (encodedData.length !== 4) {
      // throw new Error(
      //   'encodedData must be exactly 4 bytes long to decode into a date.',
      // );
      return '';
    }

    const hexString = decodeOctetString(encodedData);

    if (!onlyDate) {
      const timestamp = parseInt(hexString, 16);
      const date = new Date(timestamp * 1000);
      return date.toISOString();
    } else {
      const year = parseInt(hexString.slice(0, 4), 16);
      const month = parseInt(hexString.slice(4, 6), 16);
      const day = parseInt(hexString.slice(6, 8), 16);
      const date = new Date(year, month - 1, day);
      return date.toISOString().split('T')[0].trim();
    }
  };

  return {decodeOctetString, decodeToAscii, decodeToInt, decodeToDate};
};

export default useDecoders;
