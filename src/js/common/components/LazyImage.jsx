import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

export default class LazyImage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      src: null,
    };
  }

  componentDidMount () {
    const { src } = this.props;
    // console.log('LazyImage componentDidMount props:', this.props);

    this.imageLoader = new Image();
    this.imageLoader.src = src;

    this.imageLoader.onload = () => {
      // console.log('LazyImage loaded src:', src);
      this.setState({ src });
    };
  }

  componentDidUpdate (prevProps) {
    const { src } = this.props;
    const { src: srcPrevious } = prevProps;
    if (src !== srcPrevious) {
      this.setState({ src });
    }
  }

  componentWillUnmount () {
    this.imageLoader.onload = () => {};
    this.imageLoader = null;
  }

  render () {
    const { placeholder, className, height, width, alt, isAvatar } = this.props;
    const { src } = this.state;
    return (
      <StyledImage isAvatar={isAvatar} src={src || placeholder} className={className} height={height} width={width} alt={alt} />
    );
  }
}

LazyImage.propTypes = {
  src: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  alt: PropTypes.string,
  isAvatar: PropTypes.bool,
};


// was .header-nav__avatar
const StyledImage = styled('img', {
  shouldForwardProp: (prop) => !['isAvatar'].includes(prop),
})(({ isAvatar }) => (`
  ${isAvatar ?
    'border-radius: 18px;' +
    'background: #fff;' +
    'overflow: hidden;' +
    'display: inline;' +
    'margin-top: 7px;' +
    'margin-bottom: 7px;' +
    'min-width: 24px;' +
    'max-width: 34px;' :
    ''}
`));

