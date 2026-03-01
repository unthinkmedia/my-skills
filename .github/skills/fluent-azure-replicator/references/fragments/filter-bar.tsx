/**
 * Fragment: Filter Bar
 *
 * Horizontal row of search input + dropdown filters.
 * Sits between the command bar and content area on browse/list pages.
 */
import React from 'react';
import {
  Input,
  Dropdown,
  Option,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { SearchRegular } from '@fluentui/react-icons';

// --- Styles ---
const useStyles = makeStyles({
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  searchInput: {
    minWidth: '240px',
  },
  dropdown: {
    minWidth: '160px',
  },
});

// --- Types ---
interface FilterDropdown {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterDropdown[];
}

// --- Component ---
export const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = 'Filter by name...',
  searchValue = '',
  onSearchChange,
  filters = [],
}) => {
  const styles = useStyles();
  return (
    <div className={styles.filterBar}>
      <Input
        className={styles.searchInput}
        contentBefore={<SearchRegular />}
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(_, data) => onSearchChange?.(data.value)}
        aria-label="Filter resources"
      />
      {filters.map((filter) => (
        <Dropdown
          key={filter.label}
          className={styles.dropdown}
          placeholder={filter.label}
          aria-label={filter.label}
          onOptionSelect={(_, data) => filter.onChange?.(data.optionValue ?? '')}
        >
          {filter.options.map((opt) => (
            <Option key={opt} value={opt}>
              {opt}
            </Option>
          ))}
        </Dropdown>
      ))}
    </div>
  );
};
