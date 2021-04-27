import { Button, Dialog, DialogContent, DialogTitle, IconButton, InputBase } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import SupportActions from '../../actions/SupportActions';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaDot, hasIPhoneNotch, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { stringContains } from '../../utils/textFormat';

const FirstAndLastNameRequiredAlert = React.lazy(() => import('./FirstAndLastNameRequiredAlert'));
const ItemActionBar = React.lazy(() => import('./ItemActionBar/ItemActionBar'));
const stockAvatar = React.lazy(() => import('../../../img/global/icons/avatar-generic.png'));

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
      const candidate = CandidateStore.getCandidate(this.props.ballotItemWeVoteId);
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
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
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
    restoreStylesAfterCordovaKeyboard(PositionStatementModal);
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
    this.props.togglePositionStatementModal();
  }

  updateStatementTextToBeSaved = (e) => {
    this.setState({
      voterTextStatement: e.target.value,
    });
  }

  render () {
    renderLog('PositionStatementModal');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      ballotItemWeVoteId, classes, externalUniqueId, hideAddressEdit, hideElections,
    } = this.props;
    const {
      ballotItemDisplayName, voterIsSignedIn, voterPhotoUrlMedium,
      voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem,
      voterTextStatement,
    } = this.state;

    let dialogTitleText = 'Enter Your Opinion';
    if (hideAddressEdit || hideElections) {
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

    const rowsToShow = 6;

    // console.log('PositionStatementModal render, voter_address_object: ', voter_address_object);
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.togglePositionStatementModal(); }}
      >
        <DialogTitle classes={{ root: classes.dialogTitle }}>
          <Title>
            {dialogTitleText}
          </Title>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.props.togglePositionStatementModal(); }}
            id="closePositionStatementModal"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <TextFieldWrapper>
            {voterIsSignedIn && (
              <FirstAndLastNameRequiredAlert />
            )}
            <form
              className={classes.formStyles}
              onSubmit={this.savePositionStatement.bind(this)}
              onFocus={this.onFocusInput}
              onBlur={this.onBlurInput}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '95%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  border: '1px solid #e8e8e8',
                  borderRadius: 3,
                  padding: 12,
                  marginBottom: 0,
                }}
              >
                <img
                  alt=""
                  src={voterPhotoUrlMedium || cordovaDot(stockAvatar)}
                  style={{ borderRadius: 6, display: 'block', marginRight: 12, width: 50 }}
                />
                <InputBase onChange={this.updateStatementTextToBeSaved}
                  id={`itemPositionStatementActionBarTextArea-${ballotItemWeVoteId}-${externalUniqueId}`}
                  name="voterTextStatement"
                  classes={{ root: classes.inputStyles, inputMultiline: classes.inputMultiline }}
                  placeholder={statementPlaceholderText}
                  defaultValue={voterTextStatement}
                  inputRef={(input) => { this.positionInput = input; }}
                  multiline
                  rows={rowsToShow}
                />
              </div>
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
              <PostSaveButton className="postsave-button">
                <Button
                  id={`itemPositionStatementActionBarSave-${ballotItemWeVoteId}-${externalUniqueId}`}
                  variant="contained"
                  color="primary"
                  classes={{ root: classes.saveButtonRoot }}
                  type="submit"
                >
                  {postButtonText}
                </Button>
              </PostSaveButton>
            </form>
          </TextFieldWrapper>
        </DialogContent>
      </Dialog>
    );
  }
}
PositionStatementModal.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  hideAddressEdit: PropTypes.bool,
  hideElections: PropTypes.bool,
  show: PropTypes.bool,
  togglePositionStatementModal: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  dialogTitle: {
    padding: 16,
  },
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    minHeight: '200px',
    maxHeight: '350px',
    height: '80%',
    width: '90%',
    maxWidth: '600px',
    top: '0px',
    transform: 'translate(0%, -20%)',
    [theme.breakpoints.down('xs')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '200px',
      maxHeight: '330px',
      height: '70%',
      margin: '0 auto',
      transform: 'translate(0%, -30%)',
    },
  },
  dialogContent: {
    padding: '0px 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
  saveButtonRoot: {
    width: '100%',
  },
  formStyles: {
    width: '100%',
  },
  formControl: {
    width: '100%',
    marginTop: 16,
  },
  inputMultiline: {
    fontSize: 20,
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
    },
  },
  inputStyles: {
    flex: '1 1 0',
    fontSize: 18,
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
  select: {
    padding: '12px 12px',
    margin: '0px 1px',
  },
});

const PostSaveButton = styled.div`
  width: 100%;
`;

const TextFieldWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  margin-top: 2px;
  text-align: left;
`;

export default withTheme(withStyles(styles)(PositionStatementModal));
