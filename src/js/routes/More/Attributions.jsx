import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { renderLog } from '../../utils/logging';

const attributions = React.lazy(() => import('../../attributions'));
const compileDate = React.lazy(() => import('../../compileDate'));

export default class Attributions extends React.Component {
  static getProps () {
    return {};
  }

  static parseLicense (oneLicense) {
    const result = [];
    const lines = oneLicense.split('\n');
    for (let index = 0; index < lines.length; index++) {
      if (index === 0) {
        result.push(
          <div key={index}>
            <br />
            <b>{lines[index]}</b>
          </div>,
        );
      } else {
        result.push(
          <div key={index}>
            {lines[index]}
          </div>,
        );
      }
    }
    return result;
  }

  render () {
    renderLog('Attributions');  // Set LOG_RENDER_EVENTS to log all renders

    return (
      <div style={{ marginBottom: 30 }}>
        <Helmet title="Attributions - We Vote" />
        <div className="container-fluid well">
          <br />
          <h1 className="text-center">WeVote.US Open Source Software Licenses</h1>
          <div>
            Please also see
            {' '}
            <Link to="/more/credits">
              Credits & Thanks
            </Link>
            .
          </div>
          { attributions.map((oneLicense) => (
            Attributions.parseLicense(oneLicense)
          ))}
        </div>
        <div style={{ padding: '16px' }}>
          Compile date:&nbsp;&nbsp;
          { compileDate }
        </div>
      </div>
    );
  }
}

