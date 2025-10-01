import api from '@/lib/axios'
import type { MajorsType } from '@/types'

export const getMajors = async () => {
  const res = await api.get('/majors?_embed=department')
  return res.data
}

export const createMajors = async (newMajors: MajorsType) => {
  const res = await api.post('/majors', newMajors)
  return res.data
}

export const updateMajors = async (
  id: number,
  updateMajors: MajorsType,
) => {
  const res = await api.put(`/majors/${id}`, updateMajors)
  return res.data
}

export const deleteMajors = async (id: number) => {
  const res = await api.delete(`/majors/${id}`)
  return res.data
}
