import { create } from 'zustand'

interface User {
  username: string
  role: 'admin' | 'staff' | 'teacher' | 'student'
  department?: string
  grade?: string
}

interface AuthState {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const mockUsers: (User & { password: string })[] = [
  { username: 'admin1', password: '123', role: 'admin' },
  { username: 'staff1', password: '123', role: 'staff', department: 'hr' },
  {
    username: 'teacher1',
    password: '123',
    role: 'teacher',
    department: 'math',
  },
  { username: 'student1', password: '123', role: 'student', grade: '10' },
]

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (username, password) => {
    const found = mockUsers.find(
      (u) => u.username === username && u.password === password,
    )
    if (found) {
      set({ user: found })
      return true
    }
    return false
  },
  logout: () => set({ user: null }),
}))
