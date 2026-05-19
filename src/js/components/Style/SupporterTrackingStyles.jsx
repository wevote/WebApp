/* Styled components specific to the ManageMyCandidates > Tracking subtabs
   (Joined / Invited / Reminder needed). Extends the more general primitives
   from Style/ManageMyCandidates (Card, CardList, NameText, etc.). */

import styled from 'styled-components';

import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { Card, CardList, NameText } from './ManageMyCandidates';

/* Small blue text link with optional inline icons, used for inline row actions
   like "Send email invite" / "Re-send text invite" on Invited and Reminder. */
export const ActionLinkButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 500;
  gap: 6px;
  padding: 4px 0;
  white-space: nowrap;

  &:hover {
    color: ${DesignTokenColors.primary700};
    text-decoration: underline;
  }
`;

/* Shared base for a CSS-grid row used in the table-style desktop view of Invited/Reminder.
   Caller supplies $cols (a grid-template-columns string).
   Defined before DesktopGridHeader because DesktopGridHeader extends it. */
export const DesktopGridRow = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$cols',
})`
  align-items: center;
  display: grid;
  gap: 12px;
  grid-template-columns: ${(p) => p.$cols};
`;

/* Header variant of DesktopGridRow: bottom border, column-label styling. */
export const DesktopGridHeader = styled(DesktopGridRow)`
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
  min-width: max-content;
  padding: 8px 14px;
`;

/* Card list that flattens out (no row gap) on desktop, keeps mobile gap from CardList */
export const FlatCardList = styled(CardList)`
  @media (min-width: 576px) {
    gap: 0;
  }
`;

/* Rounded card on mobile (inherits Card's subtle #e5e7eb border + gray bg, matching Joined),
   flat row (no rounded corners, bottom border only) on desktop.
   min-width: max-content ensures the bottom border extends across the full grid row
   when columns overflow the viewport horizontally. */
export const FlatRowCard = styled(Card)`
  background: ${(p) => (p.$selected ? DesignTokenColors.primary50 : DesignTokenColors.neutralUI50)};
  padding: 12px 14px;

  @media (min-width: 576px) {
    background: ${(p) => (p.$selected ? DesignTokenColors.primary50 : DesignTokenColors.whiteUI)};
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
    box-shadow: none;
    min-width: max-content;
  }
`;

/* Full-width rounded pill button used in the mobile card actions */
export const MobileActionPill = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.primary600};
  border-radius: 9999px;
  color: ${DesignTokenColors.primary700};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  width: 100%;

  &:hover {
    background: ${DesignTokenColors.primary50};
  }

  &:disabled {
    background: ${DesignTokenColors.neutralUI50};
    border-color: ${DesignTokenColors.neutralUI300};
    color: ${DesignTokenColors.neutralUI600};
    cursor: default;
  }
`;

/* Mobile vertical stack of action pills under "What you can do" */
export const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

/* Small gray label above a value in the mobile expanded fields */
export const MobileFieldLabel = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
  margin-top: 8px;
`;

/* Bold value paired with MobileFieldLabel */
export const MobileFieldValue = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
  font-weight: 500;
`;

/* Mobile-only toolbar row sitting above the card list (Select all + search etc.) */
export const MobileToolbar = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 12px;
`;

/* Name + checkbox cell for grid-column layouts (Invited/Reminder).
   min-width: 0 + nowrap+ellipsis on the child NameText so long names truncate. */
export const NameCell = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
  min-width: 0;

  ${NameText} {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/* 32x32 transparent icon button, used for the mobile toolbar search affordance */
export const SearchBtn = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${DesignTokenColors.neutralUI700};
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  padding: 0;
  width: 32px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
    color: ${DesignTokenColors.neutralUI900};
  }
`;

/* Inline "Select all" label that wraps a checkbox + text */
export const SelectAllInline = styled.label`
  align-items: center;
  color: ${DesignTokenColors.neutralUI700};
  display: inline-flex;
  font-size: 14px;
  gap: 6px;
  line-height: 1;
  margin: 0;
`;
