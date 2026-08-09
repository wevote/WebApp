import { TextField, Tooltip, tooltipClasses } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { ElectionStateLabel } from '../../components/Style/BallotTitleHeaderStyles';
import muiTheme from '../../common/components/Style/muiTheme';

const theme = muiTheme;

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
  margin-top: -14px;
  margin-bottom: 8px;
`;

export const BreadcrumbAnchor = styled(Link)`
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

export const CandidateCount = styled('span')`
  font-weight: 200;
  color: ${DesignTokenColors.neutralUI700};
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

// disableFocusListener + disableInteractive: tooltip closes the moment the
// mouse leaves the trigger — doesn't stick around on focus or popper hover.
// eslint-disable-next-line react/jsx-props-no-spreading, react/react-in-jsx-scope
export const DarkTooltip = styled(({ className, ...props }) => (
  <Tooltip disableFocusListener disableInteractive {...props} classes={{ popper: className }} /> // eslint-disable-line react/jsx-props-no-spreading
))`
  & .${tooltipClasses.tooltip} {
    background-color: rgba(0, 0, 0, 0.9);
    color: #fff;
    font-family: "Poppins", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.15px;
    padding: 4px 8px;
    border-radius: 4px;
    max-width: 200px;
    text-align: center;
  }
`;

export const DetailTitle = styled('h2')`
  font-size: 22px;
  font-weight: 500;
  color: ${DesignTokenColors.neutral800};
  margin: 0;
`;

export const ElectionCountForLink = styled('span')`
  color: ${DesignTokenColors.neutralUI500};
  font-weight: 400;
`;

export const ElectionCountForLinkNoData = styled('span')`
  color: ${DesignTokenColors.neutralUI500};
  font-weight: 200;
`;

export const ElectionDateText = styled('span')`
  color: ${DesignTokenColors.neutralUI500};
  font-size: 14px;
  font-weight: 400;
  margin-top: 2px;
  white-space: nowrap;
`;

// Date shown directly under the election title on the ForElection page.
// Color matches ElectionStateLabel so the state line + date frame the title in the same hue.
export const ElectionDetailDate = styled('div')`
  color: ${DesignTokenColors.neutralUI500};
  font-size: 16px;
  font-weight: 400;
  margin-top: 0;
  margin-bottom: 16px;
  white-space: nowrap;
`;

// Slightly larger state label used in the Election Finder header.
// Scoped so the shared ElectionStateLabel stays unchanged on Ballot pages.
export const ElectionFinderStateLabel = styled(ElectionStateLabel)`
  font-size: 15px;
`;

export const ElectionLink = styled('span')`
  font-size: 17px;
  color: #206bc4;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  ${theme.breakpoints.down('md')} {
    font-size: 14px;
  }
`;

export const ElectionList = styled('div')`
  display: flex;
  flex-direction: column;
`;

// ElectionRowActions must precede ElectionRow because ElectionRow's hover
// selector references it via ${ElectionRowActions} (template-literal interpolation
// is evaluated at module-load time).
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

export const ElectionRowText = styled(Link)`
  display: flex;
  flex-direction: column;
`;

export const ElectionTitleRow = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  margin-bottom: 0;
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
    color: ${DesignTokenColors.neutral800};
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
  flex: 1 1 150px;
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

// OfficeHeaderActions must precede OfficeHeader because OfficeHeader's hover
// selector references it via ${OfficeHeaderActions}.
export const OfficeHeaderActions = styled('div')`
  display: flex;
  align-items: center;
  gap: 4px;
  visibility: hidden;
`;

export const OfficeHeader = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 16px 7px 0;
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
  color: ${DesignTokenColors.neutral800};
`;

export const OfficePrimaryPartySpan = styled('span')`
  font-weight: 400;
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

export const SearchResultCount = styled('p')`
  font-size: 18px;
  color: #555;
  margin: 8px 0 8px;
`;

export const SectionTitle = styled('h2')`
  font-size: 24px;
  font-weight: 400;
  color: ${DesignTokenColors.neutral800};
  margin: 0;
`;

export const SectionTitleRow = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
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
    color: ${DesignTokenColors.neutral800};
  }
  ${theme.breakpoints.down('md')} {
    ${isCordova() ? "margin-bottom: 100px;" : "70px"}
  }

`;

export const StateSelectCaret = styled('span')`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: #555;
  font-size: 18px;
`;

export const StateSelectLabel = styled('span')`
  font-size: 15px;
  font-weight: 400;
  color: ${DesignTokenColors.neutral800};
  white-space: nowrap;
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

export const StateSelectWrapper = styled('div')`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
`;
