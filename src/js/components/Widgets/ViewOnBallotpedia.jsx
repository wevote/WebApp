import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import OpenExternalWebSite from './OpenExternalWebSite';
import { cordovaDot } from '../../utils/cordovaUtils';
import ballotpediaIcon from '../../../img/global/logos/ballotpedia-initials-57x33.png';
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
              adjustedIconWidth={50}
              buttonText="Ballotpedia"
              backgroundColor="#fff"
              compressedSize
              externalUniqueId="viewOnBallotpedia"
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
  margin-bottom: 12px;
`;

export default ViewOnBallotpedia;
