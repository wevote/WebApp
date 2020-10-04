import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles/index';
import cookies from '../../utils/cookies';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';

class ReturnOfficialBallot extends Component {
  constructor (props) {
    super(props);
    this.state = {
      returnOfficialBallotClosed: false,
    };
  }

  componentDidMount () {
    this.setState({
      returnOfficialBallotClosed: cookies.getItem('return_official_ballot_closed'),
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.returnOfficialBallotClosed !== nextState.returnOfficialBallotClosed) {
      return true;
    }
    return false;
  }

  closeReturnOfficialBallot = () => {
    const oneMonthExpires = 86400 * 31;
    cookies.setItem('return_official_ballot_closed', '1', oneMonthExpires, '/');
    this.setState({
      returnOfficialBallotClosed: true,
    });
  };

  render () {
    renderLog('ReturnOfficialBallot');  // Set LOG_RENDER_EVENTS to log all renders
    const { returnOfficialBallotClosed } = this.state;
    if (returnOfficialBallotClosed) {
      return null;
    } else {
      // console.log('textForMapSearch before: ', textForMapSearch);
      return (
        <div id="location_guess" className="card-main__location-guess">
          <ParagraphStyled>
            We Vote helps you get ready to vote,
            {' '}
            <strong>
              but you can
              {'\''}
              t use We Vote to cast your vote
            </strong>
            .
            {' '}
            Make sure to return your official ballot!
            {' '}
            <HidePopupWrapper>
              <OpenExternalWebSite
                linkIdAttribute="weVoteCastVote"
                url="https://help.wevote.us/hc/en-us/articles/115002401353-Can-I-cast-my-vote-with-We-Vote-"
                target="_blank"
                body="See more information about casting your official vote."
              />
            </HidePopupWrapper>
          </ParagraphStyled>
          <CloseComponent id="closeReturnOfficialBallot" onClick={this.closeReturnOfficialBallot}>
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
  margin: 10px;
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

const HidePopupWrapper = styled.div`
  @media print{
    display: none;
  }
`;

export default withStyles(styles)(ReturnOfficialBallot);


