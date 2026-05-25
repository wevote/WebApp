import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense, useCallback, useEffect, useRef } from 'react';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import ModalDisplayTemplateA from '../ModalDisplayTemplateA';
import AppObservableStore from '../../../common/stores/AppObservableStore';
import PoliticianStore from '../../../common/stores/PoliticianStore';
import VoterStore from '../../../stores/VoterStore';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../../utils/lookupPageNameAndPageTypeDict';
import webAppConfig from '../../../config';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../../common/components/Widgets/OpenExternalWebSite'));

const termsOfServiceURL = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/terms`;
const privacyPolicyURL = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/privacy`;

function MakePublicGateModal ({ classes, politicianWeVoteId }) {
  const campaignXWeVoteIdRef = useRef('');
  // const [passkey, setPasskey] = useState('');
  const politicianWeVoteIdRef = useRef(politicianWeVoteId);

  function sendGTMDataLayer (actionType = 'openModal', buttonId = '', destinationPageName = '') {
    const { location: { pathname: currentPathname } } = window;
    const destinationPage = lookupPageNameAndPageTypeDict(currentPathname);
    const dataLayerObject = {
      actionDetails: {
        actionType,
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    if (destinationPageName) {
      dataLayerObject.destinationDetails = {
        destinationPageName: destinationPageName || 'notSet',
        destinationPageType: destinationPage.pageType || 'notSet',
        destinationPathname: currentPathname,
      };
    }
    if (politicianWeVoteId) {
      dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  const handleCloseMakePublicGateModal = (buttonId) => {
    AppObservableStore.setShowMakePublicGateModal(false);
    sendGTMDataLayer('closeModal', buttonId);
  };

  const openSignInModal = (buttonId) => {
    AppObservableStore.setShowMakePublicGateModal(false);
    AppObservableStore.setShowSignInModal(true);
    sendGTMDataLayer('openModal', buttonId, 'SignInModal');
  };

  const onPoliticianStoreChange = useCallback(() => {
    const currentPoliticianWeVoteId = politicianWeVoteIdRef.current;
    if (currentPoliticianWeVoteId) {
      const politician = PoliticianStore.getPoliticianByWeVoteId(currentPoliticianWeVoteId);
      if (politician.linked_campaignx_we_vote_id) {
        campaignXWeVoteIdRef.current = politician.linked_campaignx_we_vote_id;
        // console.log('onPoliticianStoreChange, politician linked_campaignx_we_vote_id: ', politician.linked_campaignx_we_vote_id);
      }
    }
  }, []);

  const onVoterStoreChange = useCallback(() => {
  }, []);

  useEffect(() => {
    // console.log('VoterPositionEntryAndDisplay useEffect, politicianWeVoteId: ', politicianWeVoteId);
    politicianWeVoteIdRef.current = politicianWeVoteId;
    if (politicianWeVoteId) {
      onPoliticianStoreChange();
    }
  }, [onPoliticianStoreChange, politicianWeVoteId]);

  useEffect(() => {
    const politicianStoreListener = PoliticianStore.addListener(onPoliticianStoreChange);
    onPoliticianStoreChange();
    return () => {
      politicianStoreListener.remove();
    };
  }, [onPoliticianStoreChange]);

  useEffect(() => {
    const voterStoreListener = VoterStore.addListener(onVoterStoreChange);
    onVoterStoreChange();
    return () => {
      voterStoreListener.remove();
    };
  }, [onVoterStoreChange]);

  const dialogTitleJsx = (
    <>
    </>
  );

  const textFieldJsx = (
    <MakePublicGateModalContainer>
      <TitleText>Nice work choosing to make your opinion public!</TitleText>
      <HorizontalLine />
      <SubTitleText>Your public opinion will help others decide how to vote.</SubTitleText>
      <Options buttons="1">
        <Button
          classes={{root: classes.signInButton}}
          id="makePublicOpinionSignIn"
          variant="contained"
          color="primary"
          onClick={() => openSignInModal('makePublicOpinionSignIn')}
        >
          <span className="u-show-mobile">
            Sign in to make opinion public
          </span>
          <span className="u-show-desktop-tablet">
            Sign in to make your opinion public
          </span>
        </Button>
      </Options>
      <Options buttons="1">
        <Button
          classes={{root: classes.signInButton }}
          id="makePublicOpinionDontSignIn"
          variant="outlined"
          color="primary"
          onClick={() => handleCloseMakePublicGateModal('makePublicOpinionDontSignIn')}
        >
          Continue without signing in
        </Button>
      </Options>
      <HelperText>
        Signing in is optional. Takes about 30 seconds. Free forever.
      </HelperText>
      <TermsWrapper id="terms_Wrapper">
        By continuing, you accept WeVote.US’s
        <br />
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            className="open-web-site"
            body={(
              <span>
                Terms of Service
              </span>
            )}
            linkIdAttribute="openTermsOfService"
            target="_blank"
            url={termsOfServiceURL}
          />
        </Suspense>
        {' '}
        and
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="openPrivacyPolicy"
            url={privacyPolicyURL}
            target="_blank"
            className="open-web-site open-web-site__no-right-padding"
            body={(
              <span>
                Privacy Policy
              </span>
            )}
          />
        </Suspense>
        .
      </TermsWrapper>
    </MakePublicGateModalContainer>
  );

  return (
    <ModalDisplayTemplateA
      dialogTitleJSX={dialogTitleJsx}
      toggleModal={() => handleCloseMakePublicGateModal('cancelMakePublicGateModal')}
      show={AppObservableStore.showMakePublicGateModal()}
      textFieldJSX={textFieldJsx}
      tallMode
    />
  );
}

MakePublicGateModal.propTypes = {
  classes: PropTypes.object,
  politicianWeVoteId: PropTypes.string,
};

const styles = (theme) => ({
  button: {
    width: '100%',
  },
  signInButton: {
    width: '70%',
    minHeight: '40px',
    padding: '8px 16px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
});

const HelperText = styled('div')`
  font-size: 14px;
  font-weight: 600;
  color: #777;
  text-align: center;
  line-height: 1.4;
  padding: 14px;
`;

const HorizontalLine = styled('div')(({ theme }) => (`
  background-color: #A9A9A9;
  height: 2px;
  margin: 0 72px;
  margin-bottom: 8px;
  margin-top: 0;
  ${theme.breakpoints.down('md')} {
    margin: 0 24px 8px 24px;
  }
`));

const MakePublicGateModalContainer = styled('div')`
  margin: 8px 0 24px 0;
`;

const Options = styled('div')(({ buttons }) => (`
  display: flex;
  flex-flow: ${buttons > 1 ? 'row' : 'column'};
  ${buttons > 1 ? 'justify-content: space-between;' : 'align-items: center;'};
  margin-top: 1em;
`));

const SubTitleText = styled('div')`
  width: 100%;
  display: block;
  text-align: center;
  margin: 0 auto;
  padding: 0 16px;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.4;
  color: #4B4B4B;
`;

const TermsWrapper = styled('div')(({ theme }) => (`
  margin-top: 30px;
  font-size: 13px;
  font-weight: 400;
  text-align: center;
  // ${theme.breakpoints.down('sm')} {
  //   padding-top: 30px;
  // }
`));

const TitleText = styled('div')`
  font-weight: 600;
  font-size: 26px;
  // font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  color: #206DB3;
  margin: 0 auto 4px auto;
  padding: 0 16px;
  width: 100%;
  text-align: center;
  line-height: 1.3;
`;

export default withStyles(styles)(MakePublicGateModal);
