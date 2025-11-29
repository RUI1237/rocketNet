// src/stores/monitoringStore.ts
import { create } from "zustand";
import { type UploadFile, message } from "antd";
import { imageService } from "@/services";

interface MonitoringState {
  originalFile: File | null;
  originalImageUrl: string;
  processedImageUrl: string;
  isLoading: boolean;
  fileList: UploadFile[];

  setFile: (file: File) => void;
  clearFile: () => void;
  analyzeImage: () => Promise<void>;
}

export const useMonitoringStore = create<MonitoringState>((set, get) => ({
  originalFile: null,
  originalImageUrl: "",
  processedImageUrl: "",
  isLoading: false,
  fileList: [],

  setFile: (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("您只能上传 JPG/PNG 格式的图片!");

      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      set({
        originalFile: file,
        fileList: [file as unknown as UploadFile],
        originalImageUrl: reader.result as string,
        processedImageUrl: "",
      });
    };
  },

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
      // const blobUrl = window.URL.createObjectURL(res);
      // set({ processedImageUrl: blobUrl });
      set({ processedImageUrl: res.data });
      message.success("图片分析完成！");
    } catch (error) {
      console.error("图片分析失败:", error);
      message.error("分析失败，请稍后重试");
    } finally {
      set({ isLoading: false });
    }
  },
}));
