import { Button, Flex, Text, Box } from '@radix-ui/themes'
import { FaArrowLeft, FaFileExport, FaPrint } from 'react-icons/fa'
import { useRouter } from '@tanstack/react-router'
import OverrideCreate from '@/routes/admin/schedule/-actions/OverrideCreate'
import { useSessionContext } from '@/providers/AuthProvider'

interface ScheduleHeaderProps {
  scheduleId: number
}

export function ScheduleHeader({ scheduleId }: ScheduleHeaderProps) {
  const router = useRouter()
  const { data: session } = useSessionContext()
  const role = (session?.user as any)?.role

  return (
    <Flex
      direction={{ initial: 'column', sm: 'row' }}
      justify="between"
      align={{ initial: 'start', sm: 'center' }}
      gap="4"
      className="print:hidden"
    >
      <Flex gap="3" align="center">
        <button
          onClick={() => router.history.back()}
          className="cursor-pointer hover:bg-gray-200 transition-colors p-2.5 bg-gray-100 rounded-full"
        >
          <FaArrowLeft size={14} />
        </button>
        <Box>
          <Text size="5" weight="bold">
            កាលវិភាគសិក្សា
          </Text>
        </Box>
      </Flex>
      <Flex gap="2" wrap="wrap">
        <Button variant="soft" color="gray">
          <FaFileExport />{' '}
          <span className="hidden md:inline">Export Excel</span>
        </Button>
        <Button variant="soft" onClick={() => window.print()}>
          <FaPrint /> <span className="hidden md:inline">បោះពុម្ភ</span>
        </Button>

        {(role === 'staff' || role === 'admin' || role === 'manager') && (
          <OverrideCreate scheduleId={scheduleId} />
        )}
      </Flex>
    </Flex>
  )
}
