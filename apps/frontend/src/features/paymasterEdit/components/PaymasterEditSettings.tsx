import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { formatEther, parseEther } from 'ethers';
import React, { useState, useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
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
import { usePolicy } from '@/hooks/usePolicy';
import { usePolicyRules } from '@/hooks/usePolicyRules';
import { blockchainsOptions } from '@/utils/constans';
import { GeneralAccordion } from './GeneralAccordion';
import Style from './PaymasterEditSettings.module.css';
import { PaymasterTitle } from './PaymasterTitle';
import { WhitelistedAddressesAccordion } from './WhitelistedAddressesAccordion';
import {
  POLICY_RULE_METRIC,
  POLICY_RULE_COMPARATOR,
  POLICY_RULE_SCOPE,
  POLICY_RULE_INTERVAL,
} from '../../../../../../packages/constants/src/policy-rule';
import { editPolicy } from '../utils/fetches';

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
    id: z.union([z.string(), z.number()]).optional(),
    comparator: z.enum(comparatorValues as [string, ...string[]]),
    interval: z.enum(intervalValues as [string, ...string[]]),
    scope: z.enum(scopeValues as [string, ...string[]]),
    metric: z.enum(metricValues as [string, ...string[]]),
    amount: z.coerce.number().min(0.00000001, 'Must be greater than 0'),
  })
  .optional();

type TRule = z.infer<typeof ruleSchema>;

type TRuleUI = TRule & {
  newRule?: boolean;
};

type TFormDataUI = Omit<TFormData, 'rules'> & {
  rules: TRuleUI[];
};

const formSchema = z.object({
  name: z.string(),
  max_budget_wei: z
    .string()
    .trim()
    .nonempty('This field is required')
    .transform((val) => val.replace(',', '.'))
    .refine((val) => /^\d*\.?\d*$/.test(val), {
      message: 'Invalid number format',
    })
    .refine(
      (val) => {
        try {
          const wei = parseEther(val);
          return wei > BigInt(0);
        } catch {
          return false;
        }
      },
      { message: 'Must be greater than 0' },
    )
    .transform((val) => parseEther(val).toString()),
  chain_id: z.preprocess(
    (val) => (val == null ? '' : val),
    z.string().nonempty({ message: 'This field is required' }),
  ),
  is_public: z.boolean(),
  status_id: z.string(),
  valid_from: z.date(),
  valid_to: z.date().nullable(),
  whitelisted_addresses: z.boolean(),
  rules: z.array(ruleSchema),
});

type TFormData = z.infer<typeof formSchema>;

