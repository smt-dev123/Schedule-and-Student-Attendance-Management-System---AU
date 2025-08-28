import { Avatar, DropdownMenu } from '@radix-ui/themes'
import { Link } from '@tanstack/react-router'
import Language from './ui/Language'
import DarkMode from './ui/DarkMode'
import { useTranslation } from 'react-i18next'
import { Notifications } from './ui/Notifications'
import Expand from './ui/Expand'

const Navbar = () => {
  const { t } = useTranslation()
  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-900 px-4 min-h-16 shadow-sm">
      <h2 className="font-khmer text-lg font-medium text-gray-800 dark:text-white">
        {t('Navbar.hello')} {', '}
        <b className="font-semibold text-gray-900 dark:text-white">
          លុយ សុមាត្រា
        </b>
      </h2>

      <div className="flex gap-4 items-center justify-center">
        {/* Language */}
        <Language />

        {/* Expand */}
        <Expand />

        {/* Dark Mode */}
        <DarkMode />

        {/* Notificatoins */}
        <Notifications />

        {/* User */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger style={{ cursor: 'pointer' }}>
            <Avatar
              size="2"
              src="https://academics-bucket-sj19asxm-prod.s3.ap-southeast-1.amazonaws.com/884dc87f-2613-47fc-83b3-b138abc386df/884dc87f-2613-47fc-83b3-b138abc386df.png"
              fallback="A"
              radius="full"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <Link to="/admin/setting">ការកំណត់</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link to="/auth/login">ចាកចេញ</Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}

export default Navbar
