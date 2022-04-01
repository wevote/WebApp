import styled from 'styled-components';

const ImageDescription = styled('div')(({ theme }) => (`
  display: flex;
  align-items: center;
  ${theme.breakpoints.down('md')} {
    flex-flow: column-reverse;
  }
`));

const PreviewImage = styled('img')`
  margin-right: 8px;
`;

const DescriptionText = styled('span')(({ theme }) => (`
  font-size: 14px;
  margin: .5em auto;
  ${theme.breakpoints.down('md')} {
    min-width: 180px;
  }
`));

const SharingRow = styled('div')`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding: 16px 0;
  padding-top: 20px;
`;

const LinkToDomainRow = styled('div')`
  border-top: 1px solid #eee;
  padding: 16px 0;
  padding-top: 20px;
`;

const SharingColumn = styled('div', {
  shouldForwardProp: (prop) => !['alignRight'].includes(prop),
})(({ alignRight, theme }) => (`
  display: flex;
  flex-flow: column;
  ${alignRight ? 'align-items: flex-end;' : ''}
  padding-right: ${alignRight ? '0' : '8px'};
  ${theme.breakpoints.down('md')} {
    justify-content: center;
  }
`));

const GiantTextInput = styled('input')(({ theme }) => (`
  font-size: 16px;
  padding: 20px 16px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
  ${theme.breakpoints.down('md')} {
    padding: 8px 16px;
    font-size: 16px;
  }
`));

const HiddenInput = styled('input')`
  display: none;
`;

const Actions = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin-top: 1em;
`;

export { ImageDescription, LinkToDomainRow, PreviewImage, DescriptionText, SharingRow, SharingColumn, GiantTextInput, HiddenInput, Actions };
