import React, { Component } from 'react';
import PropTypes  from 'prop-types';

class ErrorBoundary extends Component {
  constructor (props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError (error) {
    // Update state so the next render will show the fallback UI.
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch (error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
    // logErrorToMyService(error, errorInfo);
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1 style={{ margin: '100px', color: 'black' }}>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.object,
};

export default ErrorBoundary;
