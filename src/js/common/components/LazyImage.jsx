import PropTypes from 'prop-types';
import React from 'react';

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

  componentWillUnmount () {
    this.imageLoader.onload = () => {};
    this.imageLoader = null;
  }

  render () {
    const { placeholder, className, height, width, alt } = this.props;
    const { src } = this.state;
    return (
      <img src={src || placeholder} className={className} height={height} width={width} alt={alt} />
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
};
