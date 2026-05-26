import { seoulDashboardFixture } from "../data/fixtures";
import { normalizeSeoulDashboard } from "./normalizeSeoulDashboard";
import type { SeoulDashboardData } from "../types/dashboard";

export const getSeoulDashboard = async (): Promise<SeoulDashboardData> => {
  return Promise.resolve(normalizeSeoulDashboard(seoulDashboardFixture));
};
