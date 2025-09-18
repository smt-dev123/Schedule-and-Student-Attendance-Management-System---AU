import { createFileRoute } from '@tanstack/react-router'

import * as Collapsible from '@radix-ui/react-collapsible'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useState } from 'react'
import {
  RiMenu2Line,
  RiDashboardLine,
  RiSettings3Line,
  RiSchoolLine,
} from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { LiaChalkboardTeacherSolid } from 'react-icons/lia'
import { AiOutlineSchedule } from 'react-icons/ai'
import { PiStudent } from 'react-icons/pi'
import { FaRegUser } from 'react-icons/fa'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

interface MenuItem {
  key: string
  icon?: any
  label: string
  url?: string
  children?: MenuItem[]
}

function RouteComponent() {
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useTranslation()

  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <RiDashboardLine className="text-xl" />,
      label: t('Sidebar.dashboard'),
      url: '/admin/dashboard',
    },
    {
      key: 'university',
      icon: <RiSchoolLine className="text-xl" />,
      label: t('Sidebar.University.university'),
      children: [
        {
          key: 'building',
          label: t('Sidebar.University.building'),
          url: '/admin/building',
        },
        {
          key: 'room',
          label: t('Sidebar.University.room'),
          url: '/admin/room',
        },
      ],
    },
    {
      key: 'study',
      icon: <RiSchoolLine className="text-xl" />,
      label: t('Sidebar.Study.study'),
      children: [
        { key: 'level', label: t('Sidebar.Study.level'), url: '/admin/level' },
        {
          key: 'generation',
          label: t('Sidebar.Study.generation'),
          url: '/admin/generation',
        },
        {
          key: 'faculty',
          label: t('Sidebar.Study.faculty'),
          url: '/admin/faculty',
        },
        { key: 'major', label: t('Sidebar.Study.major'), url: '/admin/major' },
      ],
    },
    {
      key: 'teacher',
      icon: <LiaChalkboardTeacherSolid className="text-xl" />,
      label: t('Sidebar.teacher'),
      url: '/admin/teacher',
    },
    {
      key: 'student',
      icon: <PiStudent className="text-xl" />,
      label: t('Sidebar.student'),
      url: '/admin/student',
    },
    {
      key: 'classes',
      icon: <AiOutlineSchedule className="text-xl" />,
      label: t('Sidebar.class'),
      url: '/admin/classes',
    },
    {
      key: 'user',
      icon: <FaRegUser className="text-md" />,
      label: t('Sidebar.user'),
      url: '/admin/user',
    },
    {
      key: 'setting',
      icon: <RiSettings3Line className="text-xl" />,
      label: t('Sidebar.setting'),
      url: '/admin/setting',
    },
  ]

  return (
    <div className="flex">
      {/* === Desktop Sidebar === */}
      <Collapsible.Root
        open={open}
        onOpenChange={setOpen}
        className="hidden md:block h-screen bg-gray-900 text-white transition-all"
      >
        <div className={`transition-all ${open ? 'w-64' : 'w-16'}`}>
          {/* === Header === */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
            {open && (
              <Link to="/admin/dashboard" preload="intent">
                <img
                  className="w-36 h-auto"
                  src="https://www.angkor.edu.kh/images/LogoAu3.png"
                  alt="Angkor University"
                />
              </Link>
            )}

            <Collapsible.Trigger asChild>
              <button className="ml-auto text-2xl text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 hover:text-gray-800 cursor-pointer transition-all">
                <RiMenu2Line />
              </button>
            </Collapsible.Trigger>
          </div>

          {/* === Desktop Drawer === */}
          <nav className="flex flex-col gap-2 p-2">
            {menuItems.map((menu) => (
              <Link
                key={menu.key}
                preload="intent"
                to={menu.url ?? '#'}
                className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded"
              >
                {menu.icon} {open && menu.label}
              </Link>
            ))}
          </nav>
        </div>
      </Collapsible.Root>

      {/* === Mobile Drawer === */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-4 text-gray-800"
        >
          <RiMenu2Line />
        </button>

        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg">
              {/* --- Accessibility: Hidden Title + Description --- */}
              <VisuallyHidden>
                <Dialog.Title>Mobile menu</Dialog.Title>
                <Dialog.Description>
                  Navigation menu with links.
                </Dialog.Description>
              </VisuallyHidden>

              <nav className="flex flex-col gap-2 p-4">
                {menuItems.map((menu) => (
                  <Link
                    key={menu.key}
                    preload="intent"
                    to={menu.url ?? '#'}
                    className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded"
                  >
                    {menu.icon} {open && menu.label}
                  </Link>
                ))}
              </nav>

              {/* Optional close button (accessible) */}
              <Dialog.Close asChild>
                <button
                  aria-label="Close menu"
                  className="absolute top-3 right-3 rounded p-1 hover:bg-white/10"
                >
                  ✕
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* === Page Content === */}
      <main className="flex-1 p-4">Content</main>
    </div>
  )
}
