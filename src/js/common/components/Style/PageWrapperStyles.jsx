import styled from 'styled-components';


export const ContentInnerWrapperDefault = styled('div')`
`;

export const ContentOuterWrapperDefault = styled('div')`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

export const PageWrapperDefault = styled('div')`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;
