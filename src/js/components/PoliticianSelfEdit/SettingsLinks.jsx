import { Info } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { HeaderContentContainer } from '../Style/pageLayoutStyles';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import SettingsWidgetLinkCampaignWebsite from './SettingsWidgetLinkCampaignWebsite';
// import PoliticianStore from '../../common/stores/PoliticianStore';


const useStyles = makeStyles(() => ({
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
}));

function SettingsLinks ({ externalUniqueId, politicianWeVoteId }) {
  const classes = useStyles();
  const politicianWeVoteIdRef = useRef(politicianWeVoteId);

  const onPoliticianStoreChange = useCallback(() => {
    const currentPoliticianWeVoteId = politicianWeVoteIdRef.current;
    if (currentPoliticianWeVoteId) {
      // setPolitician(PoliticianStore.getPoliticianByWeVoteId(currentPoliticianWeVoteId));
      // console.log('SettingsLinks onPoliticianStoreChange politician:', PoliticianStore.getPoliticianByWeVoteId(currentPoliticianWeVoteId));
    }
  }, []);

  useEffect(() => {
    // console.log('VoterPositionEntryAndDisplay useEffect, politicianWeVoteId: ', politicianWeVoteId);
    politicianWeVoteIdRef.current = politicianWeVoteId;
    if (politicianWeVoteId) {
      onPoliticianStoreChange();
    }
  }, [politicianWeVoteId]);

  useEffect(() => {
    AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
  }, []);

  renderLog('SettingsLinks');  // Set LOG_RENDER_EVENTS to log all renders
  return (
    <HeaderContentContainer>
      <Helmet title="Name & Photo - WeVote" />
      <BrowserPushMessage incomingProps={{ externalUniqueId }} />
      <div className="card u-padding-bottom--lg">
        <div className="card-main">
          <HeaderContainer>
            <IdIcon />
            <h1 className="h2">Your Website</h1>
          </HeaderContainer>
          <IntroductionWrapper>
            <Info classes={{ root: classes.informationIcon }} />
            Please share with voters the web link to your campaign website.
          </IntroductionWrapper>
          <div>
            <SettingsWidgetLinkCampaignWebsite
              externalUniqueId={externalUniqueId}
              politicianWeVoteId={politicianWeVoteId}
            />
          </div>
        </div>
      </div>
    </HeaderContentContainer>
  );
}
SettingsLinks.propTypes = {
  externalUniqueId: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
};

const IntroductionWrapper = styled('div')`
  margin-bottom: 12px;
`;

const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
`;

const IdIcon = styled(AccountBoxIcon)`
  color: black;
  height: 23px;
  width: 23px;
  margin: 8px 8px 0 -2px;
`;

export default SettingsLinks;
