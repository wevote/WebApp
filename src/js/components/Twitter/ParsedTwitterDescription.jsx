import React from 'react';
import PropTypes from 'prop-types';

const ParsedTwitterDescription = (props) => {
  const parseTextForTwitterLinks = (text) => {
    const locations = [];
    const parsedLocations = [];

    // find all instances of twitter links within the passed text
    const findHttpsTCo = (fullText, start) => {
      let str = fullText.slice(start);
      const twitterFound = str.indexOf('https://t.co/');
      if (twitterFound >= 0) {
        str = str.slice(twitterFound);
        const spaceFound = str.indexOf(' ');
        if (spaceFound >= 0) {
          locations.push([start + twitterFound, start + twitterFound + spaceFound]);
          findHttpsTCo(fullText, start + twitterFound + spaceFound);
        } else {
          // if no space is found after twitterFound, assume the link is at the very end of fullText and use end of fullText as the endpoint
          locations.push([start + twitterFound, fullText.length]);
        }
      }
    };
    findHttpsTCo(text, 0);

    // use these locations of twitter links to make an array marking all areas of text versus links
    let gapPointer = 0;
    if (!locations.length) {
      parsedLocations.push({ type: 'text', location: [0, text.length]});
    } else {
      locations.forEach((location) => {
        if (location[0] !== gapPointer) {
          parsedLocations.push({ type: 'text', location: [gapPointer, location[0] - 1]});
        }
        parsedLocations.push({ type: 'link', location: [location[0], location[1]]});
        gapPointer = location[1] + 1;
      });
      if (locations[locations.length - 1][1] < text.length - 1) {
        parsedLocations.push({ type: 'text', location: [locations[locations.length - 1][1] + 1, text.length]});
      }
    }
    return parsedLocations;
  };

  const parsedTwitterDescription = parseTextForTwitterLinks(props.twitter_description);

  return (
    <span className="card-main__description">
      {
        parsedTwitterDescription.map((snippet, index) => (
          snippet.type === 'text' ? (
            <span
              key={snippet.toString() + index} // eslint-disable-line
            >
              {props.twitter_description.slice(snippet.location[0], snippet.location[1])}
              &nbsp;
            </span>
          ) : (
            <span key={snippet.toString() + index.toString()}>
              <a
                href={props.twitter_description.slice(snippet.location[0], snippet.location[1])}
                target={props.twitter_description.slice(snippet.location[0] + 8, snippet.location[1])}
              >
                {props.twitter_description.slice(snippet.location[0], snippet.location[1])}
              </a>
              &nbsp;
            </span>
          )))
      }
    </span>
  );
};

ParsedTwitterDescription.propTypes = {
  twitter_description: PropTypes.string,
};

export default ParsedTwitterDescription;
