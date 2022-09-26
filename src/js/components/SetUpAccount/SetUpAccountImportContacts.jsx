import withStyles from '@mui/styles/withStyles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { filter } from 'lodash-es';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import {
  SetUpAccountContactsText,
  SetUpAccountContactsTextWrapper,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

const addressBookSVG = '../../../img/get-started/address-book.svg';

class SetUpAccountImportContacts extends React.Component {
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
    // console.log('SetUpAccountImportContacts componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
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
    renderLog('SetUpAccountImportContacts');  // Set LOG_RENDER_EVENTS to log all renders
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
                    of your friends are already on We Vote
                    {' '}
                  </>
                ) : (
                  <>
                    {voterContactEmailAugmentSequenceHasNextStep ? (
                      <>
                        Checking for your friends in
                        {' '}
                        <span className="u-no-break">We Vote...</span>
                      </>
                    ) : (
                      <>
                        We couldn&apos;t match any of your contacts with other members of
                        {' '}
                        <span className="u-no-break">We Vote</span>
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
                      contacts to join We Vote.
                      <br />
                    </>
                  )}
                </SetUpAccountContactsText>
              </SetUpAccountContactsTextWrapper>
            </SetUpAccountTop>
          ) : (
            <>
              <SetUpAccountTitle>
                Find your contacts on
                {' '}
                <span className="u-no-break">We Vote</span>
              </SetUpAccountTitle>
              <SetUpAccountImportText>
                Importing your contacts helps
                {' '}
                <span className="u-no-break">We Vote</span>
                {' '}
                find your friends and suggest connections.
              </SetUpAccountImportText>
            </>
          )}
        </>
        <ImageAndButtonsWrapper>
          <MainImageWrapper>
            <div>
              <MainImageImg src={addressBookSVGSrc} alt="" />
            </div>
          </MainImageWrapper>
        </ImageAndButtonsWrapper>
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountImportContacts.propTypes = {
  nextButtonClicked: PropTypes.bool,
  goToNextStep: PropTypes.func,
};

const styles = () => ({
});

const ImageAndButtonsWrapper = styled('div')`
  margin-top: 24px;
  width: 100%;
`;

const MainImageImg = styled('img')(({ theme }) => (`
  width: 200px;
  height: 200px;
  ${theme.breakpoints.down('sm')} {
    width: 150px;
    height: 150px;
  }
`));

const MainImageWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const SetUpAccountImportText = styled('div')(({ theme }) => (`
  color: #6c757d;
  font-size: 18px;
  padding: 0 20px;
  text-align: center;
  width: 275px;
  ${theme.breakpoints.up('sm')} {
    width: 350px;
  }
`));

export default withStyles(styles)(SetUpAccountImportContacts);
