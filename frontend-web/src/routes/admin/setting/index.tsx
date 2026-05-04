import { useTitle } from '@/hooks/useTitle'
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Select,
  Separator,
  Switch,
  Tabs,
  Text,
  TextField,
} from '@radix-ui/themes'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/stores/auth'
import { useForm } from 'react-hook-form'
import { authClient } from '@/lib/auth-client'
import toast from 'react-hot-toast'
import { useEffect, useState, useRef } from 'react'
import api from '@/lib/axios'

export const Route = createFileRoute('/admin/setting/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('ការកំណត់ (Settings)')
  const { user } = useAuth()

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  })

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email,
      })
    }
  }, [user, resetProfile])

  const onSubmitProfile = async (data: any) => {
    setIsUpdatingProfile(true)
    try {
      const { error } = await authClient.updateUser({
        name: data.name,
      })
      if (error) {
        toast.error(error.message || 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាព')
      } else {
        toast.success('ធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ')
      }
    } catch (e: any) {
      toast.error('មានបញ្ហាក្នុងការធ្វើបច្ចុប្បន្នភាព')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('ទំហំរូបភាពត្រូវតែតូចជាង 2MB')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setIsUploadingImage(true)
    try {
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.data?.success) {
        let url = res.data.data.url
        const baseUrl = import.meta.env.VITE_API_BASE_URL
        if (baseUrl) {
          url = baseUrl.replace('/api', '') + url
        }

        const { error } = await authClient.updateUser({ image: url })
        if (error) {
          toast.error(error.message || 'បរាជ័យក្នុងការប្តូររូបភាព')
        } else {
          toast.success('ប្តូររូបភាពបានជោគជ័យ')
        }
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'មានបញ្ហាក្នុងការ Upload រូបភាព',
      )
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Password Form
  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    reset: resetPwd,
    formState: { errors: pwdErrors },
    watch,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const [isUpdatingPwd, setIsUpdatingPwd] = useState(false)
  const newPassword = watch('newPassword')

  const onSubmitPwd = async (data: any) => {
    setIsUpdatingPwd(true)
    try {
      const { error } = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: true,
      })
      if (error) {
        toast.error(error.message || 'បរាជ័យក្នុងការប្តូរលេខសម្ងាត់')
      } else {
        toast.success('ប្តូរលេខសម្ងាត់បានជោគជ័យ')
        resetPwd()
      }
    } catch (e: any) {
      toast.error('មានបញ្ហាក្នុងការប្តូរលេខសម្ងាត់')
    } finally {
      setIsUpdatingPwd(false)
    }
  }

  return (
    <Card size="3">
      {/* Header Section */}
      <Flex justify="between" align="center" mb="5">
        <Box>
          <Text as="div" size="6" weight="bold">
            ការកំណត់ (Settings)
          </Text>
          <Text as="div" size="2" color="gray">
            គ្រប់គ្រងគណនី និងការកំណត់ប្រព័ន្ធរបស់អ្នកនៅទីនេះ
          </Text>
        </Box>
      </Flex>

      <Tabs.Root defaultValue="account">
        <Tabs.List size="2">
          <Tabs.Trigger value="account">គណនី (Account)</Tabs.Trigger>
          <Tabs.Trigger value="security">សុវត្ថិភាព (Security)</Tabs.Trigger>
          {(user as any)?.role === 'manager' && (
            <Tabs.Trigger value="backup">ការចម្លងទុក (Backup)</Tabs.Trigger>
          )}
        </Tabs.List>

        <Box pt="4">
          {/* --- TAB: ACCOUNT --- */}
          <Tabs.Content value="account">
            <Flex direction="column" gap="4">
              {/* Profile Picture Card */}
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
                      loading={isUploadingImage}
                      style={{ cursor: 'pointer' }}
                    >
                      ប្តូររូបភាព
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg, image/png, image/webp"
                      style={{ display: 'none' }}
                    />
                  </Flex>
                </Flex>
              </Card>

              {/* Personal Information */}
              <Box>
                <form onSubmit={handleProfileSubmit(onSubmitProfile)}>
                  <Text size="4" weight="bold">
                    ព័ត៌មានផ្ទាល់ខ្លួន
                  </Text>
                  <Separator size="4" my="3" />
                  <Flex
                    gap="4"
                    direction={{ initial: 'column', sm: 'row' }}
                    mb="4"
                  >
                    <Box className="grow">
                      <Text as="div" size="2" mb="1" weight="bold">
                        ឈ្មោះ <span className="text-red-500">*</span>
                      </Text>
                      <TextField.Root
                        {...registerProfile('name', {
                          required: 'សូមបញ្ចូលឈ្មោះ',
                        })}
                        placeholder="បញ្ចូលឈ្មោះ"
                      />
                      {profileErrors.name && (
                        <Text size="1" color="red">
                          {profileErrors.name.message as string}
                        </Text>
                      )}
                    </Box>
                    <Box className="grow">
                      <Text as="div" size="2" mb="1" weight="bold">
                        អ៊ីមែល
                      </Text>
                      <TextField.Root
                        type="email"
                        {...registerProfile('email')}
                        disabled
                        placeholder="example@mail.com"
                      />
                    </Box>
                  </Flex>
                  <Button
                    type="submit"
                    loading={isUpdatingProfile}
                    size="2"
                    style={{ cursor: 'pointer' }}
                  >
                    រក្សាទុកការផ្លាស់ប្តូរ
                  </Button>
                </form>
              </Box>
            </Flex>
          </Tabs.Content>

          {/* --- TAB: SECURITY --- */}
          <Tabs.Content value="security">
            <Flex direction="column" gap="4">
              <Text size="4" weight="bold">
                ប្តូរលេខសម្ងាត់
              </Text>
              <Separator size="4" my="1" />

              <Box maxWidth="400px">
                <form onSubmit={handlePwdSubmit(onSubmitPwd)}>
                  <Flex direction="column" gap="3">
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        លេខសម្ងាត់ចាស់ <span className="text-red-500">*</span>
                      </Text>
                      <TextField.Root
                        type="password"
                        {...registerPwd('currentPassword', {
                          required: 'សូមបញ្ចូលលេខសម្ងាត់ចាស់',
                        })}
                        placeholder="••••••••"
                      />
                      {pwdErrors.currentPassword && (
                        <Text size="1" color="red">
                          {pwdErrors.currentPassword.message as string}
                        </Text>
                      )}
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        លេខសម្ងាត់ថ្មី <span className="text-red-500">*</span>
                      </Text>
                      <TextField.Root
                        type="password"
                        {...registerPwd('newPassword', {
                          required: 'សូមបញ្ចូលលេខសម្ងាត់ថ្មី',
                          minLength: { value: 8, message: 'យ៉ាងតិច 8 ខ្ទង់' },
                        })}
                        placeholder="••••••••"
                      />
                      {pwdErrors.newPassword && (
                        <Text size="1" color="red">
                          {pwdErrors.newPassword.message as string}
                        </Text>
                      )}
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        បញ្ជាក់លេខសម្ងាត់ថ្មី{' '}
                        <span className="text-red-500">*</span>
                      </Text>
                      <TextField.Root
                        type="password"
                        {...registerPwd('confirmPassword', {
                          required: 'សូមបញ្ជាក់លេខសម្ងាត់ថ្មី',
                          validate: (val) =>
                            val === newPassword || 'លេខសម្ងាត់មិនត្រូវគ្នា',
                        })}
                        placeholder="••••••••"
                      />
                      {pwdErrors.confirmPassword && (
                        <Text size="1" color="red">
                          {pwdErrors.confirmPassword.message as string}
                        </Text>
                      )}
                    </Box>
                    <Button
                      type="submit"
                      mt="2"
                      loading={isUpdatingPwd}
                      variant="outline"
                      style={{ width: 'fit-content', cursor: 'pointer' }}
                    >
                      ធ្វើបច្ចុប្បន្នភាពលេខសម្ងាត់
                    </Button>
                  </Flex>
                </form>
              </Box>
            </Flex>
          </Tabs.Content>

          {/* --- TAB: BACKUP --- */}
          {(user as any)?.role === 'manager' && (
            <Tabs.Content value="backup">
              <Flex direction="column" gap="5">
                <Box>
                  <Text size="4" weight="bold">
                    ការចម្លងទុកទិន្នន័យ (Backup & Restore)
                  </Text>
                  <Text size="2" color="gray">
                    គ្រប់គ្រងសុវត្ថិភាពទិន្នន័យប្រព័ន្ធរបស់អ្នក
                  </Text>
                </Box>

                <Card variant="surface">
                  <Flex justify="between" align="center">
                    <Box>
                      <Text as="div" size="3" weight="bold">
                        Auto Backup
                      </Text>
                      <Text as="div" size="2" color="gray">
                        ដំណើរការការចម្លងទុកដោយស្វ័យប្រវត្តិទៅកាន់ Cloud Storage
                      </Text>
                    </Box>
                    <Switch defaultChecked size="3" color="green" />
                  </Flex>
                </Card>

                <Flex gap="4" direction={{ initial: 'column', sm: 'row' }}>
                  <Box className="grow">
                    <Text as="div" size="2" mb="1" weight="bold">
                      ភាពញឹកញាប់ (Frequency)
                    </Text>
                    <Select.Root defaultValue="daily">
                      <Select.Trigger className="w-full" />
                      <Select.Content>
                        <Select.Item value="hourly">រាល់ម៉ោង</Select.Item>
                        <Select.Item value="daily">រៀងរាល់ថ្ងៃ</Select.Item>
                        <Select.Item value="weekly">រៀងរាល់សប្តាហ៍</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>

                  <Box className="grow">
                    <Text as="div" size="2" mb="1" weight="bold">
                      រក្សាទុកក្នុងរយៈពេល (Retention)
                    </Text>
                    <Select.Root defaultValue="30">
                      <Select.Trigger className="w-full" />
                      <Select.Content>
                        <Select.Item value="7">៧ ថ្ងៃ</Select.Item>
                        <Select.Item value="30">៣០ ថ្ងៃ</Select.Item>
                        <Select.Item value="always">
                          រហូតដល់លុបដោយផ្ទាល់
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>
                </Flex>

                <Separator size="4" />

                <Box>
                  <Text size="3" weight="bold" mb="2" as="div">
                    សកម្មភាពបន្ទាប់បន្សំ
                  </Text>
                  <Flex gap="3">
                    <Button
                      variant="soft"
                      color="gray"
                      onClick={() => toast('មុខងារនេះនឹងមាននៅពេលក្រោយ')}
                    >
                      ទាញយក Database ឥឡូវនេះ (.sql)
                    </Button>
                    <Button
                      variant="soft"
                      color="orange"
                      onClick={() => toast('មុខងារនេះនឹងមាននៅពេលក្រោយ')}
                    >
                      ផ្ទេរទិន្នន័យទៅ Google Drive
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Tabs.Content>
          )}
        </Box>
      </Tabs.Root>
    </Card>
  )
}
