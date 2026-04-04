import api from '@/lib/axios'
import type { StudentsType } from '@/types'

const ENDPOINT = '/students'

export const getStudents = async (
  name?: string,
  facultyId?: string,
  departmentId?: string,
  academicLevelId?: string,
  academicYearId?: number | null,
  page: number = 1,
  limit: number = 10,
) => {
  const res = await api.get(ENDPOINT, {
    params: {
      name: name || undefined,
      facultyId: facultyId || undefined,
      departmentId: departmentId || undefined,
      academicLevelId: academicLevelId || undefined,
      academicYearId,
      page,
      limit,
    },
  })
  return res.data?.data ?? []
}

export const createStudent = async (data: StudentsType) => {
  const res = await api.post(ENDPOINT, data)
  return res.data
}

export const updateStudent = async (id: string, data: StudentsType) => {
  const res = await api.put(`${ENDPOINT}/${id}`, data)
  return res.data
}

export const deleteStudent = async (id: string) => {
  const res = await api.delete(`${ENDPOINT}/${id}`)
  return res.data
}
