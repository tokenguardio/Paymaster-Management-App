export type TDropdownOption = {
  label: string;
  value: string | number | boolean;
  type?: string;
  action?: (id: string) => void;
  logo?: string;
  icon?: string;
};
