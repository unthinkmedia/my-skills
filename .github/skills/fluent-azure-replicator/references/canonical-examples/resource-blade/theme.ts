import {
  createLightTheme,
  createDarkTheme,
  type BrandVariants,
  type Theme,
} from '@fluentui/react-components';

const azureBrand: BrandVariants = {
  10: '#020305',
  20: '#111723',
  30: '#16263D',
  40: '#193253',
  50: '#1B3F6A',
  60: '#1B4C82',
  70: '#18599B',
  80: '#0F6CBD',
  90: '#2B88D8',
  100: '#479EF5',
  110: '#62ABF5',
  120: '#77B7F7',
  130: '#96C6FA',
  140: '#B4D6FA',
  150: '#CFE4FA',
  160: '#EBF3FC',
};

export const azureLightTheme: Theme = {
  ...createLightTheme(azureBrand),
};

export const azureDarkTheme: Theme = {
  ...createDarkTheme(azureBrand),
};
