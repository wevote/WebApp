import styled from 'styled-components';

export const HorizontallyScrollingContainer = styled('div')`
  /* Fade out, right side */
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));

  overflow-x: auto;
  white-space: nowrap;

  /* Make the scrollbar not be visible */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  ::-webkit-scrollbar {  /* Chrome, Safari and Opera */
    display: none;
  }
`;

export const RightArrowInnerWrapper = styled('div')`
  // opacity: 0;
  transition: opacity 200ms ease-in 0s;
`;

export const RightArrowOuterWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  min-height: 330px;
  z-index: 9000;
`;

export const ScrollingInnerWrapper = styled('div')`
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
`;

export const ScrollingOuterWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  height: 100%;
  min-width: 0;
  width: 100%;
`;
