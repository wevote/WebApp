import { Launch, Twitter } from '@mui/icons-material';
import {  Button, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import VoterGuidePossibilityActions from '../../actions/VoterGuidePossibilityActions';
import numberAbbreviate from '../../common/utils/numberAbbreviate';
import historyPush from '../../common/utils/historyPush';
import { displayNoneIfSmallerThanDesktop } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import numberWithCommas from '../../common/utils/numberWithCommas';
import CandidateStore from '../../stores/CandidateStore';
import VoterGuidePossibilityStore from '../../stores/VoterGuidePossibilityStore';
import VoterGuidePossibilityPositionStore from '../../stores/VoterGuidePossibilityPositionStore';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../../common/components/Widgets/OfficeNameText'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

/* global $ */

/*
https://localhost:3000/candidate-for-extension?candidate_we_vote_id=wv02cand62599&endorsement_page_url=https%3A%2F%2Fclimatehawksvote.com%2Fendorsements%2Fendorsements-2020%2F&candidate_specific_endorsement_url=http%3A%2F%2Fclimatehawksvote.com%2Fcandidate%2Fcathy-kunkel%2F
*/

// This is related to /js/components/VoterGuide/OrganizationVoterGuideCandidateItem.jsx
class CandidateItemEndorsement extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotItemDisplayName: '',
      candidatePhotoUrl: '',
      candidateSpecificEndorsementUrl: '',
      candidateUrl: '',
      contestOfficeName: '',
      candidateWeVoteId: '',
      localChangeExists: false,
      officeWeVoteId: '',
      politicalParty: '',
      possibilityMoreInfoUrl: '',
      possibilityMoreInfoUrlOriginal: '',
      possibilityOrganizationName: '',
      possibilityPositionIsInfoOnly: false,
      possibilityPositionIsInfoOnlyOriginal: false,
      possibilityPositionIsOppose: false,
      possibilityPositionIsOpposeOriginal: false,
      possibilityPositionIsSupport: false,
      possibilityPositionIsSupportOriginal: false,
      possibilityStatementText: '',
      possibilityStatementTextOriginal: '',
      voterGuidePossibilityPositionId: '',
    };
    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.updatePossibilityStatementText = this.updatePossibilityStatementText.bind(this);
  }

  componentDidMount () {
    // console.log('CandidateItemEndorsement componentDidMount');
    this.onCandidateStoreChange();
    this.onVoterGuidePossibilityStoreChange();
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.voterGuidePossibilityStoreListener = VoterGuidePossibilityStore.addListener(this.onVoterGuidePossibilityStoreChange.bind(this));
    // console.log('CandidateItemEndorsement, this.props:', this.props);
    const { candidateSpecificEndorsementUrlIncoming } = this.props;
    this.setState({
      candidateSpecificEndorsementUrl: candidateSpecificEndorsementUrlIncoming,
    });
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.voterGuidePossibilityStoreListener.remove();
    if (this.doneTimer) clearTimeout(this.doneTimer);
  }

  onCandidateStoreChange () {
    const { candidateWeVoteId, showLargeImage } = this.props;
    // console.log('CandidateItemEndorsement onCandidateStoreChange, candidateWeVoteId:', candidateWeVoteId);
    if (candidateWeVoteId) {
      const candidate = CandidateStore.getCandidateByWeVoteId(candidateWeVoteId);
      // console.log('CandidateItemEndorsement onCandidateStoreChange, candidate:', candidate);
      let candidatePhotoUrl;
      if (showLargeImage && candidate.candidate_photo_url_large) {
        candidatePhotoUrl = candidate.candidate_photo_url_large;
      } else if (candidate.candidate_photo_url_medium) {
        candidatePhotoUrl = candidate.candidate_photo_url_medium;
      } else if (candidate.candidate_photo_url_tiny) {
        candidatePhotoUrl = candidate.candidate_photo_url_tiny;
      }
      const candidateUrl = candidate.candidate_url;
      this.setState({
        ballotItemDisplayName: candidate.ballot_item_display_name,
        // ballotpediaCandidateUrl: candidate.ballotpedia_candidate_url,
        candidatePhotoUrl,
        candidateUrl,
        candidateWeVoteId, // Move into state to signal that all state data is ready
        contestOfficeName: candidate.contest_office_name,
        officeWeVoteId: candidate.contest_office_we_vote_id,
        politicalParty: candidate.party,
        twitterFollowersCount: candidate.twitter_followers_count,
      });
    }
  }

  onVoterGuidePossibilityStoreChange () {
    const { candidateWeVoteId } = this.props;
    const voterGuidePossibilityPosition = VoterGuidePossibilityPositionStore.getVoterGuidePossibilityPositionByCandidateId(candidateWeVoteId);
    const possibilityMoreInfoUrl = voterGuidePossibilityPosition.more_info_url || false;
    const possibilityOrganizationName = voterGuidePossibilityPosition.organization_name || '';
    const possibilityPositionIsInfoOnly = (voterGuidePossibilityPosition && voterGuidePossibilityPosition.position_stance === 'NO_STANCE');
    const possibilityPositionIsOppose = (voterGuidePossibilityPosition && voterGuidePossibilityPosition.position_stance === 'OPPOSE');
    const possibilityPositionIsSupport = (voterGuidePossibilityPosition && voterGuidePossibilityPosition.position_stance === 'SUPPORT');
    const possibilityStatementText = voterGuidePossibilityPosition.statement_text || '';
    const voterGuidePossibilityPositionId = voterGuidePossibilityPosition.possibility_position_id;
    this.setState({
      localChangeExists: false, // Reset
      possibilityMoreInfoUrl,
      possibilityMoreInfoUrlOriginal: possibilityMoreInfoUrl,
      possibilityOrganizationName,
      possibilityPositionIsInfoOnly,
      possibilityPositionIsInfoOnlyOriginal: possibilityPositionIsInfoOnly,
      possibilityPositionIsOppose,
      possibilityPositionIsOpposeOriginal: possibilityPositionIsOppose,
      possibilityPositionIsSupport,
      possibilityPositionIsSupportOriginal: possibilityPositionIsSupport,
      possibilityStatementText,
      possibilityStatementTextOriginal: possibilityStatementText,
      voterGuidePossibilityPositionId,
    });
  }

  getCandidateLink () {
    // If here, we assume the voter is on the Office page
    const { candidateWeVoteId, organizationWeVoteId } = this.props;
    if (candidateWeVoteId) {
      if (organizationWeVoteId) {
        return `/candidate/${candidateWeVoteId}/bto/${organizationWeVoteId}`; // back-to-office
      } else {
        return `/candidate/${candidateWeVoteId}/b/btdo`; // back-to-default-office
      }
    }
    return '';
  }

  getOfficeLink () {
    const { organizationWeVoteId } = this.props;
    const { officeWeVoteId } = this.state;
    if (organizationWeVoteId && organizationWeVoteId !== '') {
      return `/office/${officeWeVoteId}/btvg/${organizationWeVoteId}`; // back-to-voter-guide
    } else if (officeWeVoteId) {
      return `/office/${officeWeVoteId}/b/btdb`; // back-to-default-ballot
    } else return '';
  }

  calculateLocalChangeExists = () => {
    const {
      possibilityMoreInfoUrl, possibilityMoreInfoUrlOriginal,
      possibilityPositionIsInfoOnly, possibilityPositionIsInfoOnlyOriginal,
      possibilityPositionIsOppose, possibilityPositionIsOpposeOriginal,
      possibilityPositionIsSupport, possibilityPositionIsSupportOriginal,
      possibilityStatementText, possibilityStatementTextOriginal,
    } = this.state;
    // console.log(possibilityMoreInfoUrl, possibilityMoreInfoUrlOriginal);
    // console.log(possibilityPositionIsInfoOnly, possibilityPositionIsInfoOnlyOriginal);
    // console.log(possibilityPositionIsOppose, possibilityPositionIsOpposeOriginal);
    // console.log(possibilityPositionIsSupport, possibilityPositionIsSupportOriginal);
    // console.log('original: ', possibilityStatementTextOriginal);
    // console.log('changed:', possibilityStatementText);
    if (possibilityMoreInfoUrl !== possibilityMoreInfoUrlOriginal) return true;
    if (possibilityPositionIsInfoOnly !== possibilityPositionIsInfoOnlyOriginal) return true;
    if (possibilityPositionIsOppose !== possibilityPositionIsOpposeOriginal) return true;
    if (possibilityPositionIsSupport !== possibilityPositionIsSupportOriginal) return true;
    // This isn't totally working...
    return !(possibilityStatementText && possibilityStatementText.localeCompare(possibilityStatementTextOriginal) === 0);
  };

  togglePossibilityPositionIsInfoOnly = () => {
    const { possibilityPositionIsInfoOnly } = this.state;
    if (!possibilityPositionIsInfoOnly) {
      // If prior state is "off", then we are setting this to true
      // so we need to set the other variables to false
      this.setState({
        possibilityPositionIsInfoOnly: !possibilityPositionIsInfoOnly,
        possibilityPositionIsOppose: false,
        possibilityPositionIsSupport: false,
      }, this.updateLocalChangeExists);
    } else {
      this.setState({
        possibilityPositionIsInfoOnly: !possibilityPositionIsInfoOnly,
      }, this.updateLocalChangeExists);
    }
  };

  togglePossibilityPositionIsOppose = () => {
    const { possibilityPositionIsOppose } = this.state;
    if (!possibilityPositionIsOppose) {
      // If prior state is "off", then we are setting this to true
      // so we need to set the other variables to false
      this.setState({
        possibilityPositionIsInfoOnly: false,
        possibilityPositionIsOppose: !possibilityPositionIsOppose,
        possibilityPositionIsSupport: false,
      }, this.updateLocalChangeExists);
    } else {
      this.setState({
        possibilityPositionIsOppose: !possibilityPositionIsOppose,
      }, this.updateLocalChangeExists);
    }
  };

  togglePossibilityPositionIsSupport = () => {
    const { possibilityPositionIsSupport } = this.state;
    if (!possibilityPositionIsSupport) {
      // If prior state is "off", then we are setting this to true
      // so we need to set the other variables to false
      this.setState({
        possibilityPositionIsInfoOnly: false,
        possibilityPositionIsOppose: false,
        possibilityPositionIsSupport: !possibilityPositionIsSupport,
      }, this.updateLocalChangeExists);
    } else {
      this.setState({
        possibilityPositionIsSupport: !possibilityPositionIsSupport,
      }, this.updateLocalChangeExists);
    }
  };

  updateLocalChangeExists = () => {
    const localChangeExists = this.calculateLocalChangeExists();
    // console.log('localChangeExists:', localChangeExists);
    this.setState({
      localChangeExists,
    });
  };

  updatePossibilityMoreInfoUrl = (event) => {
    this.setState({
      possibilityMoreInfoUrl: event.target.value,
    }, this.updateLocalChangeExists);
  };

  updatePossibilityStatementText = (event) => {
    this.setState({
      possibilityStatementText: event.target.value,
    }, this.updateLocalChangeExists);
  };

  submitForReview = () => {
    const {
      voterGuidePossibilityId,
    } = this.props;
    const {
      possibilityMoreInfoUrl, possibilityOrganizationName,
      possibilityPositionIsInfoOnly, possibilityPositionIsOppose, possibilityPositionIsSupport,
      possibilityStatementText,
      voterGuidePossibilityPositionId,
      ballotItemDisplayName, candidateUrl, candidateWeVoteId,
    } = this.state;
    // // If missing these ids, do not proceed
    // if (!voterGuidePossibilityId || !voterGuidePossibilityPositionId) {
    //   console.log('Missing voterGuidePossibilityId:', voterGuidePossibilityId, ', or voterGuidePossibilityPositionId:', voterGuidePossibilityPositionId);
    //   return false;
    // }
    let voterGuidePossibilityPositionIdPythonStyle = voterGuidePossibilityPositionId;
    if (!voterGuidePossibilityPositionId || !Number.isInteger(voterGuidePossibilityPositionId)) {
      voterGuidePossibilityPositionIdPythonStyle = '';
    }

    let positionStance = 'SUPPORT';
    if (possibilityPositionIsInfoOnly) {
      positionStance = 'NO_STANCE';
    } else if (possibilityPositionIsOppose) {
      positionStance = 'OPPOSE';
    } else if (possibilityPositionIsSupport) {
      positionStance = 'SUPPORT';
    }
    const dictionaryToSave = {
      more_info_url: candidateUrl && candidateUrl.length ? candidateUrl : possibilityMoreInfoUrl,
      organization_name: possibilityOrganizationName,
      position_stance: positionStance,
      statement_text: possibilityStatementText,
      ballot_item_name: ballotItemDisplayName,
      candidate_we_vote_id: candidateWeVoteId,
    };
    VoterGuidePossibilityActions.voterGuidePossibilityPositionSave(voterGuidePossibilityId,
      voterGuidePossibilityPositionIdPythonStyle, dictionaryToSave);
    this.doneDisplay('The endorsement has been saved', 1500);
    return true;
  };

  deleteEndorsement = () => {
    const { voterGuidePossibilityId } = this.props;
    const { voterGuidePossibilityPositionId } = this.state;

    let voterGuidePossibilityPositionIdPythonStyle = voterGuidePossibilityPositionId;
    if (!voterGuidePossibilityPositionId || !Number.isInteger(voterGuidePossibilityPositionId)) {
      voterGuidePossibilityPositionIdPythonStyle = '';
    }
    VoterGuidePossibilityActions.voterGuidePossibilityPositionSave(voterGuidePossibilityId,
      voterGuidePossibilityPositionIdPythonStyle, { possibility_should_be_deleted: true });
    this.doneDisplay('This possible endorsement has been removed', 1500);
    return true;
  };

  doneDisplay = (msg, delay) => {
    if (this.doneTimer) clearTimeout(this.doneTimer);
    this.doneTimer = setTimeout(() => {}, delay);  // Don't immediately dismiss the dialog
    // I spent many hours trying to send a message to the parent, asking it to close the iFrame, but was not successful
    // TODO: fix mismatched position ... hidden
    $('#app').replaceWith(`<div style="position: hidden; text-align: center; top: 40%; margin: 50px"><span style="display: inline-block">${msg}</span></div>`);
  }

  goToCandidateLink () {
    // If here, we assume the voter is on the Office page
    historyPush(this.getCandidateLink());
  }

  render () {
    renderLog('CandidateItemEndorsement');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      hideCandidateUrl, showOfficeName,
    } = this.props;
    const {
      ballotItemDisplayName, candidatePhotoUrl, candidateSpecificEndorsementUrl, candidateUrl, candidateWeVoteId,
      contestOfficeName, localChangeExists, politicalParty,
      possibilityMoreInfoUrl, possibilityOrganizationName, voterGuidePossibilityPositionId,
      possibilityPositionIsInfoOnly, possibilityPositionIsOppose, possibilityPositionIsSupport,
      possibilityStatementText, twitterFollowersCount,
    } = this.state;
    if (!candidateWeVoteId) {
      // console.log('CandidateItemEndorsement waiting for candidateWeVoteId to make it into the state variable');
      return null;
    }

    // Themes removed for MUI 5, nested themes are possible, if we need them here
    // const showInfoOnlyTheme = createTheme(adaptV4Theme({
    //   palette: {
    //     primary: {
    //       main: '#888',
    //       contrastText: '#fff',
    //     },
    //   },
    // }));
    //
    // const showOpposeTheme = createTheme(adaptV4Theme({
    //   palette: {
    //     primary: {
    //       main: '#FF7031',
    //       contrastText: '#fff',
    //     },
    //   },
    // }));
    //
    // const showSupportTheme = createTheme(adaptV4Theme({
    //   palette: {
    //     primary: {
    //       main: '#21c06e',
    //       contrastText: '#fff',
    //     },
    //   },
    // }));

    const enableDeletion = voterGuidePossibilityPositionId &&
      parseInt(voterGuidePossibilityPositionId, 10) &&
      parseInt(voterGuidePossibilityPositionId, 10) > 0;

    return (
      <CandidateItemEndorsementWrapper className="card-main u-overflow-hidden candidate-card card-main__no-underline">
        <CandidateWrapper className="card-main__media-object">
          <CandidateInfo>
            <MediaObjectAnchor>
              <Suspense fallback={<></>}>
                <ImageHandler
                  className="card-main__avatar"
                  sizeClassName="icon-office-child "
                  imageUrl={candidatePhotoUrl}
                  alt=""
                  kind_of_ballot_item="CANDIDATE"
                />
              </Suspense>
            </MediaObjectAnchor>
            <Candidate>
              <h2 className="card-main__display-name">
                {ballotItemDisplayName}
              </h2>
              {!!(twitterFollowersCount) && (
                <span
                  className="twitter-followers__badge"
                >
                  <Twitter />
                  <span title={numberWithCommas(twitterFollowersCount)}>{numberAbbreviate(twitterFollowersCount)}</span>
                </span>
              )}
              {(!hideCandidateUrl && candidateUrl) && (
                <ExternalWebSiteWrapper>
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite
                      linkIdAttribute="candidateMobile"
                      url={candidateUrl}
                      target="_blank"
                      className="u-gray-mid"
                      body={(
                        <span>
                          candidate website
                          {' '}
                          <Launch
                            style={{
                              height: 14,
                              marginLeft: 2,
                              marginTop: '-3px',
                              width: 14,
                            }}
                          />
                        </span>
                      )}
                    />
                  </Suspense>
                </ExternalWebSiteWrapper>
              )}
              { contestOfficeName && (
                <div>
                  <Suspense fallback={<></>}>
                    <OfficeNameText
                      officeName={contestOfficeName}
                      politicalParty={politicalParty}
                      showOfficeName={showOfficeName}
                    />
                  </Suspense>
                </div>
              )}
            </Candidate>
          </CandidateInfo>
          <BallotItemSupportOpposeCountDisplayWrapper>
            {/* <BallotItemVoterGuideSupportOpposeDisplay */}
            {/*  organizationInformationOnlyBallotItem={organizationInformationOnlyBallotItem} */}
            {/*  organizationOpposesBallotItem={organizationOpposesBallotItem} */}
            {/*  organizationSupportsBallotItem={organizationSupportsBallotItem} */}
            {/*  organizationImageUrlHttpsTiny={organizationImageUrlHttpsTiny} */}
            {/*  positionWeVoteId={position.position_we_vote_id} */}
            {/* /> */}
          </BallotItemSupportOpposeCountDisplayWrapper>
        </CandidateWrapper>
        <Buttons>
          {/* <MuiThemeProvider theme={possibilityPositionIsSupport ? showSupportTheme : {}}> */}
          <Button
            color="primary"
            onClick={this.togglePossibilityPositionIsSupport}
            variant={possibilityPositionIsSupport ? 'contained' : 'outlined'}
          >
            {possibilityPositionIsSupport ? 'Endorsed' : 'Endorse'}
          </Button>
          {/* </MuiThemeProvider> */}
          {/* <MuiThemeProvider theme={possibilityPositionIsOppose ? showOpposeTheme : {}}> */}
          <Button
            color="primary"
            onClick={this.togglePossibilityPositionIsOppose}
            variant={possibilityPositionIsOppose ? 'contained' : 'outlined'}
          >
            {possibilityPositionIsOppose ? 'Opposed' : 'Oppose'}
          </Button>
          {/* </MuiThemeProvider> */}
          {/* <MuiThemeProvider theme={possibilityPositionIsInfoOnly ? showInfoOnlyTheme : {}}> */}
          <Button
            color="primary"
            onClick={this.togglePossibilityPositionIsInfoOnly}
            variant={possibilityPositionIsInfoOnly ? 'contained' : 'outlined'}
          >
            Information Only
          </Button>
          {/* </MuiThemeProvider> */}
        </Buttons>
        <TextArea
          fullWidth
          label={(
            <span>
              Paste the full text of the endorsement from
              {' '}
              {possibilityOrganizationName}
              {' '}
              about
              {' '}
              {ballotItemDisplayName}
            </span>
          )}
          multiline
          onChange={this.updatePossibilityStatementText}
          placeholder={`Paste the full text of the endorsement from ${possibilityOrganizationName} (if an explanation exists about whey they are endorsing ${ballotItemDisplayName})`}
          rows="4"
          value={possibilityStatementText}
          variant="outlined"
        />
        <TextField
          fullWidth
          label={(
            <span>
              If dedicated endorsement page for
              {' '}
              {ballotItemDisplayName}
              {' '}
              exists, enter URL here
            </span>
          )}
          onChange={this.updatePossibilityMoreInfoUrl}
          placeholder={`If dedicated endorsement page for ${ballotItemDisplayName} exists, enter URL here...`}
          variant="outlined"
          value={(possibilityMoreInfoUrl !== false) ? possibilityMoreInfoUrl : candidateSpecificEndorsementUrl}
        />
        <FourButtons>
          <Button
            variant="outlined"
            color="primary"
            disabled={!enableDeletion}
            onClick={this.deleteEndorsement}
          >
            Delete Endorsement
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!localChangeExists}
            onClick={this.submitForReview}
          >
            Submit for Review
          </Button>
        </FourButtons>
      </CandidateItemEndorsementWrapper>
    );
  }
}
CandidateItemEndorsement.propTypes = {
  candidateWeVoteId: PropTypes.string.isRequired,
  candidateSpecificEndorsementUrlIncoming: PropTypes.string,
  hideCandidateUrl: PropTypes.bool,
  organizationWeVoteId: PropTypes.string,
  showOfficeName: PropTypes.bool,
  showLargeImage: PropTypes.bool,
  voterGuidePossibilityId: PropTypes.node,     // Untyped.  A db id for an existing possibility, 0 for creating a new one on save, and '' for don't create a new one.
};

