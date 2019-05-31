import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles/index';
import cookies from '../../utils/cookies';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';

class ReturnOfficialBallot extends Component {
  static propTypes = {
    toggleSelectBallotModal: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      returnOfficialBallotClosed: false,
      textForMapSearch: '',
    };
  }

  componentDidMount () {
    this.setState({
      returnOfficialBallotClosed: cookies.getItem('return_official_ballot_closed'),
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.props.toggleSelectBallotModal !== nextProps.toggleSelectBallotModal) {
      return true;
    }
    if (this.state.returnOfficalBallotClosed !== nextState.returnOfficialBallotClosed) {
      return true;
    }
    if (this.state.textForMapSearch !== nextState.textForMapSearch) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    // console.log('Ballot.jsx onVoterStoreChange, voter: ', VoterStore.getVoter());
    this.setState({
      returnOfficialBallotClosed: cookies.getItem('return_offical_ballot_closed'),
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
  }

  closeReturnOfficalBallot = () => {
    const oneMonthExpires = 86400 * 31;
    cookies.setItem('return_offical_ballot_closed', '1', oneMonthExpires, '/');
    this.setState({
      returnOfficialBallotClosed: true,
    });
  }

  render () {
    renderLog(__filename);
    const { returnOfficialBallotClosed, textForMapSearch } = this.state;
    if (returnOfficialBallotClosed) {
      return null;
    } else {
      // console.log('textForMapSearch before: ', textForMapSearch);
      return (
        <div id="location_guess" className="card-main__location-guess">
          <ParagraphStyled>
            {textForMapSearch ?
              (
                <span>
                  We Vote helps you get ready to vote,
                  {' '}
                  <strong>but you cannot use We Vote to cast your vote</strong>
                  .
                  {' '}
                  Make sure to return your official ballot to your polling place!
                  {' '}
                  <OpenExternalWebSite
                    url="https://help.wevote.us/hc/en-us/articles/115002401353-Can-I-cast-my-vote-with-We-Vote-"
                    target="_blank"
                    body="See more information about casting your official vote."
                  />
                </span>
              ) :
              null
            }
          </ParagraphStyled>
          <CloseComponent id="closeReturnOfficalBallot" onClick={this.closeReturnOfficalBallot}>
            &times;
          </CloseComponent>
        </div>
      );
    }
  }
}

const styles = ({
  iconRoot: {
    fontSize: 36,
    margin: 'auto 10px',
  },
});

const ParagraphStyled = styled.div`
  margin: auto;
  margin-left: 5px;
  font-weight: normal;
`;
const CloseComponent = styled.div`
  font-size: 25px;
  margin: 15px 15px 15px 15px;
  position: relative;
  bottom: 2px;
  align-self: center;
  cursor: pointer;
  font-weight: 700;
  color: #000;
  opacity: 0.5;
`;

export default withStyles(styles)(ReturnOfficialBallot);
