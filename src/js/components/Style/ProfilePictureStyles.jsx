import styled from 'styled-components';
import { RadioGroup } from '@mui/material';


export const ColumnWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const CustomColumns = styled('div').withConfig({
  shouldForwardProp: (prop) => !['onlyOneOption'].includes(prop),
})(({ onlyOneOption }) => (`
  ${onlyOneOption ? 'width: 100% !important;' : 'width: 49% !important;'}
`));

export const ProfilePicture = styled('img')`
  border-radius: 100px;
  margin: 0 auto;
  max-height: 100px;
  max-width: 100px;
`;

export const ProfilePictureOption = styled('div')`
  align-items: flex-start;
  border: 2px solid #e8e8e8;
  border-radius: 3px;
  display: flex !important;
  flex-direction: column;
  min-height: 250px;
  padding: 4px 12px 12px 12px;
  width: 100%;
  margin-bottom: 3px;
`;

export const ProfilePictureWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 9px;
  margin-bottom: 26px;
  width: 100%;
`;

export const RadioWrapper = styled(RadioGroup)`
`;

export const SaveInnerWrapper = styled('div')`
  display: flex;
`;

export const SaveOuterWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  padding: 0 0 8px 0;
`;

export const Separator = styled('div')`
  width: 100%;
  margin: 12px 0;
  background: #e8e8e8;
  height: 1px;
`;
