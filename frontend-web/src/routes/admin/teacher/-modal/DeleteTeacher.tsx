import { AlertDialog, Button, Flex, IconButton } from '@radix-ui/themes'
import React from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

interface DeleteTeacherProps {
  teachers: {
    id: number
    name?: string
  }
}

const DeleteTeacher: React.FC<DeleteTeacherProps> = ({ teachers }) => {
  const handleDelete = (id: number) => {
    try {
      toast.success(`Deleted row id ${id}`)
    } catch {
      toast.error('Deleted teacher not successfully.')
    }
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <IconButton
          size="1"
          color="crimson"
          variant="surface"
          style={{ cursor: 'pointer' }}
        >
          <FaRegTrashAlt />
        </IconButton>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>តើអ្នកពិតជាចង់លុបមែនទេ?</AlertDialog.Title>
        <AlertDialog.Description size="2">
          តើអ្នកពិតជាចង់លុបលោកគ្រូ{' '}
          <b>{teachers?.name ?? `ID ${teachers.id}`}</b> ?
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" style={{ cursor: 'pointer' }}>
              ចាកចេញ
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="solid"
              color="red"
              style={{ cursor: 'pointer' }}
              onClick={() => handleDelete(teachers.id)}
            >
              លុប
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default DeleteTeacher
