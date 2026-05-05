import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { authClient } from '@/lib/auth-client'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'

let sessionCache: any = null
let lastFetch = 0
const CACHE_TTL = 2000 // 2 seconds cache is enough to prevent flood during drag

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const now = Date.now()
    if (!sessionCache || now - lastFetch > CACHE_TTL) {
      sessionCache = await authClient.getSession()
      lastFetch = now
    }

    if (!sessionCache?.data) {
      sessionCache = null // Reset cache if session is invalid
      throw redirect({ to: '/auth/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0">
          <Navbar />

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-gray-800 custom-scrollbar">
            <div className="min-h-full flex flex-col">
              <div className="flex-1 p-4">
                <Outlet />
              </div>

              <Footer />
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </>
  )
}
