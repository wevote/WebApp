import { FileCopyOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'; // EmailIcon, EmailShareButton,
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import { cordovaOpenSafariView, hasDynamicIsland, hasIPhoneNotch, isAndroid, isIPhone6p5in } from '../../common/utils/cordovaUtils';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import VoterStore from '../../stores/VoterStore';
import { openSnackbar } from '../../common/components/Widgets/SnackNotifier';
import ShareModalOption from './ShareModalOption';

export const shareStyles = () => ({
  dialogPaper: {
    // marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 576px)': {
      maxWidth: '600px',
      width: '90%',
      height: 'fit-content',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    height: '100%',
    margin: '0 auto',
  },
  dialogContent: {
    padding: '0 24px 36px 24px',
    background: 'white',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '@media(max-width: 576px)': {
      justifyContent: 'flex-start !important',
    },
  },
  buttonDefault: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    borderRadius: '0 !important',
    height: '45px !important',
  },
  buttonDefaultCordova: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    borderRadius: '0 !important',
    height: '35px !important',
  },
  backButton: {
    marginBottom: 6,
    marginLeft: -8,
    // paddingTop: 0,
    // paddingBottom: 0,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 12,
  },
  closeButton: {
    marginLeft: 'auto',
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 5,
    top: hasIPhoneNotch() || hasDynamicIsland() ? 30 : 3,
  },
  informationIcon: {
    color: '#999',
    width: 20,
    height: 20,
    marginTop: '-3px',
    marginRight: 3,
  },
  informationIconInButton: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginLeft: 3,
  },
  menuItem: {
    zIndex: '9 !important',
    padding: '0 !important',
    marginBottom: '-2px !important',
    paddingBottom: '1px !important',
    '&:last-child': {
      paddingBottom: '0 !important',
      paddingTop: '1px !important',
    },
    '&:hover': {
      background: '#efefef',
    },
  },
  previewButton: {
    marginTop: 0,
  },
  shareIcon: {
    transform: 'scaleX(-1)',
    position: 'relative',
    top: -1,
  },
});

export function androidFacebookClickHandler (linkToBeShared) {
  // react-share in Cordova for Android, navigates to the URL instead of opening a "tab" with a return 'X' button
  // https://m.facebook.com/sharer/sharer.php?u=https%253A%252F%252Fwevote.us%252F-0i8mao%26t%3DWeVote&quote=This+is+a+website+I+am+using+to+get+ready+to+vote.
  const fbURL = `https://m.facebook.com/sharer/sharer.php?u=${linkToBeShared}&quote=This+is+a+website+I+am+using+to+get+ready+to+vote.`;
  // console.log(`androidFacebookClickHandler clicked ~~~~~~~~~~~~~~~~ url : ${fbURL}`);
  cordovaOpenSafariView(fbURL, null, 50);
}

export function androidTwitterClickHandler (linkToBeShared) {
  // react-share in Cordova for Android, navigates to the URL instead of opening a "tab" with a return 'X' button
  // https://twitter.com/share?url=https%3A%2F%2Fwevote.us%2F-0i8mao&text=This%20is%20a%20website%20I%20am%20using%20to%20get%20ready%20to%20vote.
  const twitURL = `https://twitter.com/share?url=${linkToBeShared}&text=This%20is%20a%20website%20I%20am%20using%20to%20get%20ready%20to%20vote.`;
  // console.log(`androidTwitterClickHandler clicked ~~~~~~~~~~~~~~~~ url : ${twitURL}`);
  cordovaOpenSafariView(twitURL, null, 50);
}

export function getKindOfShareFromURL () {
  const pathname = normalizedHref();

  const ballotShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/ballot');
  const candidateShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/candidate');
  const measureShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/measure');
  const officeShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/office');
  const readyShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/ready');
  const organizationShare = !ballotShare && !candidateShare && !measureShare && !officeShare && !readyShare;

  let kindOfShare;
  if (candidateShare) {
    kindOfShare = 'CANDIDATE';
  } else if (measureShare) {
    kindOfShare = 'MEASURE';
  } else if (officeShare) {
    kindOfShare = 'OFFICE';
  } else if (organizationShare) {
    kindOfShare = 'ORGANIZATION';
  } else if (readyShare) {
    kindOfShare = 'READY';
  } else {
    kindOfShare = 'BALLOT';
  }
  return kindOfShare;
}

