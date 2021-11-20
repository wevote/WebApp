import { withStyles } from '@material-ui/core/styles/index';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import Cookies from '../../utils/js-cookie/Cookies';
import { renderLog } from '../../utils/logging';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../Widgets/OpenExternalWebSite'));

class ReturnOfficialBallot extends Component {
  constructor (props) {
    super(props);
    this.state = {
      returnOfficialBallotClosed: false,
    };
  }

  componentDidMount () {
    this.setState({
      returnOfficialBallotClosed: Cookies.get('return_official_ballot_closed'),
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
    Cookies.set('return_official_ballot_closed', '1', { expires: 31, path: '/' });
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
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="weVoteCastVote"
                  url="https://help.wevote.us/hc/en-us/articles/115002401353-Can-I-cast-my-vote-with-We-Vote-"
                  target="_blank"
                  body="See more information about casting your official vote."
                />
              </Suspense>
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