export const PaymasterEditSettings = () => {
  const { id } = useParams<{ id: string }>();
  const { policy } = usePolicy(id ?? '');
  const { policyRules } = usePolicyRules(id ?? '', 'active=true');
  const [manualWhitelistAddress, setManualWhitelistAddress] = useState<string>('');
  const [_errorMessage, setErrorMessage] = useState<string | null>(null);
  const [_isSubmitting, setIsSubmitting] = useState(false);

  const [entries, setEntries] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'Spending Policy',
      max_budget_wei: '0',
      chain_id: blockchainsOptions[0].value,
      is_public: true,
      status_id: 'ACTIVE',
      valid_from: new Date(),
      valid_to: new Date(),
      whitelisted_addresses: true,
      rules: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules',
  });

  useEffect(() => {
    if (policy) {
      reset((prevValues) => ({
        ...prevValues,
        name: policy.name ?? 'Spending Policy',
        max_budget_wei: formatEther(policy.max_budget_wei),
        chain_id: policy.chain_id ?? blockchainsOptions[0].value,
        is_public: policy.is_public ?? true,
        status_id: policy.status_id ?? 'ACTIVE',
        valid_from: policy.valid_from ? new Date(policy.valid_from) : new Date(),
        valid_to: policy.valid_to ? new Date(policy.valid_to) : null,
        whitelisted_addresses:
          policy.whitelisted_addresses && policy.whitelisted_addresses.length > 0 ? true : false,
      }));

      if (policy.whitelisted_addresses?.length) {
        setEntries(policy.whitelisted_addresses);
      }
    }

    if (policyRules) {
      reset((prevValues) => ({
        ...prevValues,
        rules:
          policyRules.map((rule: TRule) => ({
            id: rule?.id || null,
            comparator: rule.comparator?.id,
            interval: rule.interval?.id,
            scope: rule.scope?.id,
            metric: rule.metric?.id,
            amount: rule.value ?? 0,
          })) ?? [],
      }));
    }
  }, [policy, policyRules, reset]);

  const handleAddAddress = () => {
    if (/^0x[a-fA-F0-9]{40}$/.test(manualWhitelistAddress)) {
      setEntries((prev) => [...prev, manualWhitelistAddress]);
      setManualWhitelistAddress('');
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

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      whitelisted_addresses: [...entries],
    };
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await editPolicy(id, payload);
      toast.success('Policy added successfully');
      navigate('/paymaster');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'An error occurred while sending the data.';
        setErrorMessage(backendMessage);
      } else {
        setErrorMessage('Unexpected error — please try again later.');
      }
    } finally {
      setIsSubmitting(false);
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
        <GeneralAccordion control={control} errors={errors} setValue={setValue} />
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
          manualWhitelistAddress={manualWhitelistAddress}
          setManualWhitelistAddress={setManualWhitelistAddress}
          handleAddAddress={handleAddAddress}
        />
        <Line />
        <Accordion defaultOpen title="User Spending Rules">
          {fields.map((field: TRuleUI, index) => {
            const disabled = !field?.newRule;

            return (
              <div key={field.id}>
                <div className={Style['user-rule-row']}>
                  <Controller
                    name={`rules.${index}.interval`}
                    control={control}
                    render={({ field }) => (
                      <TinySelect
                        {...field}
                        options={intervalOptions}
                        value={intervalOptions.find((o) => o.value === field.value)}
                        change={field.onChange}
                        disabled={disabled}
                        withArrow
                      />
                    )}
                  />
                  <Controller
                    name={`rules.${index}.metric`}
                    control={control}
                    render={({ field }) => (
                      <TinySelect
                        {...field}
                        options={metricOptions}
                        value={metricOptions.find((o) => o.value === field.value)}
                        change={field.onChange}
                        disabled={disabled}
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
                        disabled={disabled}
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
                        disabled={disabled}
                        withArrow
                      />
                    )}
                  />
                  <div className={Style['end-row-container']}>
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
                          disabled={disabled}
                          size="small"
                        />
                      )}
                    />
                    <IconButton
                      icon={<Icon name="exit" width="16" height="16" color="gray400" />}
                      onClick={() => remove(index)}
                    />
                  </div>
                </div>
                {errors.rules?.[index] && (
                  <div className="mb24">
                    {errors.rules[index].metric && (
                      <Typography
                        tag="p"
                        color="gray400"
                        weight="regular"
                        style="italic"
                        text="Metric - this field is required"
                        size="xs"
                      />
                    )}
                    {errors.rules[index].scope && (
                      <Typography
                        tag="p"
                        color="gray400"
                        weight="regular"
                        style="italic"
                        text="Scope - this field is required"
                        size="xs"
                      />
                    )}
                    {errors.rules[index].interval && (
                      <Typography
                        tag="p"
                        color="gray400"
                        weight="regular"
                        style="italic"
                        text="Interval - this field is required"
                        size="xs"
                      />
                    )}
                    {errors.rules[index].comparator && (
                      <Typography
                        tag="p"
                        color="gray400"
                        weight="regular"
                        style="italic"
                        text="Comparator - this field is required"
                        size="xs"
                      />
                    )}
                    {errors.rules[index].amount && (
                      <Typography
                        tag="p"
                        color="gray400"
                        weight="regular"
                        style="italic"
                        text={
                          errors.rules[index].amount.message || `Amount - this field is required`
                        }
                        size="xs"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <Button
            onClick={() =>
              append({
                comparator: comparatorOptions[0],
                interval: intervalOptions[0],
                scope: scopeOptions[0],
                metric: metricOptions[0],
                amount: 0,
                newRule: true,
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
