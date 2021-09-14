import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';

class DelayedLoad extends Component {
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
    if (this.timer) clearTimeout(this.timer);
  }

  render () {
    renderLog('DelayedLoad');  // Set LOG_RENDER_EVENTS to log all renders
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
DelayedLoad.propTypes = {
  children: PropTypes.object,
  showLoadingText: PropTypes.bool,
  waitBeforeShow: PropTypes.number.isRequired,
};

const DelayedLoadingWrapper = styled.div`
  padding: 5px;
`;

const LoadingText = styled.div`
  padding: 5px;
  text-align: center;
`;

export default DelayedLoad;
