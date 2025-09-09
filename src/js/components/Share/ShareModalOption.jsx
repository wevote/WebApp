import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import { openSnackbar } from '../../common/components/Widgets/SnackNotifier';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import { generateShareLinks } from './ShareModalText';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

class ShareModalOption extends Component {
  constructor (props) {
    super(props);
    this.state = {
      copyLinkCopied: false,
      whatAndHowMuchToShare: '',
    };
  }

  componentDidMount () {
    // console.log('Candidate componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onAppObservableStoreChange();
  }

  componentWillUnmount () {
    // console.log('componentWillUnmount');
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const { whatAndHowMuchToShare } = this.state;
    const newWhatAndHowMuchToShare = AppObservableStore.getWhatAndHowMuchToShare();
    if (newWhatAndHowMuchToShare !== whatAndHowMuchToShare) {
      this.setState({ copyLinkCopied: false });
    }
    this.setState({ whatAndHowMuchToShare: newWhatAndHowMuchToShare });
  }

  onClick = () => {
    // console.log('ShareModalOption onClick function');
    const { uniqueExternalId } = this.props;

    if (this.props.onClickFunction) {
      this.props.onClickFunction();
    }

    if ((uniqueExternalId || '').toLowerCase().includes('friends')) {
      // Prefer the URL provided by parent (already resolved); fall back to generator
      let urlShared = this.props.urlToShare || '';
      if (!urlShared) {
        const { linkToBeShared } = generateShareLinks();
        urlShared = linkToBeShared || '';
      }

      const dataLayerObject = {
        event: 'share',
        actionDetails: {
          actionType: 'share',
          buttonId: uniqueExternalId,
        },
        pageDetails: getPageDetails(),
        shareDetails: {
          shareType: 'ballot',
          shareDestination: 'weVoteFriends',
          urlShared,
          howMuchToShare: AppObservableStore.getWhatAndHowMuchToShare(),
        },
        userDetails: VoterStore.getAnalyticsUserDetails(),
      };
      TagManager.dataLayer({ dataLayer: dataLayerObject });
    }
  };

  // onCopyToClipboardClick = () => {
  //   openSnackbar({ message: 'Copied!' });
  //   this.setState({
  //     copyLinkCopied: true,
  //   });
  // }
  //  onClick={this.onCopyToClipboardClick}

  copyLink = (buttonId) => {
    // console.log('ShareModalOption copyLink');
    openSnackbar({ message: 'Copied!' });
    this.setState({
      copyLinkCopied: true,
    });
    if (this.props.onClickFunction) {
      this.props.onClickFunction();
    }
    const dataLayerObject = {
      actionDetails: {
        actionType: 'share',
        buttonId,
      },
      event: 'ShareModalCopyLinkClick',
      shareDetails: {
        shareType: 'ballot',
        shareDestination: this.props.title || 'copyLink',
        urlShared: this.props.urlToShare || '',
        howMuchToShare: AppObservableStore.getWhatAndHowMuchToShare(),
      },
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    // console.log('DataLayer for ShareModal Copy Link:', dataLayerObject);
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  render () {
    renderLog('ShareModalOption');  // Set LOG_RENDER_EVENTS to log all renders
    const { backgroundColor, classes, copyLink, icon, urlToShare, noLink, title, uniqueExternalId } = this.props;
    const { copyLinkCopied } = this.state;
    let urlToBeShared = '';
    if (urlToShare) {
      // urlToBeShared = urlToShare.replace(/https:\/\/file:.*?\/|https:\/\/localhost.*?\//, 'https://wevote.us/');
      urlToBeShared = urlToShare.replace(/https:\/\/file:.*?\//, 'https://wevote.us/'); // Want to leave localhost URL in place
    }
    // console.log('ShareModalOption copyLink:', copyLink, ', noLink:', noLink, 'urlToShare:', urlToShare, ', urlToBeShared:', urlToBeShared);
    return (
      <Wrapper>
        {(copyLink && urlToBeShared) ? (
          <CopyToClipboard text={urlToBeShared} onCopy={() => this.copyLink(`shareModalOption-${uniqueExternalId}`)}>
            <div id={`shareModalOption-${uniqueExternalId}`}>
              <Icon
                className={copyLinkCopied ? classes.copyLinkIconCopied : classes.copyLinkIcon}
              >
                {icon}
              </Icon>
              <Text>
                {copyLinkCopied ? 'Copied!' : title}
              </Text>
            </div>
          </CopyToClipboard>
        ) : (
          <div>
            {noLink ? (
              <div id={`shareModalOption-${uniqueExternalId}`} onClick={this.onClick}>
                <Icon backgroundColor={backgroundColor}>
                  {icon}
                </Icon>
                <Text>
                  {title}
                </Text>
              </div>
            ) : (
              <>
                {(urlToBeShared) && (
                  <>
                    <Suspense fallback={<></>}>
                      <OpenExternalWebSite
                        linkIdAttribute="linkToShare"
                        className="no-decoration"
                        url={urlToBeShared}
                        target="_blank"
                        body={(
                          <div id={`shareModalOption-${uniqueExternalId}`} onClick={this.onClick}>
                            <Icon backgroundColor={backgroundColor}>
                              {icon}
                            </Icon>
                            <Text>
                              {title}
                            </Text>
                          </div>
                        )}
                      />
                    </Suspense>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </Wrapper>
    );
  }
}
ShareModalOption.propTypes = {
  backgroundColor: PropTypes.string,
  classes: PropTypes.object,
  copyLink: PropTypes.bool,
  icon: PropTypes.object,
  urlToShare: PropTypes.string,
  noLink: PropTypes.bool,
  onClickFunction: PropTypes.func,
  title: PropTypes.string,
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
  margin-bottom: 12px;
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
    transform: scale(1.05);
    transition-duration: .25s;
  }
`;

const Icon = styled('div', {
  shouldForwardProp: (prop) => !['backgroundColor'].includes(prop),
})(({ backgroundColor }) => (`
  text-decoration: none !important;
  margin: 0 auto;
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${backgroundColor || 'black'};
  padding: 0;
  border-radius: 60px;
  font-size: 30px;
  font-weight: bold;
  color: white !important;
  & * {
    color: white !important;
  }
  & svg, & path {
    width: 30px !important;
    height: 30px !important;
  }
  & img {
    width: 42px;
    height: 42px;
  }
  margin-bottom: 8px;
`));

const Text = styled('h3')`
  font-weight: normal;
  font-size: 16px;
  color: black !important;
`;

export default withTheme(withStyles(styles)(ShareModalOption));
