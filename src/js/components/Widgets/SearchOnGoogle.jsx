import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import OpenExternalWebSite from './OpenExternalWebSite';
import { cordovaDot } from '../../utils/cordovaUtils';
import googleIcon from '../../../img/global/logos/google-icon.svg';
import SplitIconButton from './SplitIconButton';


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
