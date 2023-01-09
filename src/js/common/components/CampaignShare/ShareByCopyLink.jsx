import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import { renderLog } from '../../utils/logging';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import { openSnackbar } from '../Widgets/SnackNotifier';
import { generateSharingLink } from './shareButtonCommon';

class ShareByCopyLink extends Component {
  constructor (props) {
    super(props);
    this.state = {
      copyLinkCopied: false,
      shareModalStep: '',
    };

    this.copyLink = this.copyLink.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount () {
    // console.log('ShareByCopyLink componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onAppObservableStoreChange();
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('ShareByCopyLink componentDidUpdate');
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
    // console.log('componentWillUnmount');
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const { shareModalStep } = this.state;
    const newShareModalStep = AppObservableStore.getShareModalStep();
    if (newShareModalStep !== shareModalStep) {
      // If we change modes, reset the copy link state
      this.setState({
        copyLinkCopied: false,
      });
    }
    this.setState({
      shareModalStep: newShareModalStep,
    });
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    this.setState({
      campaignX,
    });
  }

  onClick = () => {
    // console.log('ShareByCopyLink onClick function');
    if (this.props.onClickFunction) {
      this.props.onClickFunction();
    }
  }

  generateFullCampaignLink = () => {
    const { campaignXNewsItemWeVoteId } = this.props;
    const { campaignX } = this.state;
    return generateSharingLink(campaignX, campaignXNewsItemWeVoteId);
  }

  copyLink () {
    // console.log('ShareByCopyLink copyLink');
    CampaignSupporterActions.shareButtonClicked(true);
    openSnackbar({ message: 'Copied!' });
    this.setState({
      copyLinkCopied: true,
    });
    if (this.props.onClickFunction) {
      this.props.onClickFunction();
    }
  }

  render () {
    renderLog('ShareByCopyLink');  // Set LOG_RENDER_EVENTS to log all renders
    const { darkButton, mobileMode, uniqueExternalId } = this.props;
    const { copyLinkCopied } = this.state;
    const linkToBeShared = this.generateFullCampaignLink();
    return (
      <Wrapper>
        <CopyToClipboard text={linkToBeShared} onCopy={this.copyLink}>
          <div className={mobileMode ? 'material_ui_button_mobile' : ''} id={`shareByCopyLink-${uniqueExternalId}`}>
            <div className={darkButton ? 'material_ui_dark_button' : 'material_ui_light_button'}>
              <div>
                {copyLinkCopied ? 'Link copied!' : 'Copy link'}
              </div>
            </div>
          </div>
        </CopyToClipboard>
      </Wrapper>
    );
  }
}
ShareByCopyLink.propTypes = {
  campaignXNewsItemWeVoteId: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
  darkButton: PropTypes.bool,
  mobileMode: PropTypes.bool,
  onClickFunction: PropTypes.func,
  uniqueExternalId: PropTypes.string,
};

const styles = () => ({
  copyLinkIcon: {
    background: '#000',
  },
  copyLinkIconCopied: {
    background: '#1fc06f',
  },
});

const Wrapper = styled('div')`
  cursor: pointer;
  display: block !important;
  @media (min-width: 600px) {
    flex: 1 1 0;
  }
  height: 100%;
  text-align: center;
  text-decoration: none !important;
  color: black !important;
  transition-duration: .25s;
  &:hover {
    text-decoration: none !important;
    color: black !important;
    transition-duration: .25s;
  }
`;

export default withTheme(withStyles(styles)(ShareByCopyLink));
