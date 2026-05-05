import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { RefObject } from 'react'

interface AccountTabProps {
  user: any
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  onSubmit: (data: any) => Promise<void>
  isUpdating: boolean
  isUploading: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function AccountTab({
  user,
  register,
  errors,
  onSubmit,
  isUpdating,
  isUploading,
  fileInputRef,
  onFileChange,
}: AccountTabProps) {
  return (
    <Flex direction="column" gap="4">
      <Card variant="surface">
        <Flex justify="between" align="center" wrap="wrap" gap="3">
          <Flex gap="4" align="center">
            <Avatar
              size="6"
              src={user?.image}
              radius="full"
              fallback={user?.name?.charAt(0) || 'T'}
            />
            <Box>
              <Text as="div" size="3" weight="bold">
                រូបភាពកម្រងព័ត៌មាន
              </Text>
              <Text as="div" size="2" color="gray">
                JPG, PNG, WEBP ទំហំអតិបរមា 2MB
              </Text>
            </Box>
          </Flex>
          <Flex gap="2">
            <Button
              variant="soft"
              color="blue"
              onClick={() => fileInputRef.current?.click()}
              loading={isUploading}
              style={{ cursor: 'pointer' }}
            >
              ប្តូររូបភាព
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/jpeg, image/png, image/webp"
              style={{ display: 'none' }}
            />
          </Flex>
        </Flex>
      </Card>

      <Box>
        <form onSubmit={onSubmit}>
          <Text size="4" weight="bold">
            ព័ត៌មានផ្ទាល់ខ្លួន
          </Text>
          <Separator size="4" my="3" />
          <Flex gap="4" direction={{ initial: 'column', sm: 'row' }} mb="4">
            <Box className="grow">
              <Text as="div" size="2" mb="1" weight="bold">
                ឈ្មោះ <span className="text-red-500">*</span>
              </Text>
              <TextField.Root
                {...register('name', { required: 'សូមបញ្ចូលឈ្មោះ' })}
                placeholder="បញ្ចូលឈ្មោះ"
              />
              {errors.name && (
                <Text size="1" color="red">
                  {errors.name.message as string}
                </Text>
              )}
            </Box>
            <Box className="grow">
              <Text as="div" size="2" mb="1" weight="bold">
                អ៊ីមែល
              </Text>
              <TextField.Root
                type="email"
                {...register('email')}
                disabled
                placeholder="example@mail.com"
              />
            </Box>
          </Flex>
          <Button
            type="submit"
            loading={isUpdating}
            size="2"
            style={{ cursor: 'pointer' }}
          >
            រក្សាទុកការផ្លាស់ប្តូរ
          </Button>
        </form>
      </Box>
    </Flex>
  )
}
