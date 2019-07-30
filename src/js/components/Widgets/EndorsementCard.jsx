import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { cordovaDot } from '../../utils/cordovaUtils';
import OpenExternalWebSite from './OpenExternalWebSite';
import positionIcon from '../../../img/global/svg-icons/positions-icon-24-x-24.svg';
import SplitIconButton from './SplitIconButton';

class EndorsementCard extends PureComponent {
  static propTypes = {
    buttonText: PropTypes.string,
    title: PropTypes.string,
    // bsPrefix: PropTypes.string,
    text: PropTypes.string,
  };

  render () {
    return (
      <div>
        <div className="card">
          <Container>
            <div className="endorsement-card">
              <OpenExternalWebSite
                url="https://api.wevoteusa.org/vg/create/"
                target="_blank"
                title={this.props.title}
                className="u-no-underline"
                body={(
                  // <Button
                  //   className="split-button split-button__left"
                  //   color="primary"
                  //   variant="contained"
                  // >
                  //   <span className="split-button__icon">
                  //     <img src={cordovaDot('/img/global/svg-icons/positions-icon-24-x-24.svg')} alt="" />
                  //   </span>
                  //   <div className="split-button__seperator split-button__seperator--left" />
                  //   <span className="split-button__text">
                  //     {this.props.buttonText}
                  //   </span>
                  // </Button>
                  <SplitIconButton
                    title="Add endorsements to We Vote"
                    id="endorsementCardAddEndorsementsToWeVote"
                    icon={<img src={cordovaDot(positionIcon)} alt="" />}
                    buttonText={this.props.buttonText}
                  />
                )}
              />
              <div className="endorsement-card__text">
                {this.props.text}
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

const Container = styled.div`
  padding: 16px;
`;

export default EndorsementCard;
