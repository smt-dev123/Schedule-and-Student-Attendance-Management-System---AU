import api from '@/lib/axios'
import type { RoomType } from '@/types'

export const getRoom = async () => {
  const res = await api.get('/rooms?_embed=building')
  return res.data
}

export const createRoom = async (newRoom: RoomType) => {
  const res = await api.post('/rooms', newRoom)
  return res.data
}

export const updateRoom = async (
  id: number,
  updateRoom: RoomType,
) => {
  const res = await api.put(`/rooms/${id}`, updateRoom)
  return res.data
}

export const deleteRoom = async (id: number) => {
  const res = await api.delete(`/rooms/${id}`)
  return res.data
}
