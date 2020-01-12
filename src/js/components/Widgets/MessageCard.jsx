import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/esm/Button';
import PropTypes from 'prop-types';
import { historyPush } from '../../utils/cordovaUtils';

export default class MessageCard extends Component {
  static propTypes = {
    buttonText: PropTypes.string,
    buttonURL: PropTypes.string,
    icon: PropTypes.string,
    inModal: PropTypes.bool,
    noCard: PropTypes.bool,
    mainText: PropTypes.string,
    secondaryText: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    const { buttonText, buttonURL, icon, inModal, mainText, noCard, secondaryText } = this.props;

    return (
      <Card inModal={inModal} className={noCard ? '' : 'card'}>
        <InnerWrapper className="card-main">
          {icon ? (
            <Icon>{icon}</Icon>
          ) : null}
          <MainText>{mainText}</MainText>
          {secondaryText ? (
            <SecondaryText>{secondaryText}</SecondaryText>
          ) : null}
          <Button variant="contained" color="primary" onClick={() => historyPush(buttonURL)}>
            {buttonText}
          </Button>
        </InnerWrapper>
      </Card>
    );
  }
}

const Card = styled.div`
  padding: ${props => (props.inModal ? '0' : '64px 32px')};
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
  font-size: 48px;
  width: 100px;
  height: 100px;
`;

const MainText = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 48px !important;
`;

const SecondaryText = styled.h4`
  font-size: 18px;
  font-weight: normal;
  margin-bottom: 12px !important;
`;
