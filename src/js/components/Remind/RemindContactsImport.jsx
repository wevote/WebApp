import withStyles from '@mui/styles/withStyles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { filter } from 'lodash-es';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { RemindContactsImportText, RemindMainImageImg } from '../Style/RemindStyles';
import {
  SetUpAccountContactsText,
  SetUpAccountContactsTextWrapper,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

const addressBookSVG = '../../../img/get-started/address-book.svg';

class RemindContactsImport extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      contactsWithAccountCount: 0,
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('RemindContactsImport componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      if (this.props.goToNextStep) {
        this.props.goToNextStep();
      }
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.functionToUseWhenProfileCompleteTimer) {
      clearTimeout(this.functionToUseWhenProfileCompleteTimer);
    }
  }

  onVoterStoreChange () {
    const voterContactEmailList = VoterStore.getVoterContactEmailList();
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();
    const contactsWithAccountList = filter(voterContactEmailList, (contact) => contact.voter_we_vote_id);
    const contactsWithAccountCount = contactsWithAccountList.length;
    this.setState({
      contactsWithAccountCount,
      voterContactEmailAugmentSequenceHasNextStep: VoterStore.getVoterContactEmailAugmentSequenceHasNextStep(),
      voterContactEmailListCount,
    });
  }

  render () {
    renderLog('RemindContactsImport');  // Set LOG_RENDER_EVENTS to log all renders
    const { contactsWithAccountCount, voterContactEmailAugmentSequenceHasNextStep, voterContactEmailListCount } = this.state;
    const addressBookSVGSrc = normalizedImagePath(addressBookSVG);

    return (
      <StepCenteredWrapper>
        <>
          {voterContactEmailListCount > 0 ? (
            <SetUpAccountTop>
              <SetUpAccountTitle>
                {contactsWithAccountCount ? (
                  <>
                    {contactsWithAccountCount}
                    {' '}
                    of your friends are already on WeVote
                    {' '}
                  </>
                ) : (
                  <>
                    {voterContactEmailAugmentSequenceHasNextStep ? (
                      <>
                        Checking for your friends in
                        {' '}
                        <span className="u-no-break">WeVote...</span>
                      </>
                    ) : (
                      <>
                        We couldn&apos;t match any of your contacts with other members of
                        {' '}
                        <span className="u-no-break">WeVote</span>
                      </>
                    )}
                  </>
                )}
              </SetUpAccountTitle>
              <SetUpAccountContactsTextWrapper>
                <SetUpAccountContactsText>
                  {!!(!contactsWithAccountCount && voterContactEmailListCount) && (
                    <>
                      Be the first in your network of
                      {' '}
                      {voterContactEmailListCount}
                      {' '}
                      contacts to join WeVote.
                      <br />
                    </>
                  )}
                </SetUpAccountContactsText>
              </SetUpAccountContactsTextWrapper>
            </SetUpAccountTop>
          ) : (
            <SetUpAccountTop>
              <SetUpAccountTitle>
                Remind 3 of your friends
                {' '}
                <span className="u-no-break">to vote today</span>
              </SetUpAccountTitle>
              <RemindContactsImportText>
                Polls predict fewer than 50% of eligible Americans will vote in the next election.
                {' '}
                <span className="u-no-break">
                  Let&apos;s change that!
                </span>
              </RemindContactsImportText>
            </SetUpAccountTop>
          )}
        </>
        <ImageAndButtonsWrapper>
          <MainImageWrapper>
            <div>
              <RemindMainImageImg src={addressBookSVGSrc} alt="" />
            </div>
          </MainImageWrapper>
        </ImageAndButtonsWrapper>
      </StepCenteredWrapper>
    );
  }
}
RemindContactsImport.propTypes = {
  nextButtonClicked: PropTypes.bool,
  goToNextStep: PropTypes.func,
};

const styles = () => ({
});

const ImageAndButtonsWrapper = styled('div')`
  margin-top: 24px;
  width: 100%;
`;

const MainImageWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

export default withStyles(styles)(RemindContactsImport);
