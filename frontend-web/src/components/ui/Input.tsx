import { Box, Text, TextField, Select } from '@radix-ui/themes'
import { Controller } from 'react-hook-form'

export const FormInput = ({
  label,
  name,
  placeholder,
  register,
  type = 'text',
  rules,
  error,
  isRequired = false,
  min,
  max,
}: any) => (
  <Box>
    <Text as="div" size="1" mb="1" weight="bold" className="text-slate-600">
      {label}
      <span
        className="text-red-500 ml-1"
        style={{ display: isRequired ? 'inline-block' : 'none' }}
      >
        *
      </span>
    </Text>
    <TextField.Root
      type={type}
      {...register(name, { valueAsNumber: type === 'number', ...rules })}
      placeholder={placeholder}
      className="rounded-lg"
      min={min}
      max={max}
    />
    {error && (
      <Text size="1" color="red">
        {error.message || 'សូមបញ្ចូលព័ត៌មាននេះ'}
      </Text>
    )}
  </Box>
)

export const FormSelect = ({
  label,
  name,
  control,
  options,
  placeholder,
  disabled,
  disabledOptions = [],
  labelKey = 'name',
  isRequired = false,
  rules = { required: true },
  valueAsNumber = false,
  error,
}: any) => (
  <Box>
    <Text as="div" size="1" mb="1" weight="bold" className="text-slate-600">
      {label}
      <span
        className="text-red-500 ml-1"
        style={{ display: isRequired ? 'inline-block' : 'none' }}
      >
        *
      </span>
    </Text>

    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Select.Root
          disabled={disabled}
          value={field.value ? String(field.value) : undefined}
          onValueChange={(val) =>
            field.onChange(valueAsNumber ? Number(val) : val)
          }
        >
          <Select.Trigger
            placeholder={placeholder}
            className="w-full rounded-lg"
            style={{ width: '100%' }}
          />
          <Select.Content>
            {options.map((opt: any) => {
              const isOptionDisabled =
                disabledOptions.includes(String(opt.id)) &&
                String(field.value) !== String(opt.id)

              return (
                <Select.Item
                  key={opt.id}
                  value={String(opt.id)}
                  disabled={isOptionDisabled}
                >
                  {opt[labelKey]}
                </Select.Item>
              )
            })}
          </Select.Content>
        </Select.Root>
      )}
    />
    {error && (
      <Text size="1" color="red">
        {error.message || 'សូមជ្រើសរើសព័ត៌មាននេះ'}
      </Text>
    )}
  </Box>
)
