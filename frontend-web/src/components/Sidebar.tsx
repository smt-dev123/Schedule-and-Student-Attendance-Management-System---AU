import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  RiDashboardLine,
  RiSettings3Line,
  RiMenu2Line,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiSchoolLine,
} from 'react-icons/ri'
import { LiaChalkboardTeacherSolid } from 'react-icons/lia'
import { PiStudent } from 'react-icons/pi'
import { FaRegUser } from 'react-icons/fa'
import { AiOutlineSchedule } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'

interface MenuItem {
  key: string
  icon?: any
  label: string
  url?: string
  children?: MenuItem[]
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const { t } = useTranslation()

  // --- toggle submenu ---
  const toggleSubmenu = (key: string) =>
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )

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
    <aside
      className={`min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-all duration-300 flex flex-col border-r border-gray-200 dark:border-gray-700 ${
        collapsed ? 'w-16' : 'w-64 min-w-64'
      }`}
    >
      {/* Logo / Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
        {!collapsed && (
          <Link to="/admin/dashboard" preload="intent">
            <img
              className="w-36 h-auto"
              src="https://www.angkor.edu.kh/images/LogoAu3.png"
              alt="Angkor University"
            />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-2xl text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 hover:text-gray-800 cursor-pointer transition-all"
        >
          <RiMenu2Line />
        </button>
      </div>

      {/* Menu */}
      <nav className="font-khmer mt-2 flex-1 overflow-auto">
        <ul className="space-y-1 mx-2">
          {menuItems.map((menu) => {
            const isOpen = openKeys.includes(menu.key)

            if (menu.children) {
              return (
                <li key={menu.key}>
                  <button
                    onClick={() => toggleSubmenu(menu.key)}
                    className={`flex items-center justify-between w-full px-4 py-2 rounded cursor-pointer transition-colors duration-200 ${
                      isOpen
                        ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                        : 'hover:bg-blue-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-kantumruy-pro">
                      {menu.icon}
                      {!collapsed && <span>{menu.label}</span>}
                    </div>
                    {!collapsed &&
                      (isOpen ? <RiArrowDownSLine /> : <RiArrowRightSLine />)}
                  </button>

                  {isOpen && !collapsed && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {menu.children.map((child) => (
                        <li key={child.key}>
                          <Link
                            preload="intent"
                            to={child.url ?? '#'}
                            activeProps={{
                              className:
                                'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400',
                            }}
                            inactiveProps={{
                              className:
                                'hover:bg-blue-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
                            }}
                            className="block px-3 py-2 rounded text-sm transition-colors duration-200"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            }

            return (
              <li key={menu.key}>
                <Link
                  preload="intent"
                  to={menu.url ?? '#'}
                  activeProps={{
                    className:
                      'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400',
                  }}
                  inactiveProps={{
                    className:
                      'hover:bg-blue-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded transition-colors duration-200"
                >
                  {menu.icon}
                  {!collapsed && <span>{menu.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
