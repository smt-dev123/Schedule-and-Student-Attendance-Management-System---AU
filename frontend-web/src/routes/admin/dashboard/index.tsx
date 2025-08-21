import NameListPDF from '@/components/NameListPDF'
import { useTitle } from '@/hooks/useTitle'
import { pdf } from '@react-pdf/renderer'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/admin/dashboard/')({
  component: RouteComponent,
})

const data = [
  {
    id: '1',
    name: 'សេង ស៊ង់',
    gender: 'ប្រុស',
    marital_status: 'មានគ្រួសារ',
    education_level: 'បរិញ្ញាបត្រជាន់ខ្ពស់',
    email: 'soung@gmail.com',
    phone: '012 345 671',
  },
  {
    id: '2',
    name: 'សេង គ្រី',
    gender: 'ប្រុស',
    marital_status: 'មានគ្រួសារ',
    education_level: 'បរិញ្ញាបត្រជាន់ខ្ពស់',
    email: 'sengkry@gmail.com',
    phone: '088 739 429',
  },
  {
    id: '3',
    name: 'ហេង សុវណ្ណី',
    gender: 'ប្រុស',
    marital_status: 'មានគ្រួសារ',
    education_level: 'បរិញ្ញាបត្រជាន់ខ្ពស់',
    email: 'vanny@gmail.com',
    phone: '095 873 234',
  },
  {
    id: '4',
    name: 'ហេង ប៊ុនសុង',
    gender: 'ប្រុស',
    marital_status: 'មានគ្រួសារ',
    education_level: 'បណ្ឌិត',
    email: 'bunsung@gmail.com',
    phone: '012 345 246',
  },
  {
    id: '5',
    name: 'ខឿត សុផា',
    gender: 'ប្រុស',
    marital_status: 'នៅលីវ',
    education_level: 'បរិញ្ញាបត្រជាន់ខ្ពស់',
    email: 'sopha@gmail.com',
    phone: '097 823 325',
  },
]

function RouteComponent() {
  useTitle('Dashboard')
  const downloadPdf = async () => {
    const blob = await pdf(<NameListPDF data={data} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'NameList.pdf'
    link.click()
    URL.revokeObjectURL(url) // clean up
  }

  return (
    <div>
      <button onClick={downloadPdf}>Download Name List PDF</button>
    </div>
  )
}
