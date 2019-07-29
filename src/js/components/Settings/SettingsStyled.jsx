import styled from 'styled-components';

const ImageDescription = styled.div`
  display: flex;
`;

const PreviewImage = styled.img`
  margin-right: 8px;
`;

const DescriptionText = styled.p`
  margin: .5em auto;
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
`;

const GiantTextInput = styled.input`
  font-size: 20px;
  padding: 20px 16px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
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
