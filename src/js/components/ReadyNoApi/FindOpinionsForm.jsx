import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import {
  blurTextFieldAndroid,
  focusTextFieldAndroid, historyPush,
  isCordova,
} from '../../utils/cordovaUtils';

class FindOpinionsForm extends Component {
  static propTypes = {
    classes: PropTypes.object,
    headerText: PropTypes.string,
    searchTextLarge: PropTypes.bool,
    theme: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      searchText: '',
    };
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
    const { classes, headerText, searchTextLarge, theme } = this.props;
    const { searchText } = this.state;
    const inputBaseInputClasses = searchTextLarge ? classes.inputDefaultLarge : classes.inputDefault;
    const inputBaseRootClasses = searchTextLarge ? classes.inputBaseRootLarge : classes.inputBaseRoot;
    const searchIconClasses = searchTextLarge ? classes.iconRootLarge : classes.iconRoot;
    // console.log('FilterBaseSearch render');
    return (
      <OuterWrapper>
        <InnerWrapper>
          <IntroHeader>
            {headerText || 'Find Candidates & Opinions'}
          </IntroHeader>
          <SearchWrapper
            brandBlue={theme.palette.primary.main}
            isCordova={isCordova()}
            searchTextLarge={searchTextLarge}
          >
            <InputBase
              classes={{ input: inputBaseInputClasses, root: inputBaseRootClasses }}
              inputRef={(input) => { this.searchInput = input; }}
              onBlur={blurTextFieldAndroid}
              onChange={this.handleSearchTextChange}
              onFocus={focusTextFieldAndroid}
              onKeyDown={this.handleKeyPress}
              placeholder="Search"
              value={searchText}
            />
            <Separator />
            <IconButton
              classes={{ root: classes.iconButtonRoot }}
              onClick={this.goToSearchPage}
            >
              <SearchIcon classes={{ root: searchIconClasses }} />
            </IconButton>
          </SearchWrapper>
        </InnerWrapper>
      </OuterWrapper>
    );
  }
}

const styles = theme => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
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
    [theme.breakpoints.down('md')]: {
      width: '50%',
      fontSize: 'inherit',
    },
    [theme.breakpoints.down('sm')]: {
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
    [theme.breakpoints.down('md')]: {
      width: '50%',
      fontSize: 'inherit',
    },
    [theme.breakpoints.down('sm')]: {
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

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 !important;
`;

const InnerWrapper = styled.div`
`;

const IntroHeader = styled.div`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 18px;
    margin-top: 0;
  }
`;

const Separator = styled.div`
  // background: rgba(0, 0, 0, .2);
  // display: 'inherit';
  // height: 100%;
  // width: 1px;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 4px;
  height: ${({ searchTextLarge }) => (searchTextLarge ? '32px' : '26px')};
  border: 1px solid #ccc;
  padding: 0 3px 0 3px;
  margin-bottom: 8px;
  text-align: center;
`;

export default withTheme(withStyles(styles)(FindOpinionsForm));
