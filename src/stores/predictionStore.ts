// src/stores/predictionStore.ts
import { create } from "zustand";
import { predictionService } from "@/services/prediction.service";
import type { PredictionTask, PredictionQueryParams } from "@/types/prediction.types";

interface PredictionState {
  // --- State ---
  list: PredictionTask[]; // 列表数据
  total: number; // 总条数
  isLoading: boolean; // 列表加载状态

  currentDetail: PredictionTask | null; // 当前选中的详情（包含图片列表）
  isDetailLoading: boolean; // 详情加载状态

  // --- Actions ---
  fetchList: (params: PredictionQueryParams) => Promise<void>;
  fetchDetail: (taskId: string) => Promise<void>;
  clearDetail: () => void;
}

export const usePredictionStore = create<PredictionState>((set) => ({
  list: [],
  total: 0,
  isLoading: false,
  currentDetail: null,
  isDetailLoading: false,

  // 获取列表
  fetchList: async (params) => {
    set({ isLoading: true });
    try {
      const res = await predictionService.getTaskList(params);
      if (res.code === 200) {
        set({
          list: res.data.list || [],
          total: res.data.total || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch prediction list:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 获取详情
  fetchDetail: async (taskId) => {
    set({ isDetailLoading: true, currentDetail: null }); // 先置空，防止显示上一次的数据
    try {
      const res = await predictionService.getTaskDetail(taskId);
      if (res.code === 200) {
        set({ currentDetail: res.data });
      }
    } catch (error) {
      console.error("Failed to fetch detail:", error);
    } finally {
      set({ isDetailLoading: false });
    }
  },

  // 关闭弹窗时清理详情数据
  clearDetail: () => set({ currentDetail: null }),
}));
