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
  max-width: 95%;
  padding-bottom: 1em;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

export { Title, Container };

export default Header;

