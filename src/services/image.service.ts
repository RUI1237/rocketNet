import type { ApiResponse } from "@/types";
import apiClient from "./http";

export const imageService = {
  /**
   * 上传图片进行分析
   * @param data - 包含图片文件的 FormData
   */
  analyzeImage: (data: FormData): Promise<Blob> => {
    return apiClient.post("detection/image", data, {
      responseType: "blob",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
