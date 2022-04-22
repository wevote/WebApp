import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { renderLog } from '../../common/utils/logging';

const SettingsAccountLevelChip = React.lazy(() => import(/* webpackChunkName: 'SettingsAccountLeveLChip' */ '../Settings/SettingsAccountLevelChip'));


class HamburgerMenuRowCentered extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.onClickAction = this.props.onClickAction ? this.props.onClickAction.bind(this) : null;
  }

  render () {
    renderLog('HamburgerMenuRowCentered');  // Set LOG_RENDER_EVENTS to log all renders
    const { showProChip } = this.props;

    return (
      <CenteredTR>
        <CenteredTD colSpan={3}>
          <Link onClick={this.onClickAction} to={this.props.to}>
            <LinkTextWrapper>
              {this.props.linkText}
              {showProChip ? <SettingsAccountLevelChip onClickDisabled requiredFeaturePackage="PROFESSIONAL" /> : null}
            </LinkTextWrapper>
          </Link>
        </CenteredTD>
      </CenteredTR>
    );
  }
}
HamburgerMenuRowCentered.propTypes = {
  linkText: PropTypes.string.isRequired,
  onClickAction: PropTypes.func,
  showProChip: PropTypes.bool,
  to: PropTypes.string.isRequired,
};

const styles = () => ({
  indicator: {
    height: 4,
  },
});

const CenteredTD = styled('td')`
  text-align: center;
  vertical-align: middle !important;
`;

const CenteredTR = styled('tr')`
  height: 50px;
`;

const LinkTextWrapper = styled('div')`
  font-size: 20px;
  width: 100%;
`;

export default withStyles(styles)(HamburgerMenuRowCentered);
