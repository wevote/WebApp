import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// The like / dislike pill next to a comment author: heart + count, a divider, then the
// dislike (slashed heart). The two glyphs are the exact SVGs the ballot page's
// HeartFavoriteToggle uses, so the reaction affordance matches the rest of the app.
function HeartIcon () {
  return (
    <svg width="20" height="21" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 3.32349C14.76 3.32349 13.09 4.13349 12 5.41349C10.91 4.13349 9.24 3.32349 7.5 3.32349C4.42 3.32349 2 5.74349 2 8.82349C2 12.6035 5.4 15.6835 10.55 20.3635L12 21.6735L13.45 20.3535C18.6 15.6835 22 12.6035 22 8.82349C22 5.74349 19.58 3.32349 16.5 3.32349ZM12.1 18.8735L12 18.9735L11.9 18.8735C7.14 14.5635 4 11.7135 4 8.82349C4 6.82349 5.5 5.32349 7.5 5.32349C9.04 5.32349 10.54 6.31349 11.07 7.68349H12.94C13.46 6.31349 14.96 5.32349 16.5 5.32349C18.5 5.32349 20 6.82349 20 8.82349C20 11.7135 16.86 14.5635 12.1 18.8735Z" fill={DesignTokenColors.neutralUI500} />
    </svg>
  );
}

function HeartDislikeIcon () {
  return (
    <svg width="20" height="21" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.80804 1.89148L21.193 20.2765L19.778 21.6905L16.032 17.9435L12 21.9835L3.52204 13.4915C2.53626 12.3859 1.99426 10.9548 2.00035 9.47365C2.00644 7.99246 2.5602 6.56587 3.55504 5.46848L1.39404 3.30648L2.80804 1.89148ZM4.98004 12.1215L12 19.1525L14.618 16.5295L4.97204 6.88448C4.34353 7.61252 3.99839 8.54266 3.99986 9.50447C4.00133 10.4663 4.34931 11.3954 4.98004 12.1215ZM20.243 5.25548C21.3264 6.33867 21.9544 7.79522 21.9982 9.32657C22.0421 10.8579 21.4986 12.348 20.479 13.4915L18.844 15.1275L17.43 13.7135L19.02 12.1215C19.6841 11.3533 20.0311 10.3614 19.9908 9.34684C19.9505 8.33226 19.5259 7.37099 18.8031 6.65792C18.0802 5.94486 17.1132 5.53339 16.0982 5.50693C15.0832 5.48048 14.0961 5.84103 13.337 6.51548L12.002 7.71348L10.666 6.51648C10.3255 6.21078 9.9348 5.96618 9.51104 5.79348L7.26104 3.54348C8.11121 3.43771 8.97417 3.51554 9.79169 3.77172C10.6092 4.02789 11.3623 4.45645 12 5.02848C13.1426 4.00568 14.6335 3.45935 16.1664 3.50175C17.6993 3.54416 19.1578 4.17208 20.242 5.25648" fill={DesignTokenColors.neutralUI500} />
    </svg>
  );
}

export default function CommentReactions ({ likeCount }) {
  return (
    <Pill>
      <ReactionButton type="button" aria-label="Like">
        <HeartIcon />
        <Count>{likeCount}</Count>
      </ReactionButton>
      <Divider />
      <ReactionButton type="button" aria-label="Dislike">
        <HeartDislikeIcon />
      </ReactionButton>
    </Pill>
  );
}
CommentReactions.propTypes = {
  likeCount: PropTypes.number,
};

const Count = styled.span`
  color: ${DesignTokenColors.neutral800};
  font-size: 15px;
`;

const Divider = styled.span`
  background: ${DesignTokenColors.neutralUI200};
  height: 18px;
  width: 1px;
`;

const Pill = styled.div`
  align-items: center;
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 9999px;
  display: inline-flex;
  gap: 8px;
  padding: 2px 10px;
`;

const ReactionButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  gap: 5px;
  padding: 2px 0;
`;
