import React, { useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Button,
  Line,
  Icon,
  Accordion,
  Typography,
  IconButton,
  TinySelect,
  DynamicInput
} from '@/components'
import ethereumLogo from '@/assets/images/ethereum.svg'

import { GeneralAccordion } from './GeneralAccordion'
import { WhitelistedAddressesAccordion } from './WhitelistedAddressesAccordion'
import { PaymasterTitle } from './PaymasterTitle'

import Style from './PaymasterSettings.module.css'

const blockchainsOptions = [
  {
    value: 'ethereum',
    label: 'Ethereum',
    icon: ethereumLogo
  }
]

const typeOptions = [
  { value: 'max', label: 'Max' },
  { value: 'min', label: 'Min' }
]

const targetOptions = [
  { value: 'budget', label: 'Budget' },
  { value: 'value', label: 'Value' },
  { value: 'number', label: 'Number' }
]

const subjectOptions = [
  { value: 'UserOp', label: 'UserOp' },
  { value: 'Sender', label: 'Sender' },
  { value: 'Receiver', label: 'Receiver' }
]

const frequencyOptions = ['of', 'per']

const userRulesSchema = z.object({
  type: z.object({
    value: z.enum(['max', 'min']),
    label: z.string()
  }),
  target: z.object({
    value: z.enum(['budget', 'value', 'number']),
    label: z.string()
  }),
  frequency: z.enum(['of', 'per']),
  subject: z.object({
    value: z.enum(['UserOp', 'Sender', 'Receiver']),
    label: z.string()
  }),
  amount: z.coerce.number().min(0.00000001, 'Must be greater than 0')
})

const formSchema = z.object({
  max_budget: z.coerce.number()
    .min(1, 'Must be greater than 0')
    .refine(val => !isNaN(val), { message: 'This field is required' }),
  blockchain: z.object({
    value: z.string(),
    label: z.string(),
    icon: z.string().optional()
  }),
  payInERC20: z.boolean(),
  sponsorTransactions: z.boolean(),
  startDate: z.date(),
  endDate: z.date(),
  policyDoesNotExpire: z.boolean(),
  whitelistAllAddresses: z.boolean(),
  manualAddress: z
  .string()
  .trim()
  .optional()
  .refine(val => !val || /^0x[a-fA-F0-9]{40}$/.test(val), {
    message: 'Invalid Ethereum address',
  }),
  userRules: z.array(userRulesSchema)
})

type FormData = z.infer<typeof formSchema>

export const PaymasterSettings = () => {
  const [entries, setEntries] = useState<string[]>([])

  const {
    handleSubmit,
    control,
    setValue,
    register,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      max_budget: 0,
      blockchain: blockchainsOptions[0],
      payInERC20: true,
      sponsorTransactions: true,
      startDate: new Date(),
      endDate: new Date(),
      policyDoesNotExpire: true,
      whitelistAllAddresses: true,
      manualAddress: '',
      userRules: []
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'userRules'
  })
  const manualAddress = watch('manualAddress')
  let isValidAddress
  if (manualAddress) {
    isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(manualAddress)
  }

  const handleAddAddress = () => {
    if (/^0x[a-fA-F0-9]{40}$/.test(manualAddress)) {
      setEntries((prev) => [...prev, manualAddress])
      setValue('manualAddress', '') // czyści input po dodaniu
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const rows = text.split(/\r?\n/).filter(Boolean)
      setEntries(prev => [...prev, ...rows])
    }
    reader.readAsText(file)
  }

  const removeEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = (data: FormData) => {

    const payload = {
      ...data,
      whitelistedAddresses: [...entries]
    }
    console.log('Submitting form:', payload)
    // TODO: send this payload to API
  }

  return (
    <section className={Style['settings-panel']}>
      <PaymasterTitle />
      <Line />
      <form onSubmit={handleSubmit(onSubmit)}>
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
          {fields.map((field, index) => (
            <div key={field.id} className={Style['user-rule-row']}>
              <Controller
                name={`userRules.${index}.type`}
                control={control}
                render={({ field }) => (
                  <TinySelect
                    {...field}
                    options={typeOptions}
                    value={field.value}
                    change={(val) => field.onChange(val)}
                    withArrow
                  />
                )}
              />
              <Controller
                name={`userRules.${index}.target`}
                control={control}
                render={({ field }) => (
                  <TinySelect
                    {...field}
                    options={targetOptions}
                    value={field.value}
                    change={(val) => field.onChange(val)}
                    withArrow
                  />
                )}
              />
              <Typography text="per" tag="p" size="xs" weight="regular" />
              <Controller
                name={`userRules.${index}.subject`}
                control={control}
                render={({ field }) => (
                  <TinySelect
                    {...field}
                    options={subjectOptions}
                    value={field.value}
                    change={(val) => field.onChange(val)}
                    withArrow
                  />
                )}
              />
              <Typography text="=" tag="p" size="xs" weight="regular" />
              <Controller
                name={`userRules.${index}.amount`}
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
                    // error={errors.userRules?.[index]?.amount?.message}
                  />
                )}
              />
              <IconButton
                icon={<Icon name="exit" width="16" height="16" color="gray400" />}
                onClick={() => remove(index)}
              />
            </div>
          ))}
          <Button
            onClick={() =>
              append({
                type: typeOptions[0],
                target: targetOptions[0],
                frequency: frequencyOptions[0],
                subject: subjectOptions[0],
                amount: 0
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
        <Button
          fullWidth
          color="green500"
          size="medium"
          type="submit"
          className="mt32"
        >
          Save & Create Policy
        </Button>
      </form>
    </section>
  )
}
