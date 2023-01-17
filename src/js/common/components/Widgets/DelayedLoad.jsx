import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { isCordova } from '../../utils/isCordovaOrWebApp';

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
    const { loadingTextLeftAlign, showLoadingText } = this.props;
    const { hidden } = this.state;
    return hidden ? (
      <DelayedLoadingWrapper>
        {!!(showLoadingText) && (
          <>
            <LoadingText leftAlign={loadingTextLeftAlign}>
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
  loadingTextLeftAlign: PropTypes.bool,
  showLoadingText: PropTypes.bool,
  waitBeforeShow: PropTypes.number.isRequired,
};

const DelayedLoadingWrapper = styled('div')`
  margin-top: ${() => (isCordova() ? '100px' : null)};
  padding-bottom: ${() => (isCordova() ? '800px' : null)};
`;

export const LoadingText = styled('div', {
  shouldForwardProp: (prop) => !['leftAlign'].includes(prop),
})(({ leftAlign }) => (`
  ${leftAlign ? '' : 'padding: 10px;'}
  ${leftAlign ? 'text-align: left;' : 'text-align: center;'}
`));

export default DelayedLoad;
