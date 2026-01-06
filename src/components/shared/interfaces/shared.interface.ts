export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterState {
  [key: string]: string[];
}

export interface FilterDropdownProps {
  filterGroups: FilterGroup[];
  onApplyFilters: (filters: FilterState) => void;
  initialFilters: FilterState;
  buttonLabel?: string;
  buttonClassName?: string;
  contentClassName?: string;
}
