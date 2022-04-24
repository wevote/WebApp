import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import toTitleCase from '../../common/utils/toTitleCase';

class OfficeItem extends Component {
  render () {
    renderLog('OfficeItem');  // Set LOG_RENDER_EVENTS to log all renders
    let { ballotItemDisplayName } = this.props;
    const { weVoteId } = this.props;
    const officeLink = `/office/${weVoteId}`;
    const goToOfficeLink = () => { historyPush(officeLink); };

    ballotItemDisplayName = toTitleCase(ballotItemDisplayName);
    const candidatesHtml = <span />; // For a preview of the candidates

    return (
      <div className="card-main__office-item" style={{ marginLeft: `${isCordova() ? '16px' : 'undefined'}` }}>
        <div className="card-main__content">
          <OfficeNameWrapper>
            { this.props.linkToBallotItemPage ?
              <Link to={officeLink}>{ballotItemDisplayName}</Link> :
              ballotItemDisplayName}
          </OfficeNameWrapper>

          <div
            className={this.props.linkToBallotItemPage ? 'u-cursor--pointer' : null}
            onClick={this.props.linkToBallotItemPage ? goToOfficeLink : null}
          >
            {candidatesHtml}
          </div>
        </div>
      </div>
    );
  }
}
OfficeItem.propTypes = {
  weVoteId: PropTypes.string.isRequired,
  ballotItemDisplayName: PropTypes.string.isRequired,
  linkToBallotItemPage: PropTypes.bool,
};

const styles = (theme) => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    [theme.breakpoints.down('xs')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
  },
});

const OfficeNameWrapper = styled('h2')(({ theme }) => (`
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
  margin-right: 8px;  // space between candidate name and description
  margin-bottom: 8px;
  vertical-align: middle;
  white-space: ${isCordova() ? 'nowrap' : 'normal'};
  overflow: hidden; // Not working yet
  text-overflow: ellipsis; // Not working yet
  ${theme.breakpoints.down('md')} {
    font-size: 18px;
  }
  @media print {
    font-size: 22px;
  }
`));

export default withTheme(withStyles(styles)(OfficeItem));
