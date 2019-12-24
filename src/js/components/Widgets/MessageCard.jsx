import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/esm/Button';
import PropTypes from 'prop-types';
import { historyPush } from '../../utils/cordovaUtils';

export default class MessageCard extends Component {
  static propTypes = {
    mainText: PropTypes.string,
    buttonText: PropTypes.string,
    buttonURL: PropTypes.string,
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
    const { mainText, buttonText, buttonURL } = this.props;

    return (
      <Card className="card">
        <InnerWrapper className="card-main">
          <MainText>{mainText}</MainText>
          <Button variant="contained" color="primary" onClick={() => historyPush(buttonURL)}>
            {buttonText}
          </Button>
        </InnerWrapper>
      </Card>
    );
  }
}

const Card = styled.div`
  padding: 64px 32px;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const MainText = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 48px !important;
`;
