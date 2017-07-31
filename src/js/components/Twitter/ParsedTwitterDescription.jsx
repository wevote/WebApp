import React from "react";
import PropTypes from "react-proptypes";

const ParsedTwitterDescription = (props) => {

  const parseTextForTwitterLinks = (twitter_description) => {
    let locations = [];
    let parsedLocations = [];

    // find all instances of twitter links within the passed text
    const findHttpsTCo = (text, start) => {
      let str = text.slice(start);
      let twitterFound = str.indexOf("https://t.co/");
      if (twitterFound >= 0) {
        str = str.slice(twitterFound);
        let spaceFound = str.indexOf(" ");
        if (spaceFound >= 0) {
          locations.push([start + twitterFound, start + twitterFound + spaceFound]);
          findHttpsTCo(text, start + twitterFound + spaceFound);
        } else {
          // if no space is found after twitterFound, assume the link is at the very end of text and use end of text as the endpoint
          locations.push([start + twitterFound, text.length]);
        }
      }
    };
    findHttpsTCo(twitter_description, 0);

    // use these locations of twitter links to make an array marking all areas of text versus links
    let gapPointer = 0;
    locations.forEach((location) => {
      if (location[0] !== gapPointer) {
        parsedLocations.push({type: "text", location: [gapPointer, location[0] - 1]});
      }
      parsedLocations.push({type: "link", location: [location[0], location[1]]});
      gapPointer = location[1] + 1;
    });
    if (locations[locations.length - 1][1] < text.length - 1) {
      parsedLocations.push({type: "text", location: [locations[locations.length - 1][1] + 1, text.length]});
    }
    return parsedLocations;
  };

  let parsedTwitterDescription = parseTextForTwitterLinks(props.twitter_description);

  return (
    <p className="card-main__description">
        {parsedTwitterDescription.map((snippet, i) => {
          snippet.type === "text" ?
            <span key={i}>&nbsp;{props.twitter_description.slice(snippet.location[0], snippet.location[1])}&nbsp;</span>
          : 
            <a
              key={i}
              href={props.twitter_description.slice(snippet.location[0], snippet.location[1])}
              target={props.twitter_description.slice(snippet.location[0] + 8, snippet.location[1])}
            >
              {props.twitter_description.slice(snippet.location[0], snippet.location[1])}
            </a>;
        })}
    </p>
  );
};

ParsedTwitterDescription.propTypes = {
  twitter_description: PropTypes.string,
};

export default ParsedTwitterDescription;
