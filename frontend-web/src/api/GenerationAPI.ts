import api from '@/lib/axios'
import type { GenerationsType } from '@/types'

export const getGeneration = async () => {
  const res = await api.get('/academic-levels')
  return res.data
}

export const createGeneration = async (newGeneration: GenerationsType) => {
  const res = await api.post('/academic-levels', newGeneration)
  return res.data
}

export const updateGeneration = async (
  id: number,
  updateGeneration: GenerationsType,
) => {
  const res = await api.put(`/academic-levels/${id}`, updateGeneration)
  return res.data
}

export const deleteGeneration = async (id: number) => {
  const res = await api.delete(`/academic-levels/${id}`)
  return res.data
}
