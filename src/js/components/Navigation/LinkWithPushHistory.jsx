import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';


/*
 The simplest way to define a component is to write a JavaScript function:
 This function is a valid React component because it accepts a single “props”
 (which stands for properties) object argument with data and returns a React element.
 We call such components “function components” because they are literally JavaScript functions.
 https://reactrouter.com/native/api/Hooks/usehistory
*/
export default function LinkWithPushHistory (props) {
  const { id, className, onClick, to, childMarkup } = props;
  // const history = useHistory();

  // function handleClick () {
  //   history.push(to);
  // }

  // see https://reactrouter.com/web/api/Link
  // Dec 2020: There are more params to <Link that we don't use and have not been implemented
  return (
    <Link id={id} className={className} to={to} onClick={onClick}>
      {childMarkup}
    </Link>

  );
}
LinkWithPushHistory.propTypes = {
  id: PropTypes.string,
  className: PropTypes.object,
  onClick: PropTypes.object,
  to: PropTypes.object.isRequired,
  childMarkup: PropTypes.object,
};
