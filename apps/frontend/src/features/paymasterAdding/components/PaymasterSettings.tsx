import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  Accordion,
  Button,
  DynamicInput,
  Icon,
  IconButton,
  Line,
  TinySelect,
  Typography,
} from '@/components';
import { blockchainsOptions } from '@/utils/constans';
import { GeneralAccordion } from './GeneralAccordion';
import Style from './PaymasterSettings.module.css';
import { PaymasterTitle } from './PaymasterTitle';
import { WhitelistedAddressesAccordion } from './WhitelistedAddressesAccordion';
import {
  POLICY_RULE_METRIC,
  POLICY_RULE_COMPARATOR,
  POLICY_RULE_SCOPE,
  POLICY_RULE_INTERVAL,
} from '../../../../../../packages/constants/src/policy-rule';
import { createPolicy } from '../utils/fetches';

const comparatorOptions = Object.values(POLICY_RULE_COMPARATOR).map((comparator) => {
  let symbol = '';
  switch (comparator.id) {
    case 'LTE':
      symbol = '<=';
      break;
    case 'GTE':
      symbol = '>=';
      break;
    case 'EQ':
      symbol = '=';
      break;
    case 'LT':
      symbol = '<';
      break;
    case 'GT':
      symbol = '>';
      break;
  }
  return {
    label: symbol,
    value: comparator.id,
  };
});

const metricOptions = Object.values(POLICY_RULE_METRIC).map((metric) => ({
  label: metric.name,
  value: metric.id,
}));

const intervalOptions = Object.values(POLICY_RULE_INTERVAL).map((interval) => ({
  label: interval.name,
  value: interval.id,
}));

const scopeOptions = Object.values(POLICY_RULE_SCOPE).map((scope) => ({
  label: scope.name,
  value: scope.id,
}));

const metricValues = Object.values(POLICY_RULE_METRIC).map((m) => m.id);
const scopeValues = Object.values(POLICY_RULE_SCOPE).map((m) => m.id);
const intervalValues = Object.values(POLICY_RULE_INTERVAL).map((m) => m.id);
const comparatorValues = Object.values(POLICY_RULE_COMPARATOR).map((m) => m.id);

const ruleSchema = z
  .object({
    comparator: z.enum(comparatorValues as [string, ...string[]]),
    interval: z.enum(intervalValues as [string, ...string[]]),
    scope: z.enum(scopeValues as [string, ...string[]]),
    metric: z.enum(metricValues as [string, ...string[]]),
    amount: z.coerce.number().min(0.00000001, 'Must be greater than 0'),
  })
  .optional();

const formSchema = z.object({
  name: z.string(),
  max_budget_wei: z.coerce
    .number()
    .min(1, 'Must be greater than 0')
    .refine((val) => !isNaN(val), { message: 'This field is required' }),
  chain_id: z.number(),
  is_public: z.boolean(),
  status_id: z.string(),
  valid_from: z.date(),
  valid_to: z.date(),
  // policyDoesNotExpire: z.boolean(),
  whitelisted_addresses: z.boolean(),
  paymaster_address: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^0x[a-fA-F0-9]{40}$/.test(val), {
      message: 'Invalid Ethereum address',
    }),
  // manualAddress: z
  //   .string()
  //   .trim()
  //   .optional()
  //   .refine((val) => !val || /^0x[a-fA-F0-9]{40}$/.test(val), {
  //     message: 'Invalid Ethereum address',
  //   }),
  rules: z.array(ruleSchema),
});

type TFormData = z.infer<typeof formSchema>;

