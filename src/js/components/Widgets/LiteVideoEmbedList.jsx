import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import 'lite-youtube-embed';
import 'lite-vimeo-embed';
import React, { useEffect, useState } from 'react';
import getVideoIds from '../../common/utils/getVideoIds';

// VoterAvatarBlock.propTypes = {
//   voterPhotoUrlMedium: PropTypes.string,
//   voterFirstName: PropTypes.string,
//   voterLastName: PropTypes.string,
// };

function LiteVideoEmbed ({ videoId, title, type, style }) {
  if (!videoId || videoId === '') {
    return null;
  }
  if (type === 'youtube') {
    return (
      <lite-youtube
        style={style}
        key={videoId}
        videoId={videoId}
        title={title}
        playlabel={title ? `Play ${title}` : 'Play Video'}
      />
    );
  }
  if (type === 'vimeo') {
    return (
      <lite-vimeo
        style={style}
        key={videoId}
        videoId={videoId}
        title={title}
        playlabel={title ? `Play ${title}` : 'Play Video'}
      />
    );
  }

  return null;
}

LiteVideoEmbed.propTypes = {
  videoId: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.object,
};

export default function LiteVideoEmbedList ({ text, delay = 500 }) {
  const [youtubeID, setYoutubeID] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setYoutubeID(getVideoIds(text));
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <OpinionVideoWrapper>
      {youtubeID.length > 0 &&
      youtubeID.map(({ type, id }) => (
        <LiteVideoEmbed
          style={{ width: '100%' }}
          videoId={id}
          key={`${type}${id}`}
          type={type}
        />
      ))}
    </OpinionVideoWrapper>
  );
}

LiteVideoEmbedList.propTypes = {
  text: PropTypes.string,
  delay: PropTypes.number,
};

const videoIn = keyframes`
  from { opacity: 0; transform: scale(.96); }
  to   { opacity: 1; transform: none; }
`;

const OpinionVideoWrapper = styled('div')`
  display: flex;
  gap: 5px;
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;

  & > * {
    scroll-snap-align: start;
    flex: 0 0 calc((100% - 5px) / 2);
    border-radius: 10px;
    animation: ${videoIn} 300ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }

  /* when several videos appear at once, the second follows just after the first */
  & > :nth-child(2) {
    animation-delay: 60ms;
  }
  & > :nth-child(3) {
    animation-delay: 120ms;
  }

  @media (prefers-reduced-motion: reduce) {
    & > * {
      animation: none;
    }
  }
`;

// Place in Common Components
