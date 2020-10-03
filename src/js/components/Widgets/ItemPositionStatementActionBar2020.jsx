import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Paper, InputBase, Button } from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import PositionStatementModal from './PositionStatementModal';
import VoterStore from '../../stores/VoterStore';

class ItemPositionStatementActionBar2020 extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string.isRequired,
    ballotItemDisplayName: PropTypes.string,
    ballotItemType: PropTypes.string.isRequired,
    commentEditModeOn: PropTypes.bool,
    externalUniqueId: PropTypes.string,
    shownInList: PropTypes.bool,
    classes: PropTypes.object,
    mobile: PropTypes.bool,
    // inModal: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      showEditPositionStatementInput: undefined,
      showPositionStatementModal: false,
      voterOpposesBallotItem: false,
      voterSupportsBallotItem: false,
      voterTextStatement: '',
    };
    this.updateStatementTextToBeSaved = this.updateStatementTextToBeSaved.bind(this);
  }

  componentDidMount () {
    const { ballotItemWeVoteId, commentEditModeOn } = this.props;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    if (ballotItemStatSheet) {
      const { voterOpposesBallotItem, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet;
      this.setState({
        voterOpposesBallotItem,
        // voterPositionIsPublic,
        voterSupportsBallotItem,
        voterTextStatement,
      });
    }

    this.setState({
      showEditPositionStatementInput: commentEditModeOn,
      // voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    });
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { ballotItemWeVoteId } = this.props;
    const { showEditPositionStatementInput } = this.state;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    let voterTextStatement = '';
    if (ballotItemStatSheet) {
      const { voterOpposesBallotItem, voterSupportsBallotItem } = ballotItemStatSheet;
      ({ voterTextStatement } = ballotItemStatSheet);
      this.setState({
        voterOpposesBallotItem,
        // voterPositionIsPublic,
        voterSupportsBallotItem,
      });
    }
    if (showEditPositionStatementInput) {
      // we don't want to do anything
    } else if (voterTextStatement) {
      this.setState({
        voterTextStatement,
        showEditPositionStatementInput: false,
      });
    } else {
      this.setState({
        voterTextStatement: '',
        showEditPositionStatementInput: nextProps.commentEditModeOn,
      });
    }
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onSupportStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    const { showEditPositionStatementInput } = this.state;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    let voterOpposesBallotItem = '';
    let voterSupportsBallotItem = '';
    let voterTextStatement = '';
    // let voterPositionIsPublic = '';
    if (ballotItemStatSheet) {
      ({ voterOpposesBallotItem, voterSupportsBallotItem } = ballotItemStatSheet);
    }
    this.setState({
      voterOpposesBallotItem,
      voterSupportsBallotItem,
    });

    if (showEditPositionStatementInput) {
      // if (ballotItemStatSheet) {
      //   ({ voterPositionIsPublic } = ballotItemStatSheet);
      // }
      // this.setState({
      //   // voterPositionIsPublic,
      // });
    } else {
      if (ballotItemStatSheet) {
        ({ voterTextStatement } = ballotItemStatSheet); // voterPositionIsPublic,
      }
      this.setState({
        voterTextStatement,
        // voterPositionIsPublic,
      });
    }
  }

  onVoterStoreChange () {
    this.setState({
      // voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    });
  }

  togglePositionStatementModal = () => {
    const { showPositionStatementModal } = this.state;
    // console.log('togglePositionStatementModal showPositionStatementModal:', showPositionStatementModal);
    this.setState({
      showPositionStatementModal: !showPositionStatementModal,
    });
  }

  updateStatementTextToBeSaved (e) {
    this.setState({
      voterTextStatement: e.target.value,
      showEditPositionStatementInput: true,
    });
  }

  savePositionStatement (e) {
    e.preventDefault();
    const { ballotItemWeVoteId, ballotItemType } = this.props;
    const { voterTextStatement } = this.state;
    // console.log('ItemPositionStatementActionBar2020 ballotItemWeVoteId:', ballotItemWeVoteId, 'ballotItemType: ', ballotItemType, 'voterTextStatement: ', voterTextStatement);
    SupportActions.voterPositionCommentSave(ballotItemWeVoteId, ballotItemType, voterTextStatement);
  }

  handleFocus (e) {
    e.target.blur();
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('ItemPositionStatementActionBar2020 caught error: ', `${error} with info: `, info);
  }

  render () {
    renderLog('ItemPositionStatementActionBar2020');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      classes, ballotItemDisplayName, ballotItemWeVoteId, externalUniqueId,
      mobile,
      /* inModal, showPositionStatementActionBar, */
    } = this.props;
    const {
      showPositionStatementModal,
      voterOpposesBallotItem, voterSupportsBallotItem,
      voterTextStatement,
    } = this.state;

    // console.log('inModal: ', inModal);

    let rows;

    if (mobile) {
      // Size of comment box prior to comment, mobile
      rows = 2;
    } else {
      // Size of comment box prior to comment, desktop
      rows = 1;
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

    // Currently this "Post" text is the same given we display the visibility setting, but we may want to change this
    //  here if the near by visibility setting text changes
    let postButtonText = 'Add Explanation';
    if (voterTextStatement) {
      postButtonText = 'Edit';
    }

    // console.log('ItemPositionStatementActionBar2020: showEditPositionStatementInput: ', showEditPositionStatementInput);

    // let videoUrl = '';
    // let statementTextNoUrl = null;
    // let youTubeUrl;
    // let vimeoUrl;
    //
    // if (voterTextStatement) {
    //   youTubeUrl = voterTextStatement.match(youTubeRegX);
    //   vimeoUrl = voterTextStatement.match(vimeoRegX);
    // }
    //
    // if (youTubeUrl) {
    //   [videoUrl] = youTubeUrl;
    //   statementTextNoUrl = voterTextStatement.replace(videoUrl, '');
    // }
    //
    // if (vimeoUrl) {
    //   [videoUrl] = vimeoUrl;
    //   statementTextNoUrl = voterTextStatement.replace(videoUrl, '');
    // }

    // console.log('ItemPositionStatementActionBar2020');
    // console.log('editMode:', editMode);
    return (
      <Wrapper shownInList={this.props.shownInList}>
        <Paper
          elevation={2}
          className={window.innerWidth >= 769 ? classes.rootWhite : classes.root}
        >
          <div
            className={classes.flex}
          >
            <InputBase
              classes={{ root: classes.input }}
              defaultValue={voterTextStatement}
              disabled={showPositionStatementModal}
              id={`itemPositionStatementActionBarTextArea-${ballotItemWeVoteId}-${externalUniqueId}`}
              inputRef={(tag) => { this.textarea = tag; }}
              multiline
              name="voterTextStatement"
              onClick={this.togglePositionStatementModal}
              onFocus={this.handleFocus}
              placeholder={statementPlaceholderText}
              rows={rows}
            />
            <PostSaveButton className="postsave-button">
              <Button
                id={`itemPositionStatementActionBarSave-${ballotItemWeVoteId}-${externalUniqueId}`}
                className="postsave-button"
                variant="outlined"
                color="primary"
                classes={{ outlinedPrimary: classes.buttonOutlinedPrimary }}
                onClick={this.togglePositionStatementModal}
                type="submit"
                size="small"
              >
                {postButtonText}
              </Button>
            </PostSaveButton>
          </div>
        </Paper>
        {showPositionStatementModal && (
          <PositionStatementModal
            ballotItemWeVoteId={ballotItemWeVoteId}
            externalUniqueId={externalUniqueId}
            show={showPositionStatementModal}
            togglePositionStatementModal={this.togglePositionStatementModal}
          />
        )}
      </Wrapper>
    );
  }
}

const styles = theme => ({
  root: {
    boxShadow: 'none',
    border: '1px solid #333',
    padding: '8px',
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
    },
  },
  rootWhite: {
    boxShadow: 'none',
    border: 'none',
    padding: '8px',
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
    },
  },
  flex: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
    },
  },
  input: {
    flex: '1 1 0',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
  },
  disabled: {
    background: '#eee',
    border: 'none',
  },
  disabledWhite: {
    background: '#fff',
    border: 'none',
  },
  disabledInput: {
    color: '#313131',
  },
  buttonOutlinedPrimary: {
    padding: '4px 8px',
    fontWeight: 600,
    background: 'white',
    color: '#313131',
    [theme.breakpoints.down('md')]: {
      fontWeight: 500,
      height: '100%',
      fontSize: 12,
    },
    [theme.breakpoints.down('sm')]: {
      padding: '2px 4px',
      fontWeight: 600,
      height: '100%',
      fontSize: 10,
    },
  },
});

const Wrapper = styled.div`
  ${({ shownInList }) => (shownInList ? '' : (
    'background-color: #f8f8f8;' +
    'padding: 8px 16px;' +
    'margin: 0 -16px 8px 0;'
  )
  )}
`;

const PostSaveButton = styled.div`
  width: auto;
  margin-left: auto;
  margin-top: auto;
  @media(max-width: 576px) {
    height: 28px;
    display: flex;
    align-items: flex-end;
  }
`;

export default withTheme(withStyles(styles)(ItemPositionStatementActionBar2020));
