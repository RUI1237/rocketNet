import type { ApiResponse } from "@/types";
import apiClient from "./http";

// 假设后端返回的数据结构
interface ImageData {
  url: string;
}

/**
 * 封装图片处理相关的 API 调用
 */

export const imageService = {
  /**
   * 上传图片进行分析
   * @param data - 包含图片文件的 FormData
   */
  analyzeImage: (data: FormData): Promise<ApiResponse<Blob>> => {
    // 这里的 '/images/analyze' 是你需要和后端工程师确认的 API 地址
    // 我们需要设置请求头的 Content-Type 为 multipart/form-data，
    // 不过 axios 在检测到 FormData 时通常会自动设置。

    return apiClient.post("detection/image", data, {
      responseType: "blob",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
