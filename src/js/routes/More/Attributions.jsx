import React from 'react';
import Helmet from 'react-helmet';
import { renderLog } from '../../utils/logging';
import attributions from '../../attributions';

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
    renderLog(__filename);

    return (
      <div>
        <Helmet title="Attributions - We Vote" />
        <div className="container-fluid well">
          <br />
          <h1 className="text-center">WeVote.US Open Source Software Licenses</h1>
          { attributions.map(oneLicense => (
            Attributions.parseLicense(oneLicense)
          ))
          }
        </div>
      </div>
    );
  }
}

