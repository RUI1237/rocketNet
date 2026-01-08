import apiClient from "@/shared/services/http";

export const monitoringService = {
  /** 上传图片进行分析 */
  analyzeImage: (formData: FormData): Promise<string> => {
    return apiClient.post("/detection/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