export function getWhatAndHowMuchToShareDefault () {
  const kindOfShare = getKindOfShareFromURL();
  const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
  let whatAndHowMuchToShare;
  if (kindOfShare === 'CANDIDATE') {
    if (voterIsSignedIn) {
      whatAndHowMuchToShare = 'candidateShareOptionsAllOpinions';
    } else {
      whatAndHowMuchToShare = 'candidateShareOptions';
    }
  } else if (kindOfShare === 'MEASURE') {
    if (voterIsSignedIn) {
      whatAndHowMuchToShare = 'measureShareOptionsAllOpinions';
    } else {
      whatAndHowMuchToShare = 'measureShareOptions';
    }
  } else if (kindOfShare === 'OFFICE') {
    if (voterIsSignedIn) {
      whatAndHowMuchToShare = 'officeShareOptionsAllOpinions';
    } else {
      whatAndHowMuchToShare = 'officeShareOptions';
    }
  } else if (kindOfShare === 'ORGANIZATION') {
    if (voterIsSignedIn) {
      whatAndHowMuchToShare = 'organizationShareOptionsAllOpinions';
    } else {
      whatAndHowMuchToShare = 'organizationShareOptions';
    }
  } else if (kindOfShare === 'READY') {
    if (voterIsSignedIn) {
      whatAndHowMuchToShare = 'readyShareOptionsAllOpinions';
    } else {
      whatAndHowMuchToShare = 'readyShareOptions';
    }
    // Default to ballot
  } else if (voterIsSignedIn) {
    whatAndHowMuchToShare = 'ballotShareOptionsAllOpinions';
  } else {
    whatAndHowMuchToShare = 'ballotShareOptions';
  }
  return whatAndHowMuchToShare;
}

export function saveActionShareAnalytics () {
  const kindOfShare = getKindOfShareFromURL();
  const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
  if (kindOfShare === 'CANDIDATE') {
    if (voterIsSignedIn) {
      AnalyticsActions.saveActionShareCandidateAllOpinions(VoterStore.electionId());
    } else {
      AnalyticsActions.saveActionShareCandidate(VoterStore.electionId());
    }
  } else if (kindOfShare === 'MEASURE') {
    if (voterIsSignedIn) {
      AnalyticsActions.saveActionShareMeasureAllOpinions(VoterStore.electionId());
    } else {
      AnalyticsActions.saveActionShareMeasure(VoterStore.electionId());
    }
  } else if (kindOfShare === 'OFFICE') {
    if (voterIsSignedIn) {
      AnalyticsActions.saveActionShareOfficeAllOpinions(VoterStore.electionId());
    } else {
      AnalyticsActions.saveActionShareOffice(VoterStore.electionId());
    }
  } else if (kindOfShare === 'ORGANIZATION') {
    if (voterIsSignedIn) {
      AnalyticsActions.saveActionShareOrganizationAllOpinions(VoterStore.electionId());
    } else {
      AnalyticsActions.saveActionShareOrganization(VoterStore.electionId());
    }
  } else if (kindOfShare === 'READY') {
    if (voterIsSignedIn) {
      AnalyticsActions.saveActionShareReadyAllOpinions(VoterStore.electionId());
    } else {
      AnalyticsActions.saveActionShareReady(VoterStore.electionId());
    }
    // Default to ballot
  } else if (voterIsSignedIn) {
    AnalyticsActions.saveActionShareBallotAllOpinions(VoterStore.electionId());
  } else {
    AnalyticsActions.saveActionShareBallot(VoterStore.electionId());
  }
}

let close;
function onEmailSendSuccess () {
  console.log('successfully shared via email');
  close();
  openSnackbar({ message: 'You have successfully shared via email.' });
}

function onEmailSendError (error) {
  console.log('share by email failed', error);
  close();
  if (error === 'not available') {
    openSnackbar({ message: 'Your device is not configured to send email' });
  } else {
    openSnackbar({ message: `Unable to send an email (${error})` });
  }
}

export function cordovaSocialSharingByEmail (subject, linkToBeShared, handleClose) {
  close = handleClose;
  const body = `This is a website I am using to get ready to vote. ${linkToBeShared}`;
  console.log('cordovaSocialSharingByEmail ', subject, linkToBeShared);
  // window.plugins.socialsharing.canShareViaEmail((e) => {console.log("canShareViaEmail 1: " + e)}, (e) => {console.log("canShareViaEmail 2: " + e)});
  // const { plugins: { socialsharing: { shareViaEmail } } } = window;
  const soc = window.plugins.socialsharing;
  soc.shareViaEmail(
    body,               // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
    subject,
    null,               // TO: must be null or an array
    null,               // CC: must be null or an array
    null,               // BCC: must be null or an array
    null,               // FILES: can be null, a string, or an array
    onEmailSendSuccess, // called when sharing worked, but also when the user cancelled sharing via email. On iOS, the callbacks' boolean result parameter is true when sharing worked, false if cancelled. On Android, this parameter is always true so it can't be used). See section "Notes about the successCallback" below.
    onEmailSendError,   // called when sh*t hits the fan
  );
}

export function containerSharePadding (shareOptionsMode, isShareWithFriendsNow) {
  if (isWebApp()) return shareOptionsMode ? '16px 16px 32px' : '24px 16px 32px';
  if (isAndroid() || (isIPhone6p5in() && !hasDynamicIsland()) || isShareWithFriendsNow) return '40px 16px 32px';
  return '0 16px 32px';
}

