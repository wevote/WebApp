import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import SplitIconButton from './SplitIconButton';
import normalizedImagePath from '../../utils/normalizedImagePath';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './OpenExternalWebSite'));

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
                buttonText="Search"
                backgroundColor="#fff"
                compressedSize
                externalUniqueId="searchOnGoogle"
                fontColor="#000"
                icon={<img src={normalizedImagePath(googleIcon)} alt="" height="22" width="22" />}
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

const Wrapper = styled('div')`
`;

export default SearchOnGoogle;
