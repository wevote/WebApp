import { Info } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { OfficialStatementSvg } from '../Icons/PoliticianSelfEditIcons';
import { HeaderContentContainer } from '../Style/pageLayoutStyles';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import SettingsWidgetPoliticianStatement from './SettingsWidgetPoliticianStatement';
import PoliticianStore from '../../common/stores/PoliticianStore';


const useStyles = makeStyles(() => ({
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
}));

function SettingsOfficialStatement ({ externalUniqueId, politicianWeVoteId }) {
  const classes = useStyles();
  const [politician, setPolitician] = useState(null);
  const politicianWeVoteIdRef = useRef(politicianWeVoteId);

  const onPoliticianStoreChange = useCallback(() => {
    const currentPoliticianWeVoteId = politicianWeVoteIdRef.current;
    if (currentPoliticianWeVoteId) {
      setPolitician(PoliticianStore.getPoliticianByWeVoteId(currentPoliticianWeVoteId));
      // console.log('PoliticianSelfEditDrawer onAppObservableStoreChange politician:', PoliticianStore.getPoliticianByWeVoteId(currentPoliticianWeVoteId));
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

  renderLog('SettingsOfficialStatement');  // Set LOG_RENDER_EVENTS to log all renders
  return (
    <HeaderContentContainer>
      <Helmet title="Name & Photo - WeVote" />
      <BrowserPushMessage incomingProps={{ externalUniqueId }} />
      <div className="card u-padding-bottom--lg">
        <div className="card-main">
          <HeaderContainer>
            <IconWrapper>
              <OfficialStatementSvg />
            </IconWrapper>
            <h1 className="h2">Official Statement</h1>
          </HeaderContainer>
          <IntroductionWrapper>
            <Info classes={{ root: classes.informationIcon }} />
            Please share with voters an official statement from
            {' '}
            {politician ? politician.politician_name : 'this politician'}
            {' '}
            about why they are running for office.
          </IntroductionWrapper>
          <div>
            <SettingsWidgetPoliticianStatement
              externalUniqueId={externalUniqueId}
              politicianWeVoteId={politicianWeVoteId}
            />
          </div>
        </div>
      </div>
    </HeaderContentContainer>
  );
}
SettingsOfficialStatement.propTypes = {
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

// Fix — adjusted margin to align with h2
const IconWrapper = styled('div')`
  display: flex;
  align-self: center;
  margin-right: 6px;

  svg {
    margin-top: 8px;
    color: black !important;
  }
`;
export default SettingsOfficialStatement;
