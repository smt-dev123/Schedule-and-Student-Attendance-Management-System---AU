import { DashboardRepository } from "../repositories/dashboard.repository";

export class DashboardService {
  constructor(private dashboardRepository: DashboardRepository) {}

  async getDashboardSummary() {
    const counts = await this.dashboardRepository.getCounts();
    const barDataRaw = await this.dashboardRepository.getStudentsByDepartment();
    const trendData = await this.dashboardRepository.getAttendanceTrend();
    const topAtts = await this.dashboardRepository.getTopAttendance();

    // Map colors for barData
    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];
    const barData = barDataRaw.map((item, index) => ({
      name: item.name,
      value: item.value,
      color: colors[index % colors.length],
    }));

    return {
      headerCards: counts,
      barData,
      trendData,
      topAtts,
    };
  }
}
