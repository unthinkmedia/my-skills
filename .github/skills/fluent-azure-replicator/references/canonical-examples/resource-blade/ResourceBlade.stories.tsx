import type { Meta, StoryObj } from '@storybook/react';
import { FluentProvider } from '@fluentui/react-components';
import { ResourceBlade } from './index';
import { azureDarkTheme } from './theme';

const meta: Meta<typeof ResourceBlade> = {
  title: 'Azure/ResourceBlade',
  component: ResourceBlade,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof ResourceBlade>;

export const Light: Story = {};

export const Dark: Story = {
  args: { darkMode: true },
};
