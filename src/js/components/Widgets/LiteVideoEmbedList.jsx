import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
// import 'lite-youtube-embed';
// import 'lite-vimeo-embed';
import React, { useEffect, useState } from 'react';
import getVideoIds from '../../common/utils/getVideoIds';

function LiteVideoEmbed ({ videoId, title, type, style }) {
  if (!videoId || videoId === '') {
    return null;
  }
  // DALE 2026-11-21 Commenting out since this crashes the whole bundle
  // if (type === 'youtube') {
  //   return (
  //     <lite-youtube
  //       style={style}
  //       key={videoId}
  //       videoId={videoId}
  //       title={title}
  //       playlabel={title ? `Play ${title}` : 'Play Video'}
  //     />
  //   );
  // }
  // if (type === 'vimeo') {
  //   return (
  //     <lite-vimeo
  //       style={style}
  //       key={videoId}
  //       videoId={videoId}
  //       title={title}
  //       playlabel={title ? `Play ${title}` : 'Play Video'}
  //     />
  //   );
  // }

  return null;
}

LiteVideoEmbed.propTypes = {
  videoId: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.object,
};

export default function LiteVideoEmbedList ({ text, delay = 500 }) {
  const [LiteVimeoEmbed, setLiteVimeoEmbed] = useState(null);
  const [LiteYouTubeEmbed, setLiteYouTubeEmbed] = useState(null);
  const [youtubeID, setYoutubeID] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setYoutubeID(getVideoIds(text));
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  useEffect(() => {
    const loadLiteVimeoEmbed = async () => {
      try {
        // Dynamically import 'lite-vimeo-embed'
        const module = await import('lite-vimeo-embed');
        setLiteVimeoEmbed(() => module.default || module);
      } catch (error) {
        console.error('Error loading lite-vimeo-embed:', error);
        // Optionally, set an alternative or null state
        setLiteVimeoEmbed(null);
      }
    };

    loadLiteVimeoEmbed();
  }, []);

  useEffect(() => {
    const loadLiteYouTubeEmbed = async () => {
      try {
        // Dynamically import 'lite-vimeo-embed'
        const module = await import('lite-vimeo-embed');
        setLiteYouTubeEmbed(() => module.default || module);
      } catch (error) {
        console.error('Error loading lite-vimeo-embed:', error);
        // Optionally, set an alternative or null state
        setLiteYouTubeEmbed(null);
      }
    };

    loadLiteYouTubeEmbed();
  }, []);

  if (!LiteVimeoEmbed || !LiteYouTubeEmbed) {
    if (!LiteVimeoEmbed) {
      console.log('Problem loading LiteVimeoEmbed');
    }
    if (!LiteYouTubeEmbed) {
      console.log('Problem loading LiteYouTubeEmbed');
    }
    return <></>;
  }

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
