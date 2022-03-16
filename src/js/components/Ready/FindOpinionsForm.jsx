import { IconButton, InputBase } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import { Search } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from '@mui/material/styles/styled';
import passBool from '../../common/utils/passBool';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { blurTextFieldAndroid, focusTextFieldAndroid, isAndroid, isIOS } from '../../common/utils/cordovaUtils';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));

class FindOpinionsForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      searchText: '',
      opinionPhotosHtml: <span />,
    };
  }

  componentDidMount () {
    this.onVoterGuideStoreChange();
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    const { showVoterGuidePhotos, uniqueExternalId } = this.props;
    if (showVoterGuidePhotos) {
      const limit = 3;
      const publicFiguresToFollow = VoterGuideStore.getVoterGuidesToFollowAll(limit, true);
      const organizationsToFollow = VoterGuideStore.getVoterGuidesToFollowAll(limit, false, true);
      const combinedVoterGuides = publicFiguresToFollow.concat(organizationsToFollow);
      // console.log('onVoterGuideStoreChange:', combinedVoterGuides)
      const opinionPhotosHtml = (
        <PublicFiguresAndOrganizationsList>
          {combinedVoterGuides.map((voterGuide) => {
            const voterGuideLink = voterGuide.twitter_handle ? `/${voterGuide.twitter_handle}` : `/voterguide/${voterGuide.organization_we_vote_id}`;
            if (!voterGuide.voter_guide_image_url_tiny) {
              return null;
            }
            return (
              <OneVoterGuideWrapper key={`findOpinionsFormPreviewImage-${voterGuide.organization_we_vote_id}-${uniqueExternalId}`}>
                <Link
                  className="u-no-underline"
                  id={`findOpinionsFormPreviewImageLink-${voterGuide.organization_we_vote_id}-${uniqueExternalId}`}
                  to={voterGuideLink}
                >
                  <Suspense fallback={<></>}>
                    <ImageHandler className="card-child__avatar" sizeClassName="image-sm " imageUrl={voterGuide.voter_guide_image_url_tiny} />
                  </Suspense>
                </Link>
              </OneVoterGuideWrapper>
            );
          })}
        </PublicFiguresAndOrganizationsList>
      );
      this.setState({
        opinionPhotosHtml,
      });
    }
  }

  handleKeyPress = (event) => {
    // console.log('AddressBox, handleKeyPress, event: ', event);
    const enterAndSpaceKeyCodes = [13]; // This is the carriage return character
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      event.preventDefault();
      this.goToSearchPage();
    }
  }

  handleSearchTextChange = (event) => {
    const { searchText: priorSearchText } = this.state;
    let { value: searchText } = event.target;
    searchText = searchText.trimStart();

    if (priorSearchText !== searchText) {
      this.setState({ searchText });
    }
  }

  inputFieldReceivesFocus = () => {
    if (isAndroid()) {
      focusTextFieldAndroid();
    } else if (isIOS()) {
      const { $ } = window;
      $("div[class^='Ready__EditAddressWrapper']").hide();
      $("div[class^='ReadyTaskStyles__ReadyCard']").hide();
    }
  }

  textFieldWillBlur = () => {
    if (isAndroid()) {
      blurTextFieldAndroid();
    } else if (isIOS()) {
      const { $ } = window;
      $("div[class^='Ready__EditAddressWrapper']").show();
      $("div[class^='ReadyTaskStyles__ReadyCard']").show();
    }
  }

  goToSearchPage = () => {
    const { searchText } = this.state;
    if (searchText) {
      historyPush(`/opinions/s/${searchText}`);
    } else {
      historyPush('/opinions');
    }
  }

  render () {
    renderLog('FindOpinionsForm');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, headerText, introHeaderLink, searchTextLarge, theme, uniqueExternalId } = this.props;
    const { opinionPhotosHtml, searchText } = this.state;
    const inputBaseInputClasses = searchTextLarge ? classes.inputDefaultLarge : classes.inputDefault;
    const inputBaseRootClasses = searchTextLarge ? classes.inputBaseRootLarge : classes.inputBaseRoot;
    const searchIconClasses = searchTextLarge ? classes.iconRootLarge : classes.iconRoot;
    // console.log('FilterBaseSearch render');
    return (
      <OuterWrapper>
        <InnerWrapper>
          {introHeaderLink ? (
            <Link
              className="u-no-underline"
              id={`findCandidatesAndOpinionsHeaderLink-${uniqueExternalId}`}
              to={introHeaderLink}
            >
              <IntroHeader>
                {headerText || 'Find Candidates & Opinions'}
              </IntroHeader>
            </Link>
          ) : (
            <IntroHeader>
              {headerText || 'Find Candidates & Opinions'}
            </IntroHeader>
          )}
          <SearchWrapper
            // brandBlue={theme.palette.primary.main}
            // isCordova={isCordova()}
            searchtextlarge={passBool(searchTextLarge)}
          >
            <InputBase
              id={`findCandidatesAndOpinionsSearch-${uniqueExternalId}`}
              classes={{ input: inputBaseInputClasses, root: inputBaseRootClasses }}
              inputRef={(input) => { this.searchInput = input; }}
              onBlur={this.textFieldWillBlur}
              onChange={this.handleSearchTextChange}
              onFocus={this.inputFieldReceivesFocus}
              onKeyDown={this.handleKeyPress}
              placeholder="Search"
              value={searchText}
            />
            <Separator />
            <IconButton
              classes={{ root: classes.iconButtonRoot }}
              id={`findCandidatesAndOpinionsIconClick-${uniqueExternalId}`}
              onClick={this.goToSearchPage}
              size="large">
              <Search classes={{ root: searchIconClasses }} />
            </IconButton>
          </SearchWrapper>
          <PublicFiguresAndOrganizationsWrapper>
            {opinionPhotosHtml}
          </PublicFiguresAndOrganizationsWrapper>
        </InnerWrapper>
      </OuterWrapper>
    );
  }
}
FindOpinionsForm.propTypes = {
  classes: PropTypes.object,
  headerText: PropTypes.string,
  introHeaderLink: PropTypes.string,
  searchTextLarge: PropTypes.bool,
  showVoterGuidePhotos: PropTypes.bool,
  theme: PropTypes.object,
  uniqueExternalId: PropTypes.string,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('lg')]: {
    },
    [theme.breakpoints.down('md')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
  iconButtonRoot: {
    padding: 0,
    borderRadius: 16,
    margin: 'auto 4px',
    outline: 'none !important',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  iconRoot: {
    width: 18,
    height: 18,
  },
  iconRootLarge: {
    width: 24,
    height: 24,
  },
  closeIconRoot: {
    width: 18,
    height: 18,
  },
  inputBaseRoot: {

  },
  inputBaseRootLarge: {
    width: '100%',
  },
  inputDefault: {
    padding: 0,
    marginLeft: 8,
    width: 75,
    transition: 'all ease-in 150ms',
    [theme.breakpoints.down('lg')]: {
      width: '50%',
      fontSize: 'inherit',
    },
    [theme.breakpoints.down('md')]: {
      width: 55,
      fontSize: 'inherit',
    },
  },
  inputDefaultLarge: {
    fontSize: 20,
    marginLeft: 8,
    padding: 0,
    width: '100%',
    transition: 'all ease-in 150ms',
  },
  inputHidden: {
    padding: 0,
    width: 0,
    transition: 'all ease-in 150ms',
  },
  inputSearching: {
    marginLeft: 8,
    padding: 0,
    width: 350,
    transition: 'all ease-in 150ms',
    [theme.breakpoints.down('lg')]: {
      width: '50%',
      fontSize: 'inherit',
    },
    [theme.breakpoints.down('md')]: {
      width: 150,
      fontSize: 'inherit',
    },
  },
  inputSearchingLarge: {
    fontSize: 20,
    marginLeft: 8,
    padding: 0,
    width: '100%',
    transition: 'all ease-in 150ms',
  },
});

const InnerWrapper = styled('div')`
`;

const IntroHeader = styled('div')`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 18px;
    margin-top: 0;
  }
`;

const OneVoterGuideWrapper = styled('div')`
  margin: 1px !important;
`;

const OuterWrapper = styled('div')`
  display: flex;
  justify-content: center;
  padding: 0 !important;
  min-height: ${() => (isCordova() ? '65px' : '100px')};
  max-width: 260px;
`;

const PublicFiguresAndOrganizationsList = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const PublicFiguresAndOrganizationsWrapper = styled('div')`
`;

const Separator = styled('div')`
  // background: rgba(0, 0, 0, .2);
  // display: 'inherit';
  // height: 100%;
  // width: 1px;
`;

const SearchWrapper = styled('div')`
  display: flex;
  flex-flow: row;
  border-radius: 4px;
  height: ${({ searchtextlarge }) => (searchtextlarge ? '32px' : '26px')};
  border: 1px solid #ccc;
  padding: 0 3px 0 3px;
  margin-bottom: 8px;
  text-align: center;
`;

export default withTheme(withStyles(styles)(FindOpinionsForm));
