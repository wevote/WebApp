import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FacebookMessengerShareButton } from 'react-share';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import { isAndroid } from '../../utils/cordovaUtils';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';
import webAppConfig from '../../../config';
import CampaignStore from '../../stores/CampaignStore';
import { androidFacebookClickHandler, generateQuoteForSharing, generateSharingLink } from './shareButtonCommon';

class ShareByFacebookDirectMessageButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignX: {},
      numberOfPoliticians: 0,
      politicianListSentenceString: '',
    };
  }

  componentDidMount () {
    // console.log('ShareByFacebookDirectMessageButton componentDidMount');
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('ShareByFacebookDirectMessageButton componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    const campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    let numberOfPoliticians = 0;
    if (campaignXPoliticianList && campaignXPoliticianList.length > 0) {
      numberOfPoliticians = campaignXPoliticianList.length;
    }
    let politicianListSentenceString = '';
    if (numberOfPoliticians > 0) {
      politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    }
    this.setState({
      campaignX,
      numberOfPoliticians,
      politicianListSentenceString,
    });
  }

  generateFullCampaignLink = () => {
    const { campaignXNewsItemWeVoteId } = this.props;
    const { campaignX } = this.state;
    return generateSharingLink(campaignX, campaignXNewsItemWeVoteId);
  }

  saveActionShareButton = () => {
    CampaignSupporterActions.shareButtonClicked(true);
  }

  render () {
    renderLog('ShareByFacebookDirectMessageButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`SendFacebookDirectMessageButton window.location.href: ${window.location.href}`);
    }
    if (!webAppConfig.FACEBOOK_APP_ID) {
      return null;
    }
    const { mobileMode } = this.props;
    const { campaignX, numberOfPoliticians, politicianListSentenceString } = this.state;
    const {
      campaign_title: campaignTitle,
    } = campaignX;
    let linkToBeShared = this.generateFullCampaignLink();
    let linkToBeSharedUrlEncoded = '';
    linkToBeShared = linkToBeShared.replace('https://file:/', 'https://wevote.us/');  // Cordova
    linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
    const quoteForSharing = generateQuoteForSharing(campaignTitle, numberOfPoliticians, politicianListSentenceString);
    const quoteForSharingEncoded = encodeURI(quoteForSharing);
    return (
      <Wrapper>
        <div id="androidFacebook"
             onClick={() => isAndroid() &&
               androidFacebookClickHandler(`${linkToBeSharedUrlEncoded}&t=WeVote`, quoteForSharingEncoded)}
        >
          <FacebookMessengerShareButton
            appId={webAppConfig.FACEBOOK_APP_ID}
            className={mobileMode ? 'material_ui_button_mobile' : ''}
            id="shareOnFacebookButton"
            onClick={this.saveActionShareButton}
            url={`${linkToBeSharedUrlEncoded}`}
            windowWidth={mobileMode ? 350 : 1000}
            windowHeight={mobileMode ? 600 : 600}
            disabled={isAndroid()}
            disabledStyle={isAndroid() ? { opacity: 1 } : {}}
          >
            <div className="material_ui_dark_button">
              <div>
                Send Facebook Direct Message
              </div>
            </div>
          </FacebookMessengerShareButton>
        </div>
      </Wrapper>
    );
  }
}
ShareByFacebookDirectMessageButton.propTypes = {
  campaignXNewsItemWeVoteId: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
  mobileMode: PropTypes.bool,
};

const styles = () => ({
});

const Wrapper = styled('div')`
  width: 100%;
  display: block;
`;

export default withStyles(styles)(ShareByFacebookDirectMessageButton);
