import styled from 'styled-components';


const PageContentContainer = styled.div`
  position: relative;
  max-width: 960px;
  z-index: 0;
  min-height: 190px;
  margin: 0 auto;
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

export {
  HeaderContentContainer,
  PageContentContainer,
};


