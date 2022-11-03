import styled from 'styled-components';


const RemindContactsImportText = styled('div')(({ theme }) => (`
  color: #6c757d;
  font-size: 18px;
  padding: 0 20px;
  text-align: center;
  width: 350px;
  ${theme.breakpoints.up('sm')} {
    width: 500px;
  }
`));

const RemindMainImageImg = styled('img')`
  width: 150px;
  height: 150px;
`;

export {
  RemindContactsImportText,
  RemindMainImageImg,
};
