import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Search as SearchIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import TagManager from 'react-gtm-module';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import PoliticianStore from '../../common/stores/PoliticianStore';

import SupportersJoined from './SupportersJoined';
import SupportersInvited from './SupportersInvited';
import SupportersToRemind from './SupportersToRemind';

function pushDataLayer (buttonId = '', politicianWeVoteId = null) {
  const dataLayerObject = {
    actionDetails: {
      actionType: 'navigate',
      buttonId,
    },
    event: 'action',
    pageDetails: getPageDetails(),
    userDetails: VoterStore.getAnalyticsUserDetails(),
  };
  if (politicianWeVoteId) {
    dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
  }
  TagManager.dataLayer({ dataLayer: dataLayerObject });
}

export default function SupporterTracking ({ selectedPoliticianWeVoteId = null }) {
  const [activeTab, setActiveTab] = useState('joined');

  /**
   * Spoofed records (replace later with DB-backed rows)
   * status: "joined" | "invited" | "reminder"
   */
  const SPOOF = [
    {
      id: 'v_1',
      status: 'joined',
      name: 'Steve Smith',
      endorsed: false,
      friendsInvited: 0,
      messageSentCount: 0,
      publicOpinion:
        '',
    },
    {
      id: 'v_2',
      status: 'joined',
      name: 'Jane Smith',
      endorsed: true,
      friendsInvited: 0,
      messageSentCount: 0,
      publicOpinion: '',
    },
    {
      id: 'v_3',
      status: 'joined',
      name: 'Steve Smith',
      endorsed: true,
      friendsInvited: 0,
      messageSentCount: 0,
      publicOpinion:
        'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet...',
    },
    {
      id: 'v_4',
      status: 'joined',
      name: 'Jen Smith',
      endorsed: true,
      friendsInvited: 2,
      messageSentCount: 0,
      publicOpinion:
        'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet...',
    },
    {
      id: 'v_5',
      status: 'joined',
      name: 'Mary Smith',
      endorsed: true,
      friendsInvited: 2,
      messageSentCount: 1,
      publicOpinion:
        'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet...',
    },

    // A couple non-joined for tabs
    // {
    //   id: "v_6",
    //   status: "invited",
    //   name: "Alex Doe",
    //   endorsed: false,
    //   friendsInvited: 0,
    //   messageSentCount: 0,
    //   publicOpinion: "",
    // },
    {
      id: 'v_6',
      status: 'invited',
      joined: true,
      name: 'Alex Doe',
      emailInviteSent: true,
      textInviteSent: true,
      inviteLinkClicked: true,
      friendsInvited: 2,

    },
    {
<<<<<<< HEAD
      id: 'v_7',
      status: 'remind',
      name: 'Morgan Lee',
      endorsed: false,
      friendsInvited: 0,
      messageSentCount: 0,
      publicOpinion: '',
=======
      id: "v_7",
      status: "remind",
      reminderSubStatus: "invited",
      name: "John Smith",
      emailInviteSent: true,
      textInviteSent: false,
      invitedDaysAgo: 9,
    },
    {
      id: "v_10",
      status: "remind",
      reminderSubStatus: "invited",
      name: "James Smith",
      emailInviteSent: false,
      textInviteSent: true,
      invitedDaysAgo: 11,
    },
    {
      id: "v_11",
      status: "remind",
      reminderSubStatus: "invited",
      name: "Jennifer Smith",
      emailInviteSent: true,
      textInviteSent: true,
      invitedDaysAgo: 14,
    },
    {
      id: "v_12",
      status: "remind",
      reminderSubStatus: "joined",
      name: "Morgan Lee",
      joined: true,
      endorsed: false,
      friendsInvited: 0,
      joinedDaysAgo: 8,
>>>>>>> 1d9705cf5a6023dac924f6059d55e5d21c035faf
    },
    {
      id: 'v_8',
      status: 'invited',
      joined: false,
      name: 'Alex Doe',
      emailInviteSent: false,
      textInviteSent: true,
      inviteLinkClicked: false,
      friendsInvited: 0,
    },
    {
      id: 'v_9',
      status: 'invited',
      joined: false,
      name: 'SuperLong FirstNameLastName',
      emailInviteSent: true,
      textInviteSent: false,
      inviteLinkClicked: false,
      friendsInvited: 0,
    },
  ];

  const counts = useMemo(() => {
    const c = { joined: 0, invited: 0, remind: 0 };
    for (const r of SPOOF) c[r.status] += 1;
    return c;
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'joined':
        return <SupportersJoined supporters={SPOOF.filter((r) => r.status === 'joined')}/>;
      case 'invited':
        return <SupportersInvited supporters={SPOOF.filter((r) => r.status === 'invited')}/>;
      case 'remind':
        return <SupportersToRemind supporters={SPOOF.filter((r) => r.status === 'remind')}/>;
      default:
        return <SupportersJoined supporters={SPOOF.filter((r) => r.status === 'joined')}/>;
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [buttonEl, setButtonEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleToggle = (e) => {
    setAnchorEl((prev) => (prev ? null : e.currentTarget));
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <HeaderRow className="u-show-desktop-tablet">
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
      <SubHeaderRow>
        <TrackingText>Follow up on your invitees and those who joined.</TrackingText>
        <InfoIconButton onClick={handleToggle} aria-label="Info">
          <InfoOutlinedIcon fontSize="small" />
        </InfoIconButton>
      </SubHeaderRow>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          style: {
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <PopoverContainer>
          <PopoverArrow />

          <PopoverHeader>
            <PopoverTitle>Sentiments and opinions</PopoverTitle>
            <PopoverCloseButton onClick={handleClose} aria-label="Close">
              <CloseIcon fontSize="small" />
            </PopoverCloseButton>
          </PopoverHeader>

          <PopoverBody>
            Sentiments and opinions posted by WeVote members are private by
            default. You can view them only if the member chooses to make them
            public.
          </PopoverBody>
        </PopoverContainer>
      </Popover>
      <TabRow>
        <Tab
          id="trackingJoinedWeVoteTab"
          active={activeTab === 'joined'}
          onClick={() => { pushDataLayer('trackingJoinedWeVoteTab', selectedPoliticianWeVoteId); setActiveTab('joined'); }}
          data-hidden-bold-text={`Joined WeVote (${counts['joined']})`}
        >
          Joined WeVote
          (
          {counts['joined']}
          )
        </Tab>
        <Tab
          id="trackingInvitedTab"
          active={activeTab === 'invited'}
          onClick={() => { pushDataLayer('trackingInvitedTab', selectedPoliticianWeVoteId); setActiveTab('invited'); }}
          data-hidden-bold-text={`Invited (${counts['invited']})`}
        >
          Invited
          (
          {counts['invited']}
          )
        </Tab>
        <Tab
          id="trackingReminderNeededTab"
          active={activeTab === 'remind'}
          onClick={() => { pushDataLayer('trackingReminderNeededTab', selectedPoliticianWeVoteId); setActiveTab('remind'); }}
          data-hidden-bold-text={`Reminder needed (${counts['remind']})`}
        >
          Reminder needed
          (
          {counts['remind']}
          )
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

const InfoIconButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${DesignTokenColors.neutralUI700};
  cursor: pointer;
  display: inline-flex;
  padding: 4px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
    color: ${DesignTokenColors.neutralUI900};
  }
`;

const PopoverArrow = styled.div`
  position: absolute;
  top: -8px;
  left: 16px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid ${DesignTokenColors.neutralUI900};
`;

const PopoverBody = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: ${DesignTokenColors.neutralUI200};
`;

const PopoverCloseButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.neutralUI50};
  cursor: pointer;
  display: inline-flex;
  padding: 2px;
`;

const PopoverContainer = styled.div`
  background: ${DesignTokenColors.neutralUI900};
  color: ${DesignTokenColors.neutralUI50};
  border-radius: 12px;
  padding: 12px;
  width: 320px;
  position: relative;
`;

const PopoverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const PopoverTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
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

const SubHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 6px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 12px 16px 4px 16px;
  font-size: 15px;
  font-weight: ${(props) => (props.active ? '600' : '500')};
  color: ${(props) => (props.active ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI700)};
  border-bottom: 2px solid ${(props) => (props.active ? DesignTokenColors.primary600 : 'transparent')};
  cursor: pointer;
  position: relative;
  bottom: -1px;
  white-space: nowrap;
  overflow:hidden;
  text-overflow: ellipsis;

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

    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;      /* avoid multi-line affecting layout */
    text-overflow: clip;      /* optional */
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
  margin-bottom: 4px;
`;

const TrackingText = styled.p`
  color: ${DesignTokenColors.neutralUI700};
  margin: 0;
`;
