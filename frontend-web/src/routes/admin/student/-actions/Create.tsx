import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStudent } from '@/api/StudentAPI'
import { Button, Dialog, Flex, Text, TextField, Select, Grid } from '@radix-ui/themes'
import toast from 'react-hot-toast'
import type { StudentsType } from '@/types'

const StudentCreate = () => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { register, handleSubmit, control, reset } = useForm<StudentsType>()

    const mutation = useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
            toast.success('ចុះឈ្មោះនិស្សិតជោគជ័យ')
            setOpen(false)
            reset()
        }
    })

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <Button color="blue" style={{ cursor: 'pointer' }}>បន្ថែមនិស្សិត</Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="600px">
                <Dialog.Title>ចុះឈ្មោះនិស្សិតថ្មី</Dialog.Title>

                <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
                    <Grid columns="2" gap="3">
                        {/* ឈ្មោះ */}
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ឈ្មោះពេញ</Text>
                            <TextField.Root {...register('name', { required: true })} placeholder="ឈ្មោះនិស្សិត" />
                        </label>

                        {/* ភេទ */}
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ភេទ</Text>
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field }) => (
                                    <Select.Root onValueChange={field.onChange} value={field.value}>
                                        <Select.Trigger placeholder="ជ្រើសរើសភេទ" className="w-full" />
                                        <Select.Content>
                                            <Select.Item value="ប្រុស">ប្រុស</Select.Item>
                                            <Select.Item value="ស្រី">ស្រី</Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                )}
                            />
                        </label>

                        {/* ថ្ងៃខែឆ្នាំកំណើត */}
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ថ្ងៃខែឆ្នាំកំណើត</Text>
                            <TextField.Root type="date" {...register('dob')} />
                        </label>

                        {/* លេខទូរស័ព្ទ */}
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">លេខទូរស័ព្ទ</Text>
                            <TextField.Root {...register('phone')} placeholder="012345678" />
                        </label>

                        {/* អ៊ីមែល */}
                        <label className="col-span-2">
                            <Text as="div" size="2" mb="1" weight="bold">អ៊ីមែល</Text>
                            <TextField.Root type="email" {...register('email')} placeholder="example@gmail.com" />
                        </label>

                        {/* ស្ថានភាព */}
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ស្ថានភាព</Text>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <Select.Root onValueChange={field.onChange} value={field.value}>
                                        <Select.Trigger placeholder="ជ្រើសរើសស្ថានភាព" />
                                        <Select.Content>
                                            <Select.Item value="សកម្ម">សកម្ម</Select.Item>
                                            <Select.Item value="អសកម្ម">អសកម្ម</Select.Item>
                                            <Select.Item value="សម្រាក">សម្រាក</Select.Item>
                                            <Select.Item value="បោះបង់">បោះបង់</Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                )}
                            />
                        </label>
                    </Grid>

                    <Flex gap="3" mt="5" justify="end">
                        <Dialog.Close><Button variant="soft" color="gray">បោះបង់</Button></Dialog.Close>
                        <Button type="submit">រក្សាទុក</Button>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default StudentCreate