const styles = () => ({
  input: {
    background: 'white !important',
    marginTop: '-10px !important',
    padding: '6px 12px !important',
  },
});

const Buttons = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% + 16px);
  position: relative;
  margin: 0 -8px;
  margin-top: 24px;
  button {
    font-size: 12px;
    font-weight: bold;
  }
`;

const FourButtons = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: calc(100% + 16px);
  position: relative;
  margin: 0 -8px;
  margin-top: 24px;
  button {
    width: auto;
    font-size: 12px;
  }
`;

const BallotItemSupportOpposeCountDisplayWrapper = styled('div')`
  cursor: pointer;
  float: right;
`;

const CandidateInfo = styled('div', {
  shouldForwardProp: (prop) => !['isClickable'].includes(prop),
})(({ isClickable }) => (`
  ${isClickable ? 'cursor: pointer;' : ''}
  display: flex;
  flex-flow: row nowrap;
`));

const Candidate = styled('div')`
`;

const CandidateItemEndorsementWrapper = styled('div')`
  padding: 10px 16px 8px;
`;

const CandidateWrapper = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
  ${theme.breakpoints.down('sm')} {
    width: 100%;
  }
`));

const ExternalWebSiteWrapper = styled('span')`
  padding-left: 15px;
  white-space: nowrap;
  ${() => displayNoneIfSmallerThanDesktop()};
`;

// Replacing className="card-main__media-object-anchor"
const MediaObjectAnchor = styled('div')`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const TextArea = styled(TextField)`
  margin-top: 16px !important;
  margin-bottom: 16px !important;
  input {
    height: 100px !important;
  }
`;

export default withStyles(styles)(CandidateItemEndorsement);
