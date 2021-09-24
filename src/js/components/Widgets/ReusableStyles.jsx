import styled from 'styled-components';
import cordovaScrollablePaneTopPadding from '../../utils/cordovaScrollablePaneTopPadding';
import { isCordova } from '../../utils/cordovaUtils';
import isMobileScreenSize from '../../utils/isMobileScreenSize';

const PageContentContainer = styled.div`
  position: relative;
  max-width: 960px;
  z-index: 0;
  min-height: 190px;
  margin: 0 auto;
  padding-top: ${() => cordovaScrollablePaneTopPadding()};
  padding-bottom ${() => ((isCordova()) ? '625px' : null)};
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 10px;
    margin: 0 10px;
  }
  // for debugging... ${({ theme }) => ((theme) ? console.log(theme) : console.log(theme))}
 `;

const HeaderContentContainer = styled.div`
  position: relative;
  max-width: 960px;
  z-index: 0;
  margin: 0 auto;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 10px;
    margin: 0 10px;
  }
`;

const RightSideTopLineContainer = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  // padding-left: ${() => ((isCordova()) ? '625px' : '')};;
  padding-right: ${() => ((isMobileScreenSize()) ? '15px' : '')};;

  // z-index: 3; //to float above the account/ProfilePopUp menu option grey div
  // @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
  //   padding-left: ${(props) => (props.cordova ? '0 !important' : 'calc(100% - 147px)')};
  // }
`;


export {
  HeaderContentContainer,
  PageContentContainer,
  RightSideTopLineContainer,
};


