import styled from 'styled-components';

const ImageDescription = styled.div`
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: column-reverse;
  }
`;

const PreviewImage = styled.img`
  margin-right: 8px;
`;

const DescriptionText = styled.p`
  font-size: 14px;
  margin: .5em auto;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-width: 180px;
  }
`;

const SharingRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding: 16px 0;
  padding-top: 20px;
`;

const SharingColumn = styled.div`
  display: flex;
  flex-flow: column;
  ${({ alignRight }) => (alignRight ? 'align-items: flex-end;' : '')}
  padding-right: ${({ alignRight }) => (alignRight ? '0' : '8px')};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const GiantTextInput = styled.input`
  font-size: 16px;
  padding: 20px 16px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 8px 16px;
    font-size: 16px;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1em;
`;

export { ImageDescription, PreviewImage, DescriptionText, SharingRow, SharingColumn, GiantTextInput, HiddenInput, Actions };
