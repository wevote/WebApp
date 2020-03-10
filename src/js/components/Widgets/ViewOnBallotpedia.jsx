import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import OpenExternalWebSite from './OpenExternalWebSite';
import { cordovaDot } from '../../utils/cordovaUtils';
import ballotpediaIcon from '../../../img/global/logos/ballotpedia-initials-67x48.png';
import SplitIconButton from './SplitIconButton';


class ViewOnBallotpedia extends Component {
  static propTypes={
    externalLinkUrl: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <Wrapper>
        <OpenExternalWebSite
          url={this.props.externalLinkUrl}
          target="_blank"
          title="BALLOTPEDIA"
          body={(
            <SplitIconButton
              buttonText="Ballotpedia"
              backgroundColor="#fff"
              compressedSize
              fontColor="#000"
              icon={<img src={cordovaDot(ballotpediaIcon)} alt="" />}
              title="View on Ballotpedia"
            />
          )}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
`;

export default ViewOnBallotpedia;
