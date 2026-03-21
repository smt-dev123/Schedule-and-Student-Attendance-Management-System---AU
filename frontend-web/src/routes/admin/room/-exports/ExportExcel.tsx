import type { RoomType } from '@/types';
import { Button } from '@radix-ui/themes';
import * as XLSX from 'xlsx';

const ExportExcel = ({ data }: { data: RoomType[] }) => {

    const handleExportExcel = () => {
        if (!data) return
        try {
            const formattedData = data.map((item: RoomType, index: number) => ({
                "ល.រ": index + 1,
                "បន្ទប់សិក្សា": item.name,
                "ជាន់បន្ទប់": item.number,
                "អាគារសិក្សា": item.building?.name || 'គ្មាន',
            }));

            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            const fileName = `តារាងបន្ទប់សិក្សា_${new Date().toLocaleDateString('kh-KH')}.xlsx`;
            XLSX.utils.book_append_sheet(workbook, worksheet, "Rooms");
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