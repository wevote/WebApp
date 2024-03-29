import styled from 'styled-components';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';

const AvatarInSideColumn = `
  max-width: 40px;
  & img {
    border-radius: 19px;
    max-width: 40px;
    width: 40px;
    height: 40px;
  }
`;

const AvatarNotInColumn = `
  max-width: 68.8px;
  margin-right: 8px;
  & img {
    border-radius: 35px;
    max-width: 68.8px;
    width: 68.8px;
    height: 68.8px;
  }
`;

const AvatarCordovaStyles = `
  max-width: 68.8px;
  margin-right: 8px;
  & img {
    border-radius: 35px;
    max-width: 68.8px;
    width: 68.8px;
    height: 68.8px;
  }
`;

const Avatar = styled('div', {
  shouldForwardProp: (prop) => !['inSideColumn'].includes(prop),
})(({ inSideColumn }) => (`
    margin-right: 8px;
    ${isWebApp() && inSideColumn && AvatarInSideColumn}
    ${isWebApp() && !inSideColumn && AvatarNotInColumn}
    ${isCordova() && AvatarCordovaStyles}
`));

export default Avatar;