export const PaymasterSettings = () => {
  const [entries, setEntries] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'Spending Policy',
      max_budget_wei: 0,
      chain_id: blockchainsOptions[0].value,
      is_public: true,
      status_id: 'ACTIVE',
      // policyDoesNotExpire: true,
      paymaster_address: '0x1234567890123456789012345678901234567890',
      valid_from: new Date(),
      valid_to: new Date(),
      whitelisted_addresses: true,
      // manualAddress: '',
      rules: [
        {
          comparator: undefined,
          interval: undefined,
          scope: undefined,
          metric: undefined,
          amount: 0,
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules',
  });
  const manualAddress = watch('manualAddress');
  let _isValidAddress;
  if (manualAddress) {
    _isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(manualAddress);
  }

  const handleAddAddress = () => {
    if (/^0x[a-fA-F0-9]{40}$/.test(manualAddress)) {
      setEntries((prev) => [...prev, manualAddress]);
      setValue('manualAddress', '');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split(/\r?\n/).filter(Boolean);
      setEntries((prev) => [...prev, ...rows]);
    };
    reader.readAsText(file);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      whitelisted_addresses: [...entries],
    };

    try {
      const _response = createPolicy(payload);
      toast.success('Policy added successfully');
      navigate('/paymaster');
    } catch (err: unknown) {
      toast.error(err?.toString());
    }
  };

  return (
    <section className={Style['settings-panel']}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <PaymasterTitle value={field.value} onChange={field.onChange} />}
        />
        <Line />
        <GeneralAccordion control={control} errors={errors} />
        <Line />
        <WhitelistedAddressesAccordion
          entries={entries}
          errors={errors}
          register={register}
          control={control}
          setEntries={setEntries}
          handleFileUpload={handleFileUpload}
          removeEntry={removeEntry}
          setValue={setValue}
          // manualAddress={manualAddress}
          handleAddAddress={handleAddAddress}
          // isValidAddress={isValidAddress}
        />
        <Line />
        <Accordion title="User Spending Rules">
          {/* {fields.map((field, index) => (
            <div key={field.id}>
            <div  className={Style['user-rule-row']}>
              <Controller
                name={`rules.${index}.metric`}
                control={control}
                render={({ field }) => (
                  <TinySelect
                    {...field}
                    options={metricOptions}
                    value={metricOptions.find((o) => o.value === field.value)}
                    change={field.onChange}
                    withArrow
                    error={errors.rules?.[index]?.metric?.message}
                  />
                )}
              />
              <Controller
                name={`rules.${index}.scope`}
                control={control}
                render={({ field }) => (
                  <TinySelect
                    {...field}
                    options={scopeOptions}
                    value={scopeOptions.find((o) => o.value === field.value)}
                    change={field.onChange}
                    withArrow
                    error={errors.rules?.[index]?.scope?.message}
                  />
                )}
              />
              <Typography text="per" tag="p" size="xs" weight="regular" />
              <Controller
                name={`rules.${index}.interval`}
                control={control}
                render={({ field }) => (
                  <TinySelect
                    {...field}
                    options={intervalOptions}
                    value={intervalOptions.find((o) => o.value === field.value)}
                    change={field.onChange}
                    withArrow
                    error={errors.rules?.[index]?.interval?.message}
                  />
                )}
              />
              <Controller
                name={`rules.${index}.comparator`}
                control={control}
                render={({ field }) => (
                  <TinySelect
                    {...field}
                    options={comparatorOptions}
                    value={comparatorOptions.find((o) => o.value === field.value)}
                    change={field.onChange}
                    withArrow
                    error={errors.rules?.[index]?.comparator?.message}
                  />
                )}
              />
              <Controller
                name={`rules.${index}.amount`}
                control={control}
                render={({ field }) => (
                  <DynamicInput
                    {...field}
                    placeholder="0"
                    min={0}
                    step={1}
                    maxLength={9}
                    className={Style['amount-input']}
                    prefix="$"
                    size="small"
                    error={errors.rules?.[index]?.amount?.message}
                  />
                )}
              />
              <IconButton
                icon={<Icon name="exit" width="16" height="16" color="gray400" />}
                onClick={() => remove(index)}
              />
            </div>
            </div>
          ))} */}
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className={Style['user-rule-row']}>
                <Controller
                  name={`rules.${index}.metric`}
                  control={control}
                  render={({ field }) => (
                    <TinySelect
                      {...field}
                      options={metricOptions}
                      value={metricOptions.find((o) => o.value === field.value)}
                      change={field.onChange}
                      withArrow
                    />
                  )}
                />
                <Controller
                  name={`rules.${index}.scope`}
                  control={control}
                  render={({ field }) => (
                    <TinySelect
                      {...field}
                      options={scopeOptions}
                      value={scopeOptions.find((o) => o.value === field.value)}
                      change={field.onChange}
                      withArrow
                    />
                  )}
                />
                <Typography text="per" tag="p" size="xs" weight="regular" />
                <Controller
                  name={`rules.${index}.interval`}
                  control={control}
                  render={({ field }) => (
                    <TinySelect
                      {...field}
                      options={intervalOptions}
                      value={intervalOptions.find((o) => o.value === field.value)}
                      change={field.onChange}
                      withArrow
                    />
                  )}
                />
                <Controller
                  name={`rules.${index}.comparator`}
                  control={control}
                  render={({ field }) => (
                    <TinySelect
                      {...field}
                      options={comparatorOptions}
                      value={comparatorOptions.find((o) => o.value === field.value)}
                      change={field.onChange}
                      withArrow
                    />
                  )}
                />
                <Controller
                  name={`rules.${index}.amount`}
                  control={control}
                  render={({ field }) => (
                    <DynamicInput
                      {...field}
                      placeholder="0"
                      min={0}
                      step={1}
                      maxLength={9}
                      className={Style['amount-input']}
                      prefix="$"
                      size="small"
                    />
                  )}
                />
                <IconButton
                  icon={<Icon name="exit" width="16" height="16" color="gray400" />}
                  onClick={() => remove(index)}
                />
              </div>
              {errors.rules?.[index] && (
                <div className="mb24">
                  {errors.rules[index].metric && (
                    <Typography
                      tag="p"
                      color="red500"
                      weight="regular"
                      style="italic"
                      text="Metric - this field is required"
                      size="xs"
                    />
                  )}
                  {errors.rules[index].scope && (
                    <Typography
                      tag="p"
                      color="red500"
                      weight="regular"
                      style="italic"
                      text="Scope - this field is required"
                      size="xs"
                    />
                  )}
                  {errors.rules[index].interval && (
                    <Typography
                      tag="p"
                      color="red500"
                      weight="regular"
                      style="italic"
                      text="Interval - this field is required"
                      size="xs"
                    />
                  )}
                  {errors.rules[index].comparator && (
                    <Typography
                      tag="p"
                      color="red500"
                      weight="regular"
                      style="italic"
                      text="Comparator - this field is required"
                      size="xs"
                    />
                  )}
                  {errors.rules[index].amount && (
                    <Typography
                      tag="p"
                      color="red500"
                      weight="regular"
                      style="italic"
                      text={errors.rules[index].amount.message || `Amount - this field is required`}
                      size="xs"
                    />
                  )}
                </div>
              )}
            </div>
          ))}

          <Button
            onClick={() =>
              append({
                comparator: comparatorOptions[0],
                interval: intervalOptions[0],
                scope: scopeOptions[0],
                metric: metricOptions[0],
                amount: 0,
              })
            }
            variant="outline"
            className="mt8"
            color="primary500"
            size="xsmall"
          >
            <Icon name="plus" width="14" height="14" />
            Add Rule
          </Button>
        </Accordion>
        <Button fullWidth color="green500" size="medium" type="submit" className="mt32">
          Save & Create Policy
        </Button>
      </form>
    </section>
  );
};
