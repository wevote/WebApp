import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { Component, Suspense } from 'react';
import Confetti from 'react-confetti';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { renderLog } from '../../common/utils/logging';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

class BallotChoicesAndSettingsModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showConfetti: false,
    };
  }

  componentDidMount () {
    // Show confetti when modal first mounts
    if (this.props.show) {
      this.setState({ showConfetti: true });
      setTimeout(() => {
        this.setState({ showConfetti: false });
      }, 5000);
    }
  }

  toggleModal = () => {
    this.props.toggleFunction(normalizedHref());
  };

  BallotChoicesAndSettingsBody () {
    return (
      <BallotChoiceWrapper>
        <Settingssection>
          <BallotChoiceTitle>1. Do you want to know how your personal data is being stored?</BallotChoiceTitle>
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
                linkIdAttribute="wevotePrivacy_data"
                url="https://help.wevote.us/hc/en-us/articles/360034759253-How-are-you-using-my-personal-data-What-protections-do-you-guarantee-me"
                target="_blank"
                body={<span>How are you using my personal data? What protections do you guarantee me?</span>}
            />
          </Suspense>
        </Settingssection>
        <Settingssection>
          <BallotChoiceTitle>2. Do you want to remove all your data and voting references?</BallotChoiceTitle>
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
                  linkIdAttribute="wevotePrivacy_removeData"
                  url="https://help.wevote.us/hc/en-us/articles/360041733393-How-do-I-remove-all-of-my-data-and-voting-preferences"
                  target="_blank"
                  body={<span>How do I remove all of my data and voting preferences?</span>}
            />
          </Suspense>
        </Settingssection>
        <Settingssection>
          <BallotChoiceTitle>3. Do you want to edit your profile?</BallotChoiceTitle>
          <BallotChoicetext>Click on the head icon/your profile photo on the top</BallotChoicetext>
        </Settingssection>
      </BallotChoiceWrapper>
    );
  }



  renderConfetti () {
    if (!this.state.showConfetti) return null;
    return (
      <Renderconfetti>
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={500}
          recycle={false}
          confettiSource={{ x: 0, y: 0, w: window.innerWidth, h: 0 }}
          colors={['#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C', '#FF7F50']}
        />
      </Renderconfetti>
    );
  }

  render () {
    renderLog('BallotChoicesAndSettingsModal');
    const { show } = this.props;

    if (!show) {
      return null;
    }

    return (
      <>
        {this.renderConfetti()}
        <ModalDisplayTemplateA
          dialogTitleJSX={<Title>Your ballot choices & settings are saved</Title>}
          show={show}
          toggleModal={this.toggleModal}
          textFieldJSX={this.BallotChoicesAndSettingsBody()}
        />
      </>
    );
  }
}

BallotChoicesAndSettingsModal.propTypes = {
  show: PropTypes.bool,
  toggleFunction: PropTypes.func.isRequired,
};


const BallotChoiceWrapper = styled('div')`
    padding-top: 20px;
    padding-right: 24px;
    padding-bottom: 20px;
    padding-left: 24px
`;
const Settingssection = styled('div')`
    margin-bottom: 24px,
`;
const BallotChoiceTitle = styled('h3')`
    font-size: 18px;
    margin-top: 12px;
    margin-bottom: 12px;
    font-weight: 500;
`;
const BallotChoicetext = styled('p')`
      margin-top: 8px,
      color: #555,
`;
const Renderconfetti = styled('div')`
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        pointerEvents: 'none'
`;

const Title = styled('h3')`
  font-size: 24px;;
  color: black;
  margin-top: 6px;
  margin-bottom: 6px;
  font-weight: bold;
`;


export default BallotChoicesAndSettingsModal;
