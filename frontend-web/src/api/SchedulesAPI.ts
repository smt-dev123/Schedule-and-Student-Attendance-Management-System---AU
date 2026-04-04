import api from '@/lib/axios'
import type { ScheduleType } from '@/types'

const ENDPOINT = '/schedules'

export const getSchedules = async ({
  facultyId,
  departmentId,
  academicYearId,
}: {
  facultyId: number
  departmentId: number
  academicYearId?: number
}) => {
  const res = await api.get(ENDPOINT, {
    params: {
      facultyId,
      departmentId,
      academicYearId,
    },
  })
  return res.data.data ?? []
}

export const createSchedule = async (data: ScheduleType) => {
  const res = await api.post(ENDPOINT, data)
  return res.data.data
}

export const updateSchedule = async (id: number, data: ScheduleType) => {
  const res = await api.put(`${ENDPOINT}/${id}`, data)
  return res.data.data
}

export const deleteSchedule = async (id: number) => {
  const res = await api.delete(`${ENDPOINT}/${id}`)
  return res.data.data
}
