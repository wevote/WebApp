import styled from 'styled-components';

const Header = styled.div`
  position: relative;
  width: 100%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  padding: 0 2em;
  margin-top: -72px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  padding-top: 84px;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  width: 960px;
  padding-bottom: 1em;
  height: 48px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: 0 -1em;
  }
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: bold;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 18px;
    margin: auto 0;
  }
`;

export { Title, Container };

export default Header;

