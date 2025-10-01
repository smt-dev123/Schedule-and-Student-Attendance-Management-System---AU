import api from '@/lib/axios'
import type { UsersType } from '@/types'

export const getUsers = async () => {
  const res = await api.get('/users')
  return res.data
}

export const createUsers = async (newUsers: UsersType) => {
  const res = await api.post('/users', newUsers)
  return res.data
}

export const updateUsers = async (
  id: number,
  updateUsers: UsersType,
) => {
  const res = await api.put(`/users/${id}`, updateUsers)
  return res.data
}

export const deleteUsers = async (id: number) => {
  const res = await api.delete(`/users/${id}`)
  return res.data
}
