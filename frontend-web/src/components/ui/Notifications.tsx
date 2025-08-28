import { Popover, Box, Text, Avatar, Flex } from '@radix-ui/themes'
import { IoNotificationsOutline } from 'react-icons/io5'

export function Notifications() {
  const notificationCount = 5 // ចំនួនសារ

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Box style={{ position: 'relative', cursor: 'pointer' }}>
          <IoNotificationsOutline size="24" />
          {notificationCount > 0 && (
            <Box
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'red',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                borderRadius: '9999px',
                padding: '2px 6px',
                lineHeight: 1,
              }}
            >
              {notificationCount}
            </Box>
          )}
        </Box>
      </Popover.Trigger>

      <Popover.Content
        side="bottom"
        align="end"
        style={{
          width: 340,
          maxHeight: 350,
          overflowY: 'auto',
          borderRadius: 12,
          padding: '12px',
        }}
      >
        {/* Header */}
        <Box mb="2">
          <Text size="2" weight="bold">
            Notifications
          </Text>
        </Box>

        {/* Notifications List */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Box
            key={i}
            mb="2"
            p="2"
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            <Avatar
              size="3"
              radius="full"
              fallback="U"
              src={`https://i.pravatar.cc/64?img=${i + 1}`}
            />
            <Box width="100%">
              <Flex direction={'column'}>
                <Flex justify={'between'}>
                  <Text size="2" weight="bold">
                    User {i + 1}
                  </Text>
                  <Text size="2" color="gray">
                    4h
                  </Text>
                </Flex>
                <Text size="2" color="gray">
                  Sent you a message
                </Text>
              </Flex>
            </Box>
          </Box>
        ))}

        {/* Footer */}
        <Box mt="2" style={{ textAlign: 'center' }}>
          <Text size="2" color="blue" style={{ cursor: 'pointer' }}>
            View all
          </Text>
        </Box>
      </Popover.Content>
    </Popover.Root>
  )
}
