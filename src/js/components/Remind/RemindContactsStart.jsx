import withStyles from '@mui/styles/withStyles';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import BallotActions from '../../actions/BallotActions';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import DownloadAppsButtons from './DownloadAppsButtons';
import Reassurance from '../SetUpAccount/Reassurance';
import { reassuranceTextRemindContacts } from './reassuranceTextRemindContacts';
import VoterStore from '../../stores/VoterStore';
import { RemindContactsImportText, RemindMainImageImg } from '../Style/RemindStyles';
import {
  SetUpAccountContactsTextWrapper,
  SetUpAccountTitle,
} from '../Style/SetUpAccountStyles';
import SuggestedContactListWithController from '../Friends/SuggestedContactListWithController';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ '../SetUpAccount/AddContactsFromGoogleButton'));

const addressBookSVG = '../../../img/get-started/address-book.svg';


class RemindContactsStart extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterContactEmailListCount: 0,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('friendListsAll', 30000)) {
      FriendActions.friendListsAll();
    }
    if (apiCalming('voterBallotItemsRetrieve', 120000)) {
      BallotActions.voterBallotItemsRetrieve();
    }
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();
    this.setState({
      voterContactEmailListCount,
    });
  }

  render () {
    renderLog('RemindContactsStart');  // Set LOG_RENDER_EVENTS to log all renders
    const { voterContactEmailListCount } = this.state;
    const addressBookSVGSrc = normalizedImagePath(addressBookSVG);
    const pigsCanFly = false;
    return (
      <>
        {(voterContactEmailListCount > 0) ? (
          <RemindContactsStartWithContactsWrapper>
            <SetUpAccountTitle>
              Remind five of your contacts
              {' '}
              <span className="u-no-break">
                to vote today
              </span>
            </SetUpAccountTitle>
            <div>
              <SuggestedContactListWithController remindMode />
            </div>
          </RemindContactsStartWithContactsWrapper>
        ) : (
          <RemindContactsStartWrapper>
            <SetUpAccountTitle>
              Remind five of your friends
              {' '}
              <span className="u-no-break">
                to vote today
              </span>
            </SetUpAccountTitle>
            <SetUpAccountContactsTextWrapper>
              <RemindContactsImportText>
                Unless we do something, less than 50% of eligible Americans will vote in the next election.
              </RemindContactsImportText>
            </SetUpAccountContactsTextWrapper>
            <ImageOuterWrapper>
              <MainImageWrapper>
                <div>
                  <RemindMainImageImg src={addressBookSVGSrc} alt="" />
                </div>
              </MainImageWrapper>
            </ImageOuterWrapper>
            <div>
              <Suspense fallback={<></>}>
                <AddContactsFromGoogleButton darkButton />
              </Suspense>
            </div>
            <Reassurance displayState={1} reassuranceText={reassuranceTextRemindContacts} />
            {(isWebApp() && pigsCanFly) && (
              <DownloadAppsButtons />
            )}
          </RemindContactsStartWrapper>
        )}
      </>
    );
  }
}
RemindContactsStart.propTypes = {
};

const styles = () => ({
});

const MainImageWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const ImageOuterWrapper = styled('div')`
  margin-bottom: 24px;
  margin-top: 24px;
  width: 100%;
`;

const RemindContactsStartWithContactsWrapper = styled('div')`
  margin-bottom: 48px;
  margin-top: 36px;
`;

const RemindContactsStartWrapper = styled('div')`
  margin-bottom: 48px;
  margin-top: 36px;
`;

export default withStyles(styles)(RemindContactsStart);
