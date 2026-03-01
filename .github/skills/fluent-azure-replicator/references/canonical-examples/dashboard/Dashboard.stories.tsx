import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from './index';

const meta: Meta<typeof Dashboard> = {
  title: 'Azure/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Dashboard>;

export const Light: Story = {};

export const Dark: Story = {
  args: { darkMode: true },
};