const TextH3 = styled('h3')`
  font-weight: normal;
  font-size: 16px;
  color: black !important;
  padding: 6px;
`;

const ShareWrapper = styled('div')`
  cursor: pointer;
  display: block !important;
  // margin-bottom: 12px;
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
  @media (max-width: 600px) {
    width: 33.333%;
  }
`;

// React functional component example
export function CopyLink (props) {
  const { saveActionShareButtonCopy, linkToBeSharedCopy } = props;
  return (
    <>
      <ShareWrapper>
        <ShareModalOption
          backgroundColor="#2E3C5D"
          copyLink
          icon={<FileCopyOutlined />}
          urlToShare={linkToBeSharedCopy}
          onClickFunction={saveActionShareButtonCopy}
          title="Copy link"
          uniqueExternalId="shareButtonFooter-CopyLink"
        />
      </ShareWrapper>
    </>
  );
}
CopyLink.propTypes = {
  saveActionShareButtonCopy: PropTypes.func,
  linkToBeSharedCopy: PropTypes.string,
};

// React functional component example
export function ShareWeVoteFriends (props) {
  const { onClickFunction } = props;
  return (
    <ShareModalOption
      backgroundColor="#0834cd"
      icon={<img src="../../../img/global/svg-icons/we-vote-icon-square-color.svg" alt="" />}
      // urlToShare={linkToBeShared}
      noLink
      onClickFunction={onClickFunction}
      title="We Vote friends"
      uniqueExternalId="shareButtonFooter-Friends"
    />
  );
}
ShareWeVoteFriends.propTypes = {
  onClickFunction: PropTypes.func,
};

export function SharePreviewFriends (props) {
  const { classes, linkToBeShared } = props;
  return (
    <Suspense fallback={<></>}>
      <OpenExternalWebSite
        linkIdAttribute="previewWhatFriendsWillSee"
        url={linkToBeShared}
        target="_blank"
        // title={this.props.title}
        className="u-no-underline"
        body={(
          <Button className={classes.previewButton} variant="outlined" fullWidth color="primary">
            Preview what your friends will see
          </Button>
        )}
        style={isCordova() ? { display: 'none' } : {}}
      />
    </Suspense>
  );
}
SharePreviewFriends.propTypes = {
  classes: PropTypes.object,
  linkToBeShared: PropTypes.string,
};

// React functional component example
export function ShareFacebook (props) {
  const { titleText, saveActionShareButtonFacebook, linkToBeShared } = props;
  return (
    <ShareWrapper>
      <div id="androidFacebook"
           onClick={() => isAndroid() && androidFacebookClickHandler(`${linkToBeShared}&t=WeVote`)}
      >
        <FacebookShareButton
          className="no-decoration"
          id="shareFooterFacebookButton"
          onClick={saveActionShareButtonFacebook}
          quote={titleText}
          url={`${linkToBeShared}&t=WeVote`}
          windowWidth={750}
          windowHeight={600}
          disabled={isAndroid()}
          disabledStyle={isAndroid() ? { opacity: 1 } : {}}
        >
          <FacebookIcon
            bgStyle={{ background: '#3b5998' }}
            round="True"
            size={68}
          />
          <TextH3>
            Facebook
          </TextH3>
        </FacebookShareButton>
      </div>
    </ShareWrapper>
  );
}
ShareFacebook.propTypes = {
  linkToBeShared: PropTypes.string,
  saveActionShareButtonFacebook: PropTypes.func,
  titleText: PropTypes.string,
};

// React functional component example
export function ShareTwitter (props) {
  const { titleText, saveActionShareButtonTwitter, linkToBeSharedTwitter } = props;
  return (
    <>
      <ShareWrapper>
        <div id="androidTwitter"
             onClick={() => isAndroid() &&
               androidTwitterClickHandler(linkToBeSharedTwitter)}
        >
          <TwitterShareButton
            className="no-decoration"
            id="shareFooterTwitterButton"
            onClick={saveActionShareButtonTwitter}
            title={titleText}
            url={`${linkToBeSharedTwitter}`}
            windowWidth={750}
            windowHeight={600}
            disabled={isAndroid()}
            disabledStyle={isAndroid() ? { opacity: 1 } : {}}
          >
            <TwitterIcon
              bgStyle={{ background: '#38A1F3' }}
              round="True"
              size={68}
            />
            <TextH3>
              Twitter
            </TextH3>
          </TwitterShareButton>
        </div>
      </ShareWrapper>
    </>
  );
}
ShareTwitter.propTypes = {
  linkToBeSharedTwitter: PropTypes.string,
  saveActionShareButtonTwitter: PropTypes.func,
  titleText: PropTypes.string,
};
