import api from '@/lib/axios'
import type { GenerationsType } from '@/types'

export const getGeneration = async () => {
  const res = await api.get('/generations')
  return res.data
}

export const createGeneration = async (newGeneration: GenerationsType) => {
  const res = await api.post('/generations', newGeneration)
  return res.data
}

export const updateGeneration = async (
  id: number,
  updateGeneration: GenerationsType,
) => {
  const res = await api.put(`/generations/${id}`, updateGeneration)
  return res.data
}

export const deleteGeneration = async (id: number) => {
  const res = await api.delete(`/generations/${id}`)
  return res.data
}
