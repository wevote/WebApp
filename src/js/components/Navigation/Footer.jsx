import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import React, { Component, Suspense } from 'react';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import { getApplicationViewBooleans } from '../../utils/applicationUtils';
// importRemoveCordovaListenersToken2  -- Do not remove this line!


const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const FooterBar = React.lazy(() => import(/* webpackChunkName: 'FooterBar' */ './FooterBar'));
const FooterMain = React.lazy(() => import(/* webpackChunkName: 'FooterMain' */ './FooterMain'));
const ShareButtonFooter = React.lazy(() => import(/* webpackChunkName: 'ShareButtonFooter' */ '../Share/ShareButtonFooter'));


// Wrapper component for all footers
class Footer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      previousPathname: '',
    };
  }

  componentDidMount () {
    // console.log('Footer componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    window.addEventListener('scroll', this.handleWindowScroll);
    const siteVars = getApplicationViewBooleans(normalizedHref());
    // console.log('siteVars:', siteVars);
    const { showFooterBar, showFooterMain, showShareButtonFooter } = siteVars;
    const pathname = normalizedHref();
    this.setState({
      previousPathname: pathname,
      showFooterBar,
      showFooterMain,
      showShareButtonFooter,
    });
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    window.removeEventListener('scroll', this.handleWindowScroll);
    // removeCordovaListenersToken -- Do not remove this line!
  }

  onAppObservableStoreChange () {
    // console.log('Footer onAppObservableStoreChange');
    const siteVars = getApplicationViewBooleans(normalizedHref());
    const {
      showFooterBar,
      showFooterMain,
      showShareButtonFooter,
    } = siteVars;
    const pathname = normalizedHref();
    const {
      previousPathname,
      showFooterBar: previousShowFooterBar,
      showFooterMain: previousShowFooterMain,
      showShareButtonFooter: previousShowShareButtonFooter,
    } = this.state;
    if (previousPathname !== pathname) {
      this.setState({
        previousPathname: pathname,
        showFooterBar,
        showFooterMain,
        showShareButtonFooter,
      });
    } else {
      if (previousShowFooterBar !== showFooterBar) {
        this.setState({
          showFooterBar,
        });
      }
      if (previousShowFooterMain !== showFooterMain) {
        this.setState({
          showFooterMain,
        });
      }
      if (previousShowShareButtonFooter !== showShareButtonFooter) {
        this.setState({
          showShareButtonFooter,
        });
      }
    }
  }

  handleWindowScroll = (evt) => {
    const { scrollTop } = evt.target.scrollingElement;
    if (scrollTop > 60 && !AppObservableStore.getScrolledDown()) {
      AppObservableStore.setScrolled(true);
    }
    if (scrollTop < 60 && AppObservableStore.getScrolledDown()) {
      AppObservableStore.setScrolled(false);
    }
  };

  render () {
    const { /* doShowHeader, doShowFooter, */ showFooterBar, showFooterMain, showShareButtonFooter } = this.state;

    return (
      <FooterWrapper>
        {(showFooterMain) && (
          <FooterMainWrapper>
            <Suspense fallback={<span>&nbsp;</span>}>
              <DelayedLoad waitBeforeShow={1000}>
                <FooterMain />
              </DelayedLoad>
            </Suspense>
          </FooterMainWrapper>
        )}
        {showShareButtonFooter && (
          <ShareButtonFooterWrapper>
            <Suspense fallback={<span>&nbsp;</span>}>
              <ShareButtonFooter />
            </Suspense>
          </ShareButtonFooterWrapper>
        )}
        {showFooterBar && (
          <FooterBarWrapper className={isWebApp() ? 'footroom-wrapper' : 'footroom-wrapper-cordova'}>
            <Suspense fallback={<span>&nbsp;</span>}>
              <FooterBar />
            </Suspense>
          </FooterBarWrapper>
        )}
      </FooterWrapper>
    );
  }
}

const styles = () => ({
});

const FooterBarWrapper = styled('div')`
`;

const FooterMainWrapper = styled('div')`
`;

const FooterWrapper = styled('div')`
`;

const ShareButtonFooterWrapper = styled('div')`
`;

export default withStyles(styles)(Footer);
