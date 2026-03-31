import apiClient from "./axiosConfig";

export const bugFixerApi = {
  fixBug: async ({ code, language, error_message, context }) => {
    return apiClient.post("/api/v1/fix-bug", { code, language, error_message, context });
  },

  healthCheck: async () => {
    return apiClient.get("/api/v1/health");
  },
};