import { ReportModel } from "@models";

export class ReportService {
  private static instance: ReportService | null = null;

  private constructor() {}

  static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }

    return ReportService.instance;
  }

  // Code here
}
