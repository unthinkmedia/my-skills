/**
 * Icon imports for the resource blade canonical example.
 * Named imports only — never `import *` from @fluentui/react-icons.
 * Re-export with semantic aliases for use in index.tsx.
 */
import {
  PlugConnectedRegular,
  PlayRegular,
  ArrowClockwiseRegular,
  StopRegular,
  DeleteRegular,
  ChevronRightRegular,
  ChevronLeftRegular,
  ServerRegular,
  CopyRegular,
} from '@fluentui/react-icons';

// Semantic aliases — index.tsx imports from ./icons
export {
  PlugConnectedRegular as ConnectIcon,
  PlayRegular as StartIcon,
  ArrowClockwiseRegular as RestartIcon,
  StopRegular as StopIcon,
  DeleteRegular as DeleteIcon,
  ChevronRightRegular as ChevronRightIcon,
  ChevronLeftRegular as ChevronLeftIcon,
  ServerRegular as ResourceIcon,
  CopyRegular as CopyIcon,
};
