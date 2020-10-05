import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { InputBase, Card } from '@material-ui/core';
import ActivityPostModal from './ActivityPostModal';
import VoterStore from '../../stores/VoterStore';
import stockAvatar from '../../../img/global/icons/avatar-generic.png';
import { cordovaNewsPaddingTop } from '../../utils/cordovaOffsets';
import { cordovaDot, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';


class ActivityPostAdd extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showActivityPostModal: false,
      statementText: '',
    };
    this.updateStatementTextToBeSaved = this.updateStatementTextToBeSaved.bind(this);
  }

  componentDidMount () {
    const voter = VoterStore.getVoter();
    const { voter_photo_url_medium: voterPhotoUrlMedium } = voter;
    this.setState({
      // voter,
      // voterIsSignedIn,
      voterPhotoUrlMedium,
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('ActivityPostAdd caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const { voter_photo_url_medium: voterPhotoUrlMedium } = voter;
    this.setState({
      // voter,
      // voterIsSignedIn,
      voterPhotoUrlMedium,
    });
  }

  toggleActivityPostModal = () => {
    const { showActivityPostModal } = this.state;
    // console.log('toggleActivityPostModal showActivityPostModal:', showActivityPostModal);
    this.setState({
      showActivityPostModal: !showActivityPostModal,
    });
  }

  updateStatementTextToBeSaved (e) {
    this.setState({
      statementText: e.target.value,
    });
  }

  handleFocus (e) {
    e.target.blur();
  }

  render () {
    renderLog('ActivityPostAdd');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, externalUniqueId } = this.props;
    const {
      showActivityPostModal,
      voterPhotoUrlMedium, statementText,
    } = this.state;

    // console.log('inModal: ', inModal);

    // const horizontalEllipsis = '\u2026';
    const statementPlaceholderText = 'What\'s on your mind?';

    // let videoUrl = '';
    // let statementTextNoUrl = null;
    // let youTubeUrl;
    // let vimeoUrl;
    //
    // if (statementText) {
    //   youTubeUrl = statementText.match(youTubeRegX);
    //   vimeoUrl = statementText.match(vimeoRegX);
    // }
    //
    // if (youTubeUrl) {
    //   [videoUrl] = youTubeUrl;
    //   statementTextNoUrl = statementText.replace(videoUrl, '');
    // }
    //
    // if (vimeoUrl) {
    //   [videoUrl] = vimeoUrl;
    //   statementTextNoUrl = statementText.replace(videoUrl, '');
    // }

    // console.log('ActivityPostAdd');
    // console.log('editMode:', editMode);

    const unsetSideMarginsIfCordova = isCordova() ? { margin: 0 } : {};
    const adjustMarginsIfCordova = isCordova() ? {
      margin: 0,
      paddingTop: cordovaNewsPaddingTop(),
    } : {};

    return (
      <Card className="card" style={unsetSideMarginsIfCordova}>
        <AddTidbitTitle style={adjustMarginsIfCordova}>
          Create Post
        </AddTidbitTitle>
        <CardNewsWrapper>
          <InnerFlexWrapper>
            <img
              alt=""
              src={voterPhotoUrlMedium || cordovaDot(stockAvatar)}
              style={{ borderRadius: 6, display: 'block', marginRight: 12, width: 50 }}
            />
            <InputBase
              classes={{ root: classes.textInput }}
              defaultValue={statementText}
              id="activityTidbitAddInputField"
              inputRef={(tag) => { this.textarea = tag; }}
              multiline
              name="statementText"
              onClick={this.toggleActivityPostModal}
              onFocus={this.handleFocus}
              placeholder={statementPlaceholderText}
              rows="1"
            />
          </InnerFlexWrapper>
          {showActivityPostModal && (
            <ActivityPostModal
              activityPostWeVoteId=""
              externalUniqueId={externalUniqueId}
              show={showActivityPostModal}
              toggleActivityPostModal={this.toggleActivityPostModal}
            />
          )}
        </CardNewsWrapper>
      </Card>
    );
  }
}
ActivityPostAdd.propTypes = {
  externalUniqueId: PropTypes.string,
  classes: PropTypes.object,
};

const styles = (theme) => ({
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
  textInput: {
    flex: '1 1 0',
    fontSize: 20,
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
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

const AddTidbitTitle = styled.div`
  background: #2e3c5d;
  border-bottom: 1px solid #ddd;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  // margin: 0 -16px 0 0;
  padding: 4px 16px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
    // margin: 0 15px;
  }
`;

const CardNewsWrapper = styled.div`
  margin: 0 0 8px 0;
  padding: 8px 16px 8px 16px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    // margin: 0 15px;
  }
`;

const InnerFlexWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

export default withTheme(withStyles(styles)(ActivityPostAdd));
