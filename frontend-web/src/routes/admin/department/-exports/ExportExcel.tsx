import type { DepartmentsType } from '@/types';
import { Button } from '@radix-ui/themes';
import * as XLSX from 'xlsx';

const ExportExcel = ({ data }: { data: DepartmentsType[] }) => {

    const handleExportExcel = () => {
        if (!data) return
        try {
            const formattedData = data.map((item: DepartmentsType, index: number) => ({
                "ល.រ": index + 1,
                "តេប៉ាតឺម៉ង់": item.name,
                "មហាវិទ្យាល័យ": item.faculty?.name,
                "ការពិពណ៌នា": item.description,
            }));

            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            const fileName = `តារាងតេប៉ាតឺម៉ង់_${new Date().toLocaleDateString('kh-KH')}.xlsx`;
            XLSX.utils.book_append_sheet(workbook, worksheet, "Departments");
            XLSX.writeFile(workbook, fileName);
        } catch (err) {
            console.error(err);
            alert("មានបញ្ហាក្នុងការ Export Excel");
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleExportExcel}
            style={{ cursor: 'pointer' }}
            color="violet"
        >
            Export Excel
        </Button>
    )
}

export default ExportExcel