import styled from 'styled-components';
import DesignTokenColors from '../common/components/Style/DesignTokenColors';
import { isCordova, isWebApp } from '../common/utils/isCordovaOrWebApp';
import { cordovaOffsetLog } from '../common/utils/logging';
import { headroomWrapperOffset } from './cordovaCalculatedOffsets';
import { getPageKey } from './cordovaPageUtils';
import { pageEnumeration } from './cordovaUtilsPageEnumeration';

export function cordovaMarginTopOffset (logLabel = '', pageOverride = '') {
  if (isCordova()) {
    // Calculated approach Nov 2022
    const offset = `${headroomWrapperOffset(true, pageOverride)}px`;
    cordovaOffsetLog(`${logLabel} HeadroomWrapper offset: ${offset}, page: ${getPageKey()}`);
    return offset;
    // end calculated approach
  }
  return undefined;
}

export function marginTopOffset (scrolledDown) {
  if (isWebApp()) {
    if (scrolledDown) {
      return '-11px';
    } else {
      return '39px';
    }
  }
  return cordovaMarginTopOffset(pageEnumeration());
}

// export const MobileHeaderStyles = styled('div')(({ theme }) => (`
//   padding: 15px 15px 0 15px;
//   margin: ${() => cordovaBallotFilterTopMargin()} auto 0 auto;
//   position: relative;
//   max-width: 960px;
//   width: 100%;
//   z-index: 0;
//   ${theme.breakpoints.down('sm')} {
//     min-height: 10px;
//     //margin: 0 10px;
//   }
// `));

export const MobileHeaderInnerContainer = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const NoInformationProvided = styled('div')`
  color: 1px solid ${DesignTokenColors.neutralUI100};
  font-size: 12px;
`;
