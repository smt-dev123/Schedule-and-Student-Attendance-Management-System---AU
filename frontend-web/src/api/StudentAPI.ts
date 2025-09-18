import api from '@/lib/axios'
import type { StudentsType } from '@/types'

export const getStudents = async () => {
  const res = await api.get('/students')
  return res.data
}

export const createStudents = async (newStudents: StudentsType) => {
  const res = await api.post('/students', newStudents)
  return res.data
}

export const updateStudents = async (
  id: number,
  updateStudents: StudentsType,
) => {
  const res = await api.put(`/students/${id}`, updateStudents)
  return res.data
}

export const deleteStudents = async (id: number) => {
  const res = await api.delete(`/students/${id}`)
  return res.data
}
