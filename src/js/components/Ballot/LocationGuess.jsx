import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/esm/styles/index';
import PlaceIcon from '@material-ui/icons/Place';
import cookies from '../../utils/cookies';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

class LocationGuess extends Component {
  static propTypes = {
    toggleSelectBallotModal: PropTypes.func.isRequired,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      locationGuessClosed: false,
      textForMapSearch: '',
    };
  }

  componentDidMount () {
    this.setState({
      locationGuessClosed: cookies.getItem('location_guess_closed'),
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.props.toggleSelectBallotModal !== nextProps.toggleSelectBallotModal) {
      return true;
    }
    if (this.state.locationGuessClosed !== nextState.locationGuessClosed) {
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
      locationGuessClosed: cookies.getItem('location_guess_closed'),
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
  }

  closeLocationGuess = () => {
    const oneMonthExpires = 86400 * 31;
    cookies.setItem('location_guess_closed', '1', oneMonthExpires, '/');
    this.setState({
      locationGuessClosed: true,
    });
  };

  render () {
    renderLog('LocationGuess');  // Set LOG_RENDER_EVENTS to log all renders
    const { locationGuessClosed, textForMapSearch } = this.state;
    if (locationGuessClosed) {
      return null;
    } else {
      const { toggleSelectBallotModal, classes } = this.props;
      // console.log('textForMapSearch before: ', textForMapSearch);
      return (
        <PrintWrapper id="location_guess" className="card-main__location-guess">
          <PlaceIcon classes={{ root: classes.iconRoot }} />
          <ParagraphStyled>
            {textForMapSearch ?
              (
                <span>
                  Our best guess for your location is
                  {' '}
                  <BestGuess>
                    &quot;
                    {textForMapSearch}
                    &quot;
                  </BestGuess>
                  .
                  {' '}
                </span>
              ) :
              null
            }
            <AddressLink
              id="locationGuessEnterYourFullAddress"
              onClick={toggleSelectBallotModal}
            >
              Enter your full address
            </AddressLink>
            {' '}
            to see the correct ballot items.
          </ParagraphStyled>
          <CloseComponent id="closeLocationGuess" onClick={this.closeLocationGuess}>
            &times;
          </CloseComponent>
        </PrintWrapper>
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

const PrintWrapper = styled.div`
  @media print {
    display: none;
  }
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

const BestGuess = styled.span`
  font-weight: bold;
`;

const AddressLink = styled.span`
  color: #4371cc;
  text-decoration: underline;
  cursor: pointer;
`;

export default withStyles(styles)(LocationGuess);
