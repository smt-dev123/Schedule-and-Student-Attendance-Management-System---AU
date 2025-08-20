import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Inset,
  Table,
} from '@radix-ui/themes'
import React from 'react'
import { FaRegEye } from 'react-icons/fa'
import type { TeacherType } from '@/types/teachersType'

interface ViewTeacherProps {
  teachers: TeacherType
}

const ViewTeacher: React.FC<ViewTeacherProps> = ({ teachers }) => {
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger>
          <IconButton
            size="1"
            color="indigo"
            style={{ cursor: 'pointer' }}
            variant="surface"
          >
            <FaRegEye />
          </IconButton>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>គ្រូបង្រៀន</Dialog.Title>
          {/* <Dialog.Description>
            The following users have access to this project.
          </Dialog.Description> */}

          <Inset side="x" my="5">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Gender</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.RowHeaderCell>{teachers.name}</Table.RowHeaderCell>
                  <Table.Cell>{teachers.gender}</Table.Cell>
                  <Table.Cell>{teachers.email}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Inset>

          <Flex gap="3" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

export default ViewTeacher
