import api from '@/lib/axios'
import type { TeachersType } from '@/types'

export const getTeachers = async () => {
  const res = await api.get('/teachers')
  return res.data
}

export const createTeachers = async (newTeachers: TeachersType) => {
  const res = await api.post('/teachers', newTeachers)
  return res.data
}

export const updateTeachers = async (
  id: number,
  updateTeachers: TeachersType,
) => {
  const res = await api.put(`/teachers/${id}`, updateTeachers)
  return res.data
}

export const deleteTeachers = async (id: number) => {
  const res = await api.delete(`/teachers/${id}`)
  return res.data
}
