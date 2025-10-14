import React from 'react';
import { Accordion, Label } from '@/components';
import Style from './PreviewWhitelistedAddressesAccordion.module.css';

interface IWhitelistFormValues {
  whitelistAllAddresses: boolean;
  manualAddress: string;
}

type TPreviewWhitelistedAddressesAccordionProps = {
  whiteListedAddresses: string[] | null;
};

export const PreviewWhitelistedAddressesAccordion = ({
  whiteListedAddresses,
}: TPreviewWhitelistedAddressesAccordionProps) => {
  return (
    <Accordion title="Whitelisted addresses">
      <div className={Style['whitelisted-addresses']}>
        <div className={Style['whitelisted-checkbox-container']}>
          <Label forInput="whitelistAllAddresses" text="Whitelist smart contracts" />
        </div>
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
          {whiteListedAddresses?.map((entry, index) => (
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
            </div>
          ))}
        </div>
      </div>
    </Accordion>
  );
};
