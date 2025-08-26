import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React from 'react';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import OfficeStore from '../../stores/OfficeStore';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

class ShowMoreButtons extends React.Component {
  handleShowMoreClick = () => {
    const {
      officeWeVoteId,
      showMoreId,
      showMoreButtonsLink,
      showMoreButtonWasClicked,
    } = this.props;

    const actionType = showMoreButtonWasClicked ? 'showLess' : 'showMore';

    const dataLayerObject = {
      event: 'action',
      actionDetails: {
        actionType,
        buttonId: showMoreId,
      },
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    const officeData = OfficeStore.getOffice(this.props.officeWeVoteId) || {};
    if (officeWeVoteId) {
      dataLayerObject.officeDetails = {
        officeName: officeData.ballot_item_display_name || '',
        officeWeVoteId,
        stateCode: officeData.state_code || '',
      };
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });
    showMoreButtonsLink();
  };

  render () {
    renderLog('ShowMoreButtons');
    const { classes, showLessCustomText, showMoreButtonWasClicked, showMoreCustomText, showMoreId } = this.props;
    const showMoreText = showMoreButtonWasClicked ?
      (showLessCustomText || 'show less') :
      (showMoreCustomText || 'show more');

    return (
      <ShowMoreButtonsStyled className="card-child" id={`toggleContentButton-${showMoreId}`} onClick={this.handleShowMoreClick}>
        <ShowMoreButtonsText id="showMoreLink">
          {showMoreText}
          {' '}
          {showMoreButtonWasClicked ? (
            <ArrowDropUp classes={{ root: classes.cardFooterIconRoot }} />
          ) : (
            <ArrowDropDown classes={{ root: classes.cardFooterIconRoot }} />
          )}
        </ShowMoreButtonsText>
      </ShowMoreButtonsStyled>
    );
  }
}

ShowMoreButtons.propTypes = {
  classes: PropTypes.object,
  officeWeVoteId: PropTypes.string,
  showLessCustomText: PropTypes.string,
  showMoreId: PropTypes.string.isRequired,
  showMoreButtonsLink: PropTypes.func.isRequired,
  showMoreButtonWasClicked: PropTypes.bool,
  showMoreCustomText: PropTypes.string,
};

const styles = (theme) => ({
  cardFooterIconRoot: {
    fontSize: 30,
    marginBottom: '.2rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
    },
  },
});

const ShowMoreButtonsStyled = styled('button')(({ theme }) => (`
  border: 0 !important;
  color: #206DB3;
  cursor: pointer;
  display: block !important;
  background: #fff !important;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
  padding: 0 !important;
  text-align: center !important;
  user-select: none;
  width: fit-content;
  ${theme.breakpoints.up('md')} {
    font-size: 16px;
  }
  &:hover {
    background-color: rgba(46, 60, 93, 0.15) !important;
    transition-duration: .2s;
  }
  @media print{
    display: none;
  }
`));

const ShowMoreButtonsText = styled('div')`
  margin: 8px 0 0 8px !important;
  padding: 0 !important;
  text-align: center !important;
  &:hover {
    text-decoration: underline;
  }
`;

export default withTheme(withStyles(styles)(ShowMoreButtons));
