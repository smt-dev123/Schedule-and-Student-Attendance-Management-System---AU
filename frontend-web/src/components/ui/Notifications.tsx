import { Popover, Box, Text, Avatar, Flex } from '@radix-ui/themes'
import { IoNotificationsOutline } from 'react-icons/io5'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotifications, getMyNotifications, markNotificationAsRead } from '@/api/NotificationAPI'
import { useAuth } from '@/stores/auth'

export function Notifications() {
  const { user } = useAuth()

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => {
      const role = (user as any)?.role
      if (role === 'student') {
        return getMyNotifications(user?.id || '')
      } else {
        return getNotifications()
      }
    },
    enabled: !!user,
  })

  const queryClient = useQueryClient()

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
    }
  })

  const unreadCount = (user as any)?.role === 'student'
    ? notifications.filter((n: any) => !n.readAt).length
    : notifications.length

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Box style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 8px' }}>
          <IoNotificationsOutline size="24" className="text-gray-600 dark:text-gray-200 hover:text-sky-600 transition-colors" />
          {unreadCount > 0 && (
            <Box
              style={{
                position: 'absolute',
                top: '-2px',
                right: '2px',
                background: 'red',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '9999px',
                padding: '2px 5px',
                lineHeight: 1,
                border: '2px solid white',
              }}
              className="dark:border-gray-900"
            >
              {unreadCount}
            </Box>
          )}
        </Box>
      </Popover.Trigger>

      <Popover.Content
        side="bottom"
        align="end"
        style={{
          width: 360,
          maxHeight: 400,
          overflowY: 'auto',
          borderRadius: 12,
          padding: '16px',
        }}
        className="bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700"
      >
        {/* Header */}
        <Box mb="3" pb="2" style={{ borderBottom: '1px solid #eaeaea' }} className="dark:border-gray-700">
          <Text size="3" weight="bold" className="text-gray-900 dark:text-gray-100">
            Notifications
          </Text>
        </Box>

        {/* Notifications List */}
        <Flex direction="column" gap="2">
          {notifications.length > 0 ? (
            notifications.slice(0, 10).map((n: any, i: number) => {
              // Extract fields accommodating both Notification and NotificationRecipient models
              const title = n.notification?.title || n.title || 'Announcement'
              const message = n.notification?.message || n.message || ''
              const time = n.createdAt || n.notification?.createdAt || new Date().toISOString()
              const isRead = (user as any)?.role === 'student' ? !!n.readAt : true

              return (
                <Box
                  key={n.id || i}
                  p="3"
                  onClick={() => {
                    if ((user as any)?.role === 'student' && !isRead && n.id) {
                      markAsReadMutation.mutate(n.id)
                    }
                  }}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    borderRadius: 8,
                    cursor: 'pointer',
                    backgroundColor: isRead ? 'transparent' : 'rgba(14, 165, 233, 0.05)',
                  }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Avatar
                    size="3"
                    radius="full"
                    fallback="A"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent('Admin')}&background=0ea5e9&color=fff`}
                  />
                  <Box width="100%" style={{ overflow: 'hidden' }}>
                    <Flex direction="column" gap="1">
                      <Flex justify="between" align="baseline">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">
                          {title}
                        </Text>
                        <Text size="1" color="gray" style={{ whiteSpace: 'nowrap', marginLeft: '8px' }}>
                          {new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Text>
                      </Flex>
                      <Text size="2" color="gray" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.4'
                      }} className="dark:text-gray-400">
                        {message}
                      </Text>
                    </Flex>
                  </Box>
                  {!isRead && (
                    <Box style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9', flexShrink: 0, marginTop: '8px' }} />
                  )}
                </Box>
              )
            })
          ) : (
            <Box py="6" style={{ textAlign: 'center' }}>
              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <IoNotificationsOutline size="24" className="text-gray-400" />
              </div>
              <Text size="2" className="text-gray-500 dark:text-gray-400">You're all caught up!</Text>
            </Box>
          )}
        </Flex>

        {/* Footer */}
        {notifications.length > 0 && (
          <Box mt="3" style={{ textAlign: 'center', borderTop: '1px solid #eaeaea', paddingTop: '12px' }} className="dark:border-gray-700">
            <Text size="2" className="text-sky-600 dark:text-sky-400 hover:text-sky-700 font-medium" style={{ cursor: 'pointer' }}>
              View all notifications
            </Text>
          </Box>
        )}
      </Popover.Content>
    </Popover.Root>
  )
}
