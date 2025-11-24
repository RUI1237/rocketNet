// src/stores/monitoringStore.ts
import { create } from "zustand";
import { type UploadFile, message } from "antd";
import { imageService } from "@/services";

interface MonitoringState {
  // State
  originalFile: File | null;
  originalImageUrl: string;
  processedImageUrl: string;
  isLoading: boolean;
  fileList: UploadFile[];

  // Actions
  setFile: (file: File) => void;
  clearFile: () => void;
  analyzeImage: () => Promise<void>;
}

export const useMonitoringStore = create<MonitoringState>((set, get) => ({
  // Initial State
  originalFile: null,
  originalImageUrl: "",
  processedImageUrl: "",
  isLoading: false,
  fileList: [],

  // Actions

  // 处理文件上传逻辑
  setFile: (file: File) => {
    // 1. 验证格式
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("您只能上传 JPG/PNG 格式的图片!");
      // 注意：在 Store 中我们只处理状态，Upload 组件的 return false 逻辑仍在组件层处理，
      // 或者可以在这里抛出错误，但保持组件控制 Upload 行为更简单。
      return;
    }

    // 2. 读取图片用于预览
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      set({
        originalFile: file,
        fileList: [file as unknown as UploadFile], // Antd 类型兼容
        originalImageUrl: reader.result as string,
        processedImageUrl: "", // 重置之前的分析结果
      });
    };
  },

  // 清除/重置逻辑
  clearFile: () => {
    const { processedImageUrl } = get();
    window.URL.revokeObjectURL(processedImageUrl);

    set({
      originalFile: null,
      originalImageUrl: "",
      processedImageUrl: "",
      fileList: [],
    });
  },

  // 分析图片逻辑
  analyzeImage: async () => {
    const { originalFile } = get();

    if (!originalFile) {
      message.error("请先选择一张图片！");
      return;
    }

    set({ isLoading: true, processedImageUrl: "" });

    const formData = new FormData();
    formData.append("image", originalFile);

    try {
      const res = await imageService.analyzeImage(formData);
      console.log("调试 analyzeImage 返回值:", res);

      const blobUrl = window.URL.createObjectURL(res);
      set({ processedImageUrl: blobUrl });
      message.success("图片分析完成！");
    } catch (error) {
      console.error("图片分析失败:", error);
      message.error("分析失败，请稍后重试");
    } finally {
      set({ isLoading: false });
    }
  },
}));
