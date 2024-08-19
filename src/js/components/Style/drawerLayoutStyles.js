import styled from 'styled-components';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import { cordovaBallotFilterTopMargin } from '../../utils/cordovaOffsets';


export const DrawerHeaderOuterContainer = styled('div', {
  shouldForwardProp: (prop) => !['scrolledDown'].includes(prop),
})(({ scrolledDown }) => (`
  // padding-top: cordovaDualHeaderContainerPadding()
  width: 100%;
  background-color: #fff;
  ${scrolledDown ? 'border-bottom: 1px solid #aaa' : ''};
  ${scrolledDown ? `box_shadow: ${standardBoxShadow('wide')}` : ''};
  ${scrolledDown ? 'display: block' : 'display: none'};
  overflow: hidden;
  position: fixed;
  z-index: 1;
  right: 0;
`));

export const DrawerHeaderInnerContainer = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;


export const DrawerHeaderContentContainer = styled('div')(({ theme }) => (`
  margin: ${() => cordovaBallotFilterTopMargin()} auto 0 auto;
  position: relative;
  max-width: 960px;
  width: 100%;
  z-index: 0;
  ${theme.breakpoints.down('sm')} {
    min-height: 10px;
    //margin: 0 10px;
  }
`));
