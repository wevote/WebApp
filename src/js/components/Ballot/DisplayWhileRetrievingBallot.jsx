import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Suspense, useState, useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import webAppConfig from '../../config';
import BallotStore from '../../stores/BallotStore';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

const LENGTH_AT_WHICH_WE_SUSPECT_ADDRESS_HAS_STREET = 25;
// React functional component example
export default function DisplayWhileRetrievingBallot ({ ballotWithAllItems }) {
  const [showNoBallotItems, setShowNoBallotItems] = useState(false);
  const [stateCode, setStateCode] = useState('');
  const [textForMapSearchTooShort, setTextForMapSearchTooShort] = useState(true);

  useEffect(() => {
    if (!ballotWithAllItems || ballotWithAllItems.length === 0) {
      const timer = setTimeout(() => {
        setShowNoBallotItems(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      return null;
    }
  }, [ballotWithAllItems]);

  useEffect(() => {
    const onBallotStoreChange = () => {
      const substitutedStateCode = BallotStore.getSubstitutedStateCode();
      setStateCode(substitutedStateCode);
      const textForMapSearch = BallotStore.getTextForMapSearch();
      let textForMapSearchTooShortTemp = true;
      if (textForMapSearch && textForMapSearch.length > LENGTH_AT_WHICH_WE_SUSPECT_ADDRESS_HAS_STREET) {
        textForMapSearchTooShortTemp = false;
      }
      setTextForMapSearchTooShort(textForMapSearchTooShortTemp);
    };
    const ballotStoreListener = BallotStore.addListener(onBallotStoreChange);
    onBallotStoreChange();
    return () => {
      ballotStoreListener.remove();
    };
  }, []);

  const showAddBallotItemModal = () => {
    console.log('DisplayWhileRetrievingBallot showAddBallotItemModal');
    AppObservableStore.setShowAddBallotItemModal(true);
  }
  
  const showSelectBallotModalChooseElection = () => {
    const showEditAddress = false;
    const showSelectBallotModal = true;
    // this.props.toggleSelectBallotModal('', showEditAddress, false);
    AppObservableStore.setShowSelectBallotModal(showSelectBallotModal, showEditAddress);
  };

  const showSelectBallotModalEditAddress = (buttonId) => {
    // console.log('DisplayWhileRetrievingBallot showSelectBallotModalEditAddress');
    const dataLayerObject = {
      actionDetails: {
        actionType: 'openModal',
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    const electionDetails = BallotStore.getAnalyticsElectionDetails();
    if (electionDetails && electionDetails.electionDate) {
      dataLayerObject.electionDetails = electionDetails;
    }
    // console.log('dataLayerObject:', dataLayerObject);
    TagManager.dataLayer({ dataLayer: dataLayerObject });

    const showEditAddress = true;
    const showSelectBallotModal = true;
    AppObservableStore.setShowSelectBallotModal(showSelectBallotModal, showEditAddress);
  };

  const loadingJsx = (
    <LoadingWrapper>
      <Suspense fallback={<></>}>
        <DelayedLoad waitBeforeShow={750}>
          <div>
            Connecting with our data providers...
          </div>
        </DelayedLoad>
        <DelayedLoad waitBeforeShow={1500}>
          <div>
            Requesting what is on your ballot...
          </div>
        </DelayedLoad>
        <DelayedLoad waitBeforeShow={2250}>
          <div>
            Waiting for response...
          </div>
        </DelayedLoad>
      </Suspense>
    </LoadingWrapper>
  );

  const noBallotItemsJsx = (
    <LoadingWrapper>
      {textForMapSearchTooShort ? (
        <>
          <NoBallotItemsHeader>
            To find your ballot, please enter a full street address
          </NoBallotItemsHeader>
          <div>
            We weren&apos;t able to find your ballot with your shortened address. Please add your full address and include your house number and ZIP code.
          </div>
          <AddBallotItemWrapper
            id="noDataAddFullAddress"
          >
            <Button
              color="primary"
              id="noDataAddFullAddress"
              onClick={() => showSelectBallotModalEditAddress('noDataAddFullAddress')}
              variant="contained"
            >
              Add full address
            </Button>
          </AddBallotItemWrapper>
        </>
      ) : (
        <>
          <NoBallotItemsHeader>
            We don&apos;t have your ballot items just yet.
          </NoBallotItemsHeader>
          {nextReleaseFeaturesEnabled ? (
            <>
              <div>
                The WeVote political data team, working with our partners, work hard to collect what&apos;s-on-the-ballot data for the entire United States, but it takes time.
                <br />
                <br />
                Help us out and add an upcoming ballot item so you can share your opinion now!
              </div>
              <AddBallotItemWrapper>
                <Button
                  color="primary"
                  id="noDataAddBallotItem"
                  onClick={showAddBallotItemModal}
                  variant="contained"
                >
                  Add ballot item
                </Button>
              </AddBallotItemWrapper>
            </>
          ) : (
            <>
              <div>
                The WeVote political data team, working with our partners, work hard to collect what&apos;s-on-the-ballot data for the entire United States.
                <br />
                <br />
                In the meantime, see other upcoming elections, or find your past ballots.
                <br />
                <br />
              </div>
            </>
          )}
        </>
      )}
      <LinksUnderAddBallotItem>
        <OneLinkWrapper>
          <OneLink
            tabIndex={0}
            to={`/election-finder/${stateCode}`}
          >
            See upcoming elections
          </OneLink>
        </OneLinkWrapper>
        <OneLinkSpacer />
        <OneLinkWrapper>
          <OneLinkDiv
            className="u-cursor--pointer"
            tabIndex={0}
            id="findPastBallot"
            onClick={showSelectBallotModalChooseElection}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showSelectBallotModalChooseElection();
              }
            }}
          >
            Find past ballot
          </OneLinkDiv>
        </OneLinkWrapper>
      </LinksUnderAddBallotItem>
    </LoadingWrapper>
  );

  renderLog('DisplayWhileRetrievingBallot functional component');
  if (!ballotWithAllItems || ballotWithAllItems.length === 0) {
    return showNoBallotItems ? noBallotItemsJsx : loadingJsx;
  } else {
    return null;
  }
}
DisplayWhileRetrievingBallot.propTypes = {
  ballotWithAllItems: PropTypes.array,
};


const AddBallotItemWrapper = styled('div')`
  margin: 20px 0;
`;

const LinksUnderAddBallotItem = styled('div')`
  display: flex;
  justify-content: center;
`;

const LoadingWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 120px;
  width: 100%;
`;

const NoBallotItemsHeader = styled('div')`
  font-size: 1.3rem;
  font-weight: 600;
`;

const OneLink = styled(Link)`
  color: ${DesignTokenColors.primary500};
`;

const OneLinkDiv = styled('div')`
  color: ${DesignTokenColors.primary500};
`;

const OneLinkSpacer = styled('div')`
  margin-right: 20px;
`;

const OneLinkWrapper = styled('div')`
`;
