import { Twitter } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { renderLog } from '../../common/utils/logging';
import numberWithCommas from '../../common/utils/numberWithCommas';
import numberAbbreviate from '../../common/utils/numberAbbreviate';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

// React functional component example
function TwitterAccountStats (props) {
  renderLog('TwitterAccountStats functional component');
  const { classes, includeLinkToTwitter, twitterFollowersCount, twitterHandle } = props;

  const twitterHtml = (
    <TwitterHtmlWrapper>
      <Twitter classes={{ root: classes.twitterLogo }} />
      {twitterHandle && (
        <TwitterHandleWrapper>
          @
          {twitterHandle}
        </TwitterHandleWrapper>
      )}
      <TwitterFollowersWrapper title={`${numberWithCommas(twitterFollowersCount)} followers`}>{numberAbbreviate(twitterFollowersCount)}</TwitterFollowersWrapper>
    </TwitterHtmlWrapper>
  );
  return (
    <TwitterAccountStatsOuterWrapper>
      {includeLinkToTwitter ? (
        <TwitterAccountStatsInnerWrapper className="u-cursor--pointer">
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
              body={<div style={{ marginTop: '-24px' }}>{twitterHtml}</div>} // -24px is to fix a "ghost in the CSS machine"
              linkIdAttribute="candidateTwitterDesktop"
              url={`https://twitter.com/${twitterHandle}`}
              target="_blank"
            />
          </Suspense>
        </TwitterAccountStatsInnerWrapper>
      ) : (
        <TwitterAccountStatsInnerWrapper>
          {twitterHtml}
        </TwitterAccountStatsInnerWrapper>
      )}
    </TwitterAccountStatsOuterWrapper>
  );
}
TwitterAccountStats.propTypes = {
  classes: PropTypes.object,
  includeLinkToTwitter: PropTypes.bool,
  twitterFollowersCount: PropTypes.number,
  twitterHandle: PropTypes.string,
};

const styles = () => ({
  twitterLogo: {
    color: '#1d9bf0',
    height: 18,
    marginRight: '-2px',
    marginTop: '-1px',
  },
});

const TwitterAccountStatsInnerWrapper = styled('div')`
  height: 24px;
  margin: 0;
  margin-top: 4px;
  white-space: nowrap;
`;

const TwitterAccountStatsOuterWrapper = styled('div')`
  height: 24px;
  margin-left: -4px;
`;

const TwitterFollowersWrapper = styled('div')`
  color: #000;
  font-size: 14px;
  height: 24px;
  padding: 0 !important;
`;

const TwitterHandleWrapper = styled('div')`
  color: #000;
  font-size: 14px;
  height: 24px;
  margin-right: 5px;
  padding: 0 !important;
`;

const TwitterHtmlWrapper = styled('div')`
  align-items: center;
  display: flex;
  height: 24px;
  justify-content: flex-start;
  margin: 0 !important;
  padding: 0 !important;
`;

export default withTheme(withStyles(styles)(TwitterAccountStats));
