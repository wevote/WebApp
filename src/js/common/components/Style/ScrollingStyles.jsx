import styled from 'styled-components';

export const HorizontallyScrollingContainer = styled('div')`
  /* Fade out, right side */
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 98%, rgba(0, 0, 0, 0));
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 98%, rgba(0, 0, 0, 0));

  overflow-x: auto;
  white-space: nowrap;

  /* Make the scrollbar not be visible */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  ::-webkit-scrollbar {  /* Chrome, Safari and Opera */
    display: none;
  }
`;

export const ScrollingInnerWrapper = styled('div')`
  overflow-x: hidden;
  overflow-y: hidden;
`;

export const ScrollingOuterWrapper = styled('div')`
  height: 100%;
  min-width: 0;
  width: 100%;
`;
