import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStudent } from '@/api/StudentAPI'
import { Button, Dialog, Flex, Text, TextField, Select, Grid, Box } from '@radix-ui/themes'
import toast from 'react-hot-toast'
import type { StudentsType } from '@/types'

const StudentCreate = () => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const { register, handleSubmit, control, reset } = useForm<StudentsType>({
        defaultValues: {
            isActive: true,
            gender: null,
            educationalStatus: null,
            facultyId: null,
            departmentId: null,
            academicLevelId: null,
            academicYearId: null,
            year: null,
            semester: null,
            generation: null,
            phone: null,
            email: null,
        }
    })

    const mutation = useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
            toast.success('ចុះឈ្មោះនិស្សិតជោគជ័យ')
            setOpen(false)
            reset()
        },
        onError: () => {
            toast.error('មានបញ្ហាក្នុងការចុះឈ្មោះ')
        }
    })

    const onSubmit = (data: StudentsType) => {
        const formattedData = {
            ...data,
            facultyId: data.facultyId || null,
            departmentId: data.departmentId || null,
            academicLevelId: data.academicLevelId || null,
            academicYearId: data.academicYearId || null,
            year: data.year || null,
            semester: data.semester || null,
            generation: data.generation || null,
        };
        mutation.mutate(formattedData)
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <Button color="blue" style={{ cursor: 'pointer' }}>បន្ថែមនិស្សិត</Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="800px">
                <Dialog.Title>ចុះឈ្មោះនិស្សិតថ្មី</Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid columns="3" gap="3">

                        <Box className="col-span-3">
                            <Text size="3" weight="bold" color="blue">ព័ត៌មានផ្ទាល់ខ្លួន</Text>
                            <Box className="h-px bg-gray-200 mt-1 mb-3" />
                        </Box>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ឈ្មោះពេញ <span className="text-red-500">*</span></Text>
                            <TextField.Root {...register('name', { required: true })} placeholder="ឈ្មោះនិស្សិត" />
                        </label>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ភេទ</Text>
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field }) => (
                                    <Select.Root onValueChange={field.onChange} value={field.value || ""}>
                                        <Select.Trigger placeholder="ជ្រើសរើសភេទ" className="w-full" />
                                        <Select.Content>
                                            <Select.Item value="ប្រុស">ប្រុស</Select.Item>
                                            <Select.Item value="ស្រី">ស្រី</Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                )}
                            />
                        </label>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">លេខទូរស័ព្ទ</Text>
                            <TextField.Root {...register('phone')} placeholder="012345678" />
                        </label>

                        <label className="col-span-2">
                            <Text as="div" size="2" mb="1" weight="bold">អ៊ីមែល</Text>
                            <TextField.Root type="email" {...register('email')} placeholder="example@gmail.com" />
                        </label>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ជំនាន់</Text>
                            <TextField.Root type="number" {...register('generation', { valueAsNumber: true })} placeholder="ឧ. ៩" />
                        </label>

                        <Box className="col-span-3 mt-4">
                            <Text size="3" weight="bold" color="blue">ព័ត៌មានការសិក្សា</Text>
                            <Box className="h-px bg-gray-200 mt-1 mb-3" />
                        </Box>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ឆ្នាំទី</Text>
                            <TextField.Root type="number" {...register('year', { valueAsNumber: true })} placeholder="ឧ. ១" />
                        </label>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ឆមាស</Text>
                            <TextField.Root type="number" {...register('semester', { valueAsNumber: true })} placeholder="ឧ. ២" />
                        </label>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ស្ថានភាពការសិក្សា</Text>
                            <Controller
                                control={control}
                                name="educationalStatus"
                                render={({ field }) => (
                                    <Select.Root onValueChange={field.onChange} value={field.value || ""}>
                                        <Select.Trigger placeholder="ជ្រើសរើសស្ថានភាព" className="w-full" />
                                        <Select.Content>
                                            <Select.Item value="កំពុងសិក្សា">កំពុងសិក្សា</Select.Item>
                                            <Select.Item value="បញ្ចប់ការសិក្សា">បញ្ចប់ការសិក្សា</Select.Item>
                                            <Select.Item value="បោះបង់">បោះបង់</Select.Item>
                                            <Select.Item value="ព្យួរ">ព្យួរ</Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                )}
                            />
                        </label>

                        <Box className="col-span-3 mt-4">
                            <Text size="3" weight="bold" color="blue">ID សម្គាល់ (សម្រាប់ភ្ជាប់ទិន្នន័យ)</Text>
                            <Box className="h-px bg-gray-200 mt-1 mb-3" />
                        </Box>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">មហាវិទ្យាល័យ (ID)</Text>
                            <TextField.Root type="number" {...register('facultyId', { valueAsNumber: true })} placeholder="ID" />
                        </label>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ដេប៉ាតឺម៉ង់ (ID)</Text>
                            <TextField.Root type="number" {...register('departmentId', { valueAsNumber: true })} placeholder="ID" />
                        </label>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">កម្រិតសិក្សា (ID)</Text>
                            <TextField.Root type="number" {...register('academicLevelId', { valueAsNumber: true })} placeholder="ID" />
                        </label>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">ឆ្នាំសិក្សា (ID)</Text>
                            <TextField.Root type="number" {...register('academicYearId', { valueAsNumber: true })} placeholder="ID" />
                        </label>

                    </Grid>

                    <Flex gap="3" mt="6" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray" style={{ cursor: 'pointer' }}>បោះបង់</Button>
                        </Dialog.Close>
                        <Button type="submit" loading={mutation.isPending} style={{ cursor: 'pointer' }}>រក្សាទុក</Button>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default StudentCreate