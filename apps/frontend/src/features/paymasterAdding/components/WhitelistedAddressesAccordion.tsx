import React from 'react';
import {
  Controller,
  useWatch,
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

import {
  Accordion,
  Button,
  Checkbox,
  Icon,
  IconButton,
  Label,
  TextInput,
  Typography,
} from '@/components';

import Style from './WhitelistedAddressesAccordion.module.css';

interface IWhitelistFormValues {
  whitelistAllAddresses: boolean;
  manualAddress: string;
}

interface IWhitelistedAddressesAccordionProps {
  entries: string[];
  setEntries: React.Dispatch<React.SetStateAction<string[]>>;
  control: Control<IWhitelistFormValues>;
  register: UseFormRegister<IWhitelistFormValues>;
  errors: FieldErrors<IWhitelistFormValues>;
  setValue: UseFormSetValue<IWhitelistFormValues>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeEntry: (index: number) => void;
  handleAddAddress: () => void;
}

export const WhitelistedAddressesAccordion: React.FC<IWhitelistedAddressesAccordionProps> = ({
  entries,
  control,
  register,
  errors,
  handleFileUpload,
  removeEntry,
  handleAddAddress,
}) => {
  const manualAddress = useWatch({ control, name: 'manualAddress' });
  const isValidAddress = manualAddress && /^0x[a-fA-F0-9]{40}$/.test(manualAddress);

  return (
    <Accordion title="Whitelisted addresses">
      <div className={Style['whitelisted-addresses']}>
        <div className={Style['whitelisted-checkbox-container']}>
          <Label forInput="whitelistAllAddresses" text="Whitelist smart contracts" />
          <Controller
            name="whitelistAllAddresses"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                label="Apply to all addresses on the network"
              />
            )}
          />
        </div>
        <div className={Style['address-input-row']}>
          <TextInput
            {...register('manualAddress')}
            placeholder="Enter Address"
            size="large"
            fullWidth
            error={errors.manualAddress?.message}
          />
          <Button
            size="large"
            variant="outline"
            color="primary500"
            disabled={!isValidAddress}
            onClick={handleAddAddress}
          >
            <Icon name="plus" width="16" height="16" />
            Add
          </Button>
        </div>
        <IconButton
          icon={<Icon name="csvFile" width="16" height="16" />}
          onClick={() => document.getElementById('csv-input')?.click()}
        >
          <Typography
            tag="span"
            text="Import CSV"
            size="m"
            weight="medium"
            color="gray900"
            className="pl4"
          />
        </IconButton>
        <input
          id="csv-input"
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <div
          style={{
            marginTop: '12px',
            maxHeight: '200px',
            overflowY: 'auto',
            fontSize: '14px',
            padding: '0px 8px',
            borderRadius: '4px',
          }}
        >
          {entries.map((entry, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span>{entry}</span>
              <IconButton
                icon={<Icon name="exit" width="16" height="16" color="gray400" />}
                onClick={() => removeEntry(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </Accordion>
  );
};
