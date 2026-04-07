import { TextField } from '@mui/material';
import styled from 'styled-components';

export const ActionChip = styled('button')`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #555;
  background: none;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background: #e8e8e8;
  }
`;

export const ActionDivider = styled('span')`
  width: 1px;
  height: 18px;
  background: #ccc;
  margin: 0 4px;
`;

export const Breadcrumb = styled('div')`
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
`;

export const BreadcrumbAnchor = styled('a')`
  color: #206bc4;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;


export const CandidateActions = styled('div')`
  display: flex;
  align-items: center;
  gap: 4px;
  visibility: hidden;
`;

export const CandidateInfo = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const CandidateList = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const CandidateName = styled('span')`
  font-size: 15px;
  color: #206bc4;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const CandidateParty = styled('span')`
  font-size: 13px;
  color: #666;
`;

export const CandidateRow = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 16px 5px 32px;
  &:not(:last-child) {
    border-bottom: 1.5px solid #ccc;
  }
  &:hover {
    background: #f5f5f5;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
  }
  &:hover ${CandidateActions} {
    visibility: visible;
  }
`;

export const DetailTitle = styled('h2')`
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

export const ElectionLink = styled('span')`
  font-size: 17px;
  color: #206bc4;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const ElectionList = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const ElectionRowActions = styled('div')`
  display: flex;
  align-items: center;
  gap: 4px;
  visibility: hidden;
`;

export const ElectionRow = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 16px;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1.5px solid #ccc;
  }
  &:hover {
    background: #f5f5f5;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
  }
  &:hover ${ElectionRowActions} {
    visibility: visible;
  }
`;

export const ElectionTitleRow = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const ExpandCollapseButton = styled('button')`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 15px;
  color: #555;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  &:hover {
    color: #333;
  }
`;

export const ExpandCollapseRow = styled('div')`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

export const ExpandMoreIcon = styled('span')`
  display: flex;
  align-items: center;
  transition: transform 0.2s;
  transform: ${({ expanded }) => (expanded ? 'rotate(0deg)' : 'rotate(-90deg)')};
`;

export const FilterTab = styled('button')`
  padding: 3px 12px;
  font-size: 13px;
  height: 26px;
  border-radius: 14px;
  border: 1px solid ${({ active }) => (active ? '#2e3c5d' : '#ccc')};
  background: white;
  color: ${({ active }) => (active ? '#2e3c5d' : '#666')};
  font-weight: ${({ active }) => (active ? 600 : 400)};
  cursor: pointer;
  &:hover {
    border-color: #2e3c5d;
  }
`;

export const FilterTabsRow = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const HighlightSpan = styled('span')`
  background-color: #ffd54f;
  font-weight: 600;
`;

export const InlineSearchField = styled(TextField)`
  flex: 1;
  max-width: 280px;
  & .MuiOutlinedInput-root {
    height: 26px;
    font-size: 14px;
    border-radius: 14px;
  }
  & .MuiOutlinedInput-input {
    padding: 4px 0;
  }
  & .MuiInputAdornment-positionEnd {
    margin-right: -12px;
  }
`;

export const NoResults = styled('p')`
  font-size: 14px;
  color: #888;
  padding: 16px 0;
`;

export const OfficeHeaderActions = styled('div')`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 16px;
  visibility: hidden;
`;

export const OfficeHeader = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 0;
  border-bottom: 1.5px solid #ccc;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
  }
  &:hover ${OfficeHeaderActions} {
    visibility: visible;
  }
`;

export const OfficeHeaderLeft = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 4px;
`;

export const OfficeName = styled('span')`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

export const OfficeSection = styled('div')`
`;

export const SearchIconButton = styled('button')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 26px;
  border-radius: 14px;
  border: 1px solid ${({ active }) => (active ? '#2e3c5d' : '#ccc')};
  background: white;
  cursor: pointer;
  color: #555;
  &:hover {
    border-color: #2e3c5d;
  }
`;

export const ShowMoreButton = styled('button')`
  display: block;
  margin: 16px 0;
  padding: 8px 16px;
  font-size: 14px;
  color: #555;
  background: none;
  border: 1px solid #ccc;
  border-radius: 14px;
  cursor: pointer;
  &:hover {
    border-color: #2e3c5d;
    color: #333;
  }
`;

export const SearchResultCount = styled('p')`
  font-size: 18px;
  color: #555;
  margin: 8px 0 8px;
`;

export const SectionTitle = styled('h2')`
  font-size: 24px;
  font-weight: 400;
  color: #333;
  margin: 0;
`;

export const SectionTitleRow = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const StateSelectWrapper = styled('div')`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
`;

export const StateSelectNative = styled('select')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  font-size: 15px;
  z-index: 1;
`;

export const StateSelectLabel = styled('span')`
  font-size: 15px;
  font-weight: 400;
  color: #333;
  white-space: nowrap;
`;


export const StateSelectCaret = styled('span')`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: #555;
  font-size: 18px;
`;


export const TitleWrapper = styled('div')`
  margin-top: 20px;
`;
