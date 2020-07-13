import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import OpenExternalWebSite from './OpenExternalWebSite';
import { cordovaDot } from '../../utils/cordovaUtils';
import googleIcon from '../../../img/global/logos/google-icon.svg';
import SplitIconButton from './SplitIconButton';


class SearchOnGoogle extends Component {
  static propTypes={
    googleQuery: PropTypes.string,
  };

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
          url={this.generateURL(this.props.googleQuery)}
          target="_blank"
          title="Search on Google"
          body={(
            <SplitIconButton
              buttonText="Google Search"
              backgroundColor="#fff"
              compressedSize
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

const Wrapper = styled.div`
`;

export default SearchOnGoogle;
