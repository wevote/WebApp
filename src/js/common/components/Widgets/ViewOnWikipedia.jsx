import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import SplitIconButton from './SplitIconButton';
import normalizedImagePath from '../../utils/normalizedImagePath';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './OpenExternalWebSite'));

const wikipediaIcon = '../../../img/global/logos/wikipedia-icon.svg';


class ViewOnWikipedia extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <Wrapper>
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="wikipedia"
            url={this.props.externalLinkUrl}
            target="_blank"
            title="WIKIPEDIA"
            body={(
              <SplitIconButton
                adjustedIconWidth={50}
                buttonText="Wikipedia"
                backgroundColor="#fff"
                compressedSize
                externalUniqueId="viewOnWikipedia"
                fontColor="#000"
                icon={<img src={normalizedImagePath(wikipediaIcon)} alt="" height="22px" width="22px" />}
                title="View on Wikipedia"
              />
            )}
          />
        </Suspense>
      </Wrapper>
    );
  }
}
ViewOnWikipedia.propTypes = {
  externalLinkUrl: PropTypes.string,
};

const Wrapper = styled('div')`
  margin-bottom: 12px;
`;

export default ViewOnWikipedia;
