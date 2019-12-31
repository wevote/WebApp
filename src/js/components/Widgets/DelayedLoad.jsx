import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class DelayedLoad extends Component {
  static propTypes = {
    children: PropTypes.object,
    showLoadingText: PropTypes.bool,
    waitBeforeShow: PropTypes.number.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = { hidden: true };
  }

  componentDidMount () {
    this.timer = setTimeout(() => {
      this.setState({ hidden: false });
    }, this.props.waitBeforeShow);
  }

  componentWillUnmount () {
    this.timer = null;
  }

  render () {
    const { showLoadingText } = this.props;
    const { hidden } = this.state;
    return hidden ? (
      <DelayedLoadingWrapper>
        {!!(showLoadingText) && (
          <>
            <LoadingText>
              Loading...
            </LoadingText>
          </>
        )}
      </DelayedLoadingWrapper>
    ) : this.props.children;
  }
}

const DelayedLoadingWrapper = styled.div`
  padding: 5px;
`;

const LoadingText = styled.div`
  padding: 5px;
  text-align: center;
`;

export default DelayedLoad;
