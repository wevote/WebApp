import { Button, InputBase } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
// import styled from 'styled-components';
import ModalDisplayTemplateA, {
  PostSaveButton, templateAStyles, TextFieldDiv,
  TextFieldForm, TextFieldWrapper, VoterAvatarImg,
} from './ModalDisplayTemplateA';
import SupportActions from '../../actions/SupportActions';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../common/utils/cordovaUtils';
import { isAndroid } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric } from '../../utils/applicationUtils';

const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ './FirstAndLastNameRequiredAlert'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ './ItemActionBar/ItemActionBar')); // eslint-disable-line import/no-cycle


class PositionStatementModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    const { ballotItemWeVoteId } = this.props;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    if (ballotItemStatSheet) {
      const { voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet;
      this.setState({
        voterOpposesBallotItem,
        voterPositionIsPublic,
        voterSupportsBallotItem,
        voterTextStatement,
      });
    }

    const voter = VoterStore.getVoter();
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    const { voter_photo_url_medium: voterPhotoUrlMedium } = voter;

    let ballotItemDisplayName = '';
    let ballotItemType;
    let isCandidate = false;
    let isMeasure = false;
    if (stringContains('cand', this.props.ballotItemWeVoteId)) {
      const candidate = CandidateStore.getCandidateByWeVoteId(this.props.ballotItemWeVoteId);
      ballotItemDisplayName = candidate.ballot_item_display_name || '';
      ballotItemType = 'CANDIDATE';
      isCandidate = true;
    } else if (stringContains('meas', this.props.ballotItemWeVoteId)) {
      const measure = MeasureStore.getMeasure(this.props.ballotItemWeVoteId);
      ballotItemDisplayName = measure.ballot_item_display_name || '';
      ballotItemType = 'MEASURE';
      isMeasure = true;
    }
    this.setState({
      ballotItemDisplayName,
      ballotItemType,
      isCandidate,
      isMeasure,
      voterIsSignedIn,
      voterPhotoUrlMedium,
    });
  }

  componentDidUpdate () {
    const { initialFocusSet } = this.state;
    if (this.positionInput) {
      // Set the initial focus at the end of any existing text
      if (!initialFocusSet) {
        const { positionInput } = this;
        const { length } = positionInput.value;
        positionInput.focus();
        positionInput.setSelectionRange(length, length);
        this.setState({
          initialFocusSet: true,
        });
      }
    }
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onCandidateStoreChange () {
    if (this.state.isCandidate) {
      const { ballotItemWeVoteId } = this.props;
      const candidate = CandidateStore.getCandidateByWeVoteId(ballotItemWeVoteId);
      const ballotItemDisplayName = candidate.ballot_item_display_name || '';
      this.setState({
        ballotItemDisplayName,
      });
    }
  }

  onMeasureStoreChange () {
    if (this.state.isMeasure) {
      const { ballotItemWeVoteId } = this.props;
      const measure = MeasureStore.getMeasure(ballotItemWeVoteId);
      const ballotItemDisplayName = measure.ballot_item_display_name || '';
      this.setState({
        ballotItemDisplayName,
      });
    }
  }

  onSupportStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    let voterOpposesBallotItem = '';
    let voterSupportsBallotItem = '';
    let voterTextStatement = '';
    let voterPositionIsPublic = '';
    if (ballotItemStatSheet) {
      ({ voterOpposesBallotItem, voterSupportsBallotItem } = ballotItemStatSheet);
    }
    this.setState({
      voterOpposesBallotItem,
      voterSupportsBallotItem,
    });

    if (ballotItemStatSheet) {
      ({ voterPositionIsPublic, voterTextStatement } = ballotItemStatSheet);
    }
    this.setState({
      voterTextStatement,
      voterPositionIsPublic,
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    const { voter_photo_url_medium: voterPhotoUrlMedium } = voter;
    this.setState({
      voterIsSignedIn,
      voterPhotoUrlMedium,
    });
  }

  onBlurInput = () => {
    restoreStylesAfterCordovaKeyboard('PositionStatementModal');
  };

  onFocusInput = () => {
    prepareForCordovaKeyboard('ItemPositionStatementActionBar');
  };

  savePositionStatement = (e) => {
    e.preventDefault();
    const { ballotItemWeVoteId } = this.props;
    const { ballotItemType, voterTextStatement } = this.state;
    // console.log('PositionStatementModal ballotItemWeVoteId:', ballotItemWeVoteId, 'ballotItemType: ', ballotItemType, 'voterTextStatement: ', voterTextStatement);
    SupportActions.voterPositionCommentSave(ballotItemWeVoteId, ballotItemType, voterTextStatement);
    this.props.toggleModal();
  }

  updateStatementTextToBeSaved = (e) => {
    this.setState({
      voterTextStatement: e.target.value,
    });
  }

  render () {
    renderLog('PositionStatementModal');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      ballotItemWeVoteId, classes, externalUniqueId, show, showEditAddress,
    } = this.props;
    const {
      ballotItemDisplayName, voterIsSignedIn, voterPhotoUrlMedium,
      voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem,
      voterTextStatement,
    } = this.state;

    let dialogTitleText = 'Enter Your Opinion';
    if (showEditAddress) {
      dialogTitleText = '';
    }

    const horizontalEllipsis = '\u2026';
    let statementPlaceholderText = `Your thoughts${horizontalEllipsis}`;

    if (voterSupportsBallotItem) {
      if (ballotItemDisplayName) {
        statementPlaceholderText = `Why you chose ${ballotItemDisplayName}${horizontalEllipsis}`;
      } else {
        statementPlaceholderText = `Why you support${horizontalEllipsis}`;
      }
    } else if (voterOpposesBallotItem) {
      if (ballotItemDisplayName) {
        statementPlaceholderText = `Why you oppose ${ballotItemDisplayName}${horizontalEllipsis}`;
      } else {
        statementPlaceholderText = `Why you oppose${horizontalEllipsis}`;
      }
    } else if (ballotItemDisplayName) {
      statementPlaceholderText = `Your thoughts about ${ballotItemDisplayName}${horizontalEllipsis}`;
    } else {
      statementPlaceholderText = `Your thoughts${horizontalEllipsis}`;
    }

    // Currently this 'Post' text is the same given we display the visibility setting, but we may want to change this
    //  here if the near by visibility setting text changes
    let postButtonText = 'Post'; // 'Save';
    if (voterIsSignedIn) {
      if (voterPositionIsPublic) {
        postButtonText = 'Post';
      }
    }

    const rowsToShow = isAndroid() ? 4 : 6;

    // console.log('PositionStatementModal render, voter_address_object: ', voter_address_object);
    const textFieldJSX = (
      <TextFieldWrapper>
        {voterIsSignedIn && (
          <Suspense fallback={<></>}>
            <FirstAndLastNameRequiredAlert />
          </Suspense>
        )}
        <TextFieldForm
          className={classes.formStyles}
          onBlur={this.onBlurInput}
          onFocus={this.onFocusInput}
          onSubmit={this.savePositionStatement}
        >
          <TextFieldDiv>
            <VoterAvatarImg
              alt=""
              src={voterPhotoUrlMedium || avatarGeneric()}
            />
            <InputBase
              classes={{ root: classes.inputStyles, inputMultiline: classes.inputMultiline }}
              defaultValue={voterTextStatement}
              id={`itemPositionStatementActionBarTextArea-${ballotItemWeVoteId}-${externalUniqueId}`}
              inputRef={(input) => { this.positionInput = input; }}
              multiline
              name="voterTextStatement"
              onChange={this.updateStatementTextToBeSaved}
              placeholder={statementPlaceholderText}
              rows={rowsToShow}
            />
          </TextFieldDiv>
          <Suspense fallback={<></>}>
            <ItemActionBar
              showPositionPublicToggle
              inModal
              // showPositionStatementActionBar={showPositionStatementActionBar}
              ballotItemDisplayName={ballotItemDisplayName}
              ballotItemWeVoteId={ballotItemWeVoteId}
              commentButtonHide
              commentButtonHideInMobile
              // currentBallotIdInUrl={currentBallotIdInUrl}
              externalUniqueId={`${externalUniqueId}-ballotItemSupportOpposeComment-${ballotItemWeVoteId}`}
              shareButtonHide
              // hidePositionPublicToggle={hidePositionPublicToggle}
              // supportOrOpposeHasBeenClicked={this.passDataBetweenItemActionToItemPosition}
              // togglePositionStatementFunction={this.togglePositionStatement}
              // transitioning={transitioning}
              // urlWithoutHash={urlWithoutHash}
            />
          </Suspense>
          <PostSaveButton className="postsave-button">
            <Button
              id={`itemPositionStatementActionBarSave-${ballotItemWeVoteId}-${externalUniqueId}`}
              variant="contained"
              color="primary"
              classes={{ root: classes.saveButtonRoot }}
              type="submit"
              disabled={!voterTextStatement}
            >
              {postButtonText}
            </Button>
          </PostSaveButton>
        </TextFieldForm>
      </TextFieldWrapper>
    );

    return (
      <ModalDisplayTemplateA
        dialogTitleJSX={<>{dialogTitleText}</>}
        show={show}
        textFieldJSX={textFieldJSX}
        toggleModal={this.props.toggleModal}
      />
    );
  }
}
PositionStatementModal.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  showEditAddress: PropTypes.bool,
  show: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
};

export default withTheme(withStyles(templateAStyles)(PositionStatementModal));
