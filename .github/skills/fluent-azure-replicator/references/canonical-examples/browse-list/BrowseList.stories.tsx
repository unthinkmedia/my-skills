import type { Meta, StoryObj } from '@storybook/react';
import { BrowseList } from './index';

const meta: Meta<typeof BrowseList> = {
  title: 'Azure/BrowseList',
  component: BrowseList,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof BrowseList>;

export const Light: Story = {};

export const Dark: Story = {
  args: { darkMode: true },
};
