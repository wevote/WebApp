import styled from 'styled-components';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';

const AvatarNotInColumn = `
  @media (min-width: 400px) {
    height: 100% !important;
    max-width: 100%;
    min-height: 100% !important;
    max-height: 100% !important;
    position: absolute !important;
    left: 0;
    top: 0;
    margin: 0 auto;
    & img {
      border-radius: 6px;
      width: 68.8px;
      height: 68.8px;
    }
  }
`;

const Avatar = isWebApp() ? styled.div`
  max-width: 68.8px;
  margin-right: 8px;
  ${({ inSideColumn }) => ((inSideColumn) ? '' : AvatarNotInColumn)}
` : styled.div`
  max-width: 68.8px;
  margin-right: 8px;
    & img {
      border-radius: 6px;
      width: 68.8px;
      height: 68.8px;
    }
  }
`;

export {
  Avatar,
  AvatarNotInColumn,
};
