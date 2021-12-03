import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { cordovaDot } from '../../utils/cordovaUtils';
import SplitIconButton from '../../common/components/Widgets/SplitIconButton';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const googleIcon = '../../../img/global/logos/google-icon.svg';


class SearchOnGoogle extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.generateURL = this.generateURL.bind(this);
  }

  generateURL (item) {
    const temp = item.replace(/ /g, '+');
    return `https://www.google.com/search?q=${temp}&oq=${temp}`;
  }

  render () {
    return (
      <Wrapper>
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="googleQuery"
            url={this.generateURL(this.props.googleQuery)}
            target="_blank"
            title="Search on Google"
            body={(
              <SplitIconButton
                buttonText="Google Search"
                backgroundColor="#fff"
                compressedSize
                externalUniqueId="searchOnGoogle"
                fontColor="#000"
                fontSize="10px"
                icon={<img src={cordovaDot(googleIcon)} alt="" />}
                title="Search on Google"
              />
            )}
          />
        </Suspense>
      </Wrapper>
    );
  }
}
SearchOnGoogle.propTypes = {
  googleQuery: PropTypes.string,
};

const Wrapper = styled.div`
`;

export default SearchOnGoogle;
