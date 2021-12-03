import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import AppObservableStore from '../../stores/AppObservableStore';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';

export default class MessageCard extends Component {
  constructor (props) {
    super(props);
    this.state = {};

    this.onClick = this.onClick.bind(this);
  }

  onClick () {
    if (this.props.inShareModal) {
      AppObservableStore.setShowShareModal(false);
    }

    // console.log('MessageCard historyPush(this.props.buttonURL) #####################', this.props.buttonURL);
    historyPush(this.props.buttonURL);
  }

  render () {
    renderLog('MessageCard');  // Set LOG_RENDER_EVENTS to log all renders
    const { buttonText, icon, inShareModal, mainText, noCard, secondaryText } = this.props;

    return (
      <Card inModal={inShareModal} className={noCard ? '' : 'card'}>
        <InnerWrapper>
          <MainText>{mainText}</MainText>
          {icon ? (
            <Icon>{icon}</Icon>
          ) : null}
          {secondaryText ? (
            <SecondaryText>{secondaryText}</SecondaryText>
          ) : null}
          <Button onClick={this.onClick} fullWidth={this.props.fullWidthButton} variant="contained" color="primary">
            {buttonText}
          </Button>
        </InnerWrapper>
      </Card>
    );
  }
}
MessageCard.propTypes = {
  buttonText: PropTypes.string,
  buttonURL: PropTypes.string,
  fullWidthButton: PropTypes.bool,
  icon: PropTypes.object,
  inShareModal: PropTypes.bool,
  mainText: PropTypes.string,
  noCard: PropTypes.bool,
  secondaryText: PropTypes.string,
};

const Card = styled.div`
  padding: ${(props) => (props.inModal ? '0' : '64px 32px')};
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Icon = styled.div`
  margin: 0 auto;
  font-size: 80px;
  width: 200px;
  height: 200px;
  * {
    width: 200px !important;
    height: 200px !important;
    fill: rgba(46, 60, 93, .4) !important;
  }
`;

const MainText = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px !important;
`;

const SecondaryText = styled.h4`
  font-size: 18px;
  font-weight: normal;
  margin-bottom: 28px !important;
`;
