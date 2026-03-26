import api from '@/lib/axios'
import type { StudentsType } from '@/types'

const ENDPOINT = '/students'

export const getStudents = async (name?: string, faculty?: string, department?: string, academicLevel?: string, page?: number, limit?: number) => {
  const res = await api.get(ENDPOINT, {
    params: { name, faculty, department, academicLevel, page, limit },
  })
  return res.data.data
}

export const createStudent = async (data: StudentsType) => {
  const res = await api.post(ENDPOINT, data)
  return res.data
}

export const updateStudent = async (id: number, data: StudentsType) => {
  const res = await api.put(`${ENDPOINT}/${id}`, data)
  return res.data
}

export const deleteStudent = async (id: number) => {
  const res = await api.delete(`${ENDPOINT}/${id}`)
  return res.data
}