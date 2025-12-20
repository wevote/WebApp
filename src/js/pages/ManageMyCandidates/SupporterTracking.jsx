import React, { useState } from 'react';
import styled from 'styled-components';
import { Search as SearchIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

import SupportersJoined from './SupportersJoined';
import SupportersInvited from './SupportersInvited';
import SupportersToRemind from './SupportersToRemind';

export default function SupporterTracking () {
  const [activeTab, setActiveTab] = useState('joined');

  // TO DO: Replace these placeholders with actual logic
  const joinedCount = 3;
  const invitedCount = 3;
  const remindCount = 1;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'joined':
        return <SupportersJoined />;
      case 'invited':
        return <SupportersInvited />;
      case 'remind':
        return <SupportersToRemind />;
      default:
        return <SupportersJoined />;
    }
  };

  return (
    <>
      <HeaderRow>
        <H2>Tracking</H2>
        <HeaderDivider />
        <SearchIconButton
          type="button"
          aria-label="Search"
          onClick={() => console.log('TODO: implement search feature')}
        >
          <SearchIcon fontSize="medium" />
        </SearchIconButton>
      </HeaderRow>
      <TrackingText>Follow up on your invitees and those who joined.</TrackingText>
      <TabRow>
        <Tab
          active={activeTab === 'joined'}
          onClick={() => setActiveTab('joined')}
          data-hidden-bold-text={`Joined WeVote (${joinedCount})`}
        >
          Joined WeVote ({joinedCount})
        </Tab>
        <Tab
          active={activeTab === 'invited'}
          onClick={() => setActiveTab('invited')}
          data-hidden-bold-text={`Invited (${invitedCount})`}
        >
          Invited ({invitedCount})
        </Tab>
        <Tab
          active={activeTab === 'remind'}
          onClick={() => setActiveTab('remind')}
          data-hidden-bold-text={`Reminder needed (${remindCount})`}
        >
          Reminder needed ({remindCount})
        </Tab>
      </TabRow>
      <TabContent>
        {renderTabContent()}
      </TabContent>
    </>
  );
}

// Styles

const H2 = styled.h2`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 20px;
  font-weight: 400;
  margin: 0;
`;

const HeaderDivider = styled.span`
  border-left: 1.5px solid ${DesignTokenColors.neutralUI100};
  height: 30px;
  margin: 0 4px 0 12px;
`;

const HeaderRow = styled.div`
  align-items: center;
  display: flex;
  gap: 2px;
  margin: -6px 0 8px;
`;

const SearchIconButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${DesignTokenColors.neutralUI700};
  cursor: pointer;
  display: inline-flex;
  padding: 6px;
  &:hover {
    background: ${DesignTokenColors.neutralUI50};
    color: ${DesignTokenColors.neutralUI900};
  }
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 12px 16px 4px 16px;
  font-size: 15px;
  font-weight: ${props => props.active ? '600' : '500'};
  color: ${props => props.active ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI700};
  border-bottom: 2px solid ${props => props.active ? DesignTokenColors.primary600 : 'transparent'};
  cursor: pointer;
  position: relative;
  bottom: -1px;

  // We use data-hidden-bold-text to render an invisible bolded duplicate of the tab's text
  // so there's no awkward shiftiness in the layout when switching between tabs.
  // It's hidden visually, un-interactable, and hidden from screen readers.
  &::after {
    content: attr(data-hidden-bold-text);
    height: 0;
    visibility: hidden;
    overflow: hidden;
    user-select: none;
    pointer-events: none;
    font-weight: 600;
    display: block;
    @media speech {
      display: none;
    }
  }
  &:hover {
    color: ${DesignTokenColors.primary600};
  }
`;

const TabContent = styled.div`
  flex: 1;
`;

const TabRow = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
  margin-bottom: 24px;
`;

const TrackingText = styled.p`
  color: ${DesignTokenColors.neutralUI700};
  margin: 0 0 6px;
`;
