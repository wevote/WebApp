import React from 'react';
import styled from 'styled-components';
import Button from '../../components/Buttons/BaseButton';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Example/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
  args: {
    primary: true,
  },
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const AllButtons = (args) => (
  <ButtonContainer>
    <Button {...Primary.args} primary size="large" label="Primary Large Disabled Button" aria-label="Primary Large Disabled Button" />
    <Button {...Primary.args} primary={false} size="large" label="PrimaryLarge Disabled Button" aria-label="PrimaryLarge Disabled Button" />
    <Button {...Primary.args} primary label="Primary Medium Button" aria-label="Primary Medium Button" />
    <Button {...PrimaryDisabled.args} primary={false} label="Primary Medium Disabled Button" aria-label="Primary Medium Disabled Button" />
    <Button {...Primary.args} primary size="small" label="Primary Small Button" aria-label="Primary Small Button" />
    <Button {...PrimaryDisabled.args} primary={false} size="small" label="Primary Small Disabled" aria-label="Primary Small Disabled" />
    <Button {...Secondary.args} secondary label="Secondary Button" aria-label="Secondary Button" />
  </ButtonContainer>
);

export const PrimaryDisabled = {
  args: {
    primary: false,
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    secondary: true,
    label: 'Button',
  },
};

export const Large = {
  args: {
    primary: true,
    size: 'large',
    label: 'Button',
  },
};

export const Medium = {
  args: {
    primary: true,
    size: 'medium',
    label: 'Button',
  },
};

export const Small = {
  args: {
    primary: true,
    size: 'small',
    label: 'Button',
  },
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 34px;
  flex-direction: column;
`;
