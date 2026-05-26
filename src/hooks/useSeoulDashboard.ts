import { useQuery } from "@tanstack/react-query";
import { getSeoulDashboard } from "../api/seoulDashboard";

export const useSeoulDashboard = () => {
  return useQuery({
    queryKey: ["seoul-dashboard"],
    queryFn: getSeoulDashboard,
  });
};
