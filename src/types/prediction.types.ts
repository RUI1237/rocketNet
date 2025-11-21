// src/types/prediction.ts

// --- 1. 基础实体定义 ---

/**
 * 预测事件 (对应详情中的每一帧/每一个结果)
 * 通常包含结果图、测量长度、是否报警等详细信息
 */
export interface PredictionEvent {
  // 假设事件也有唯一ID，如果没有可忽略
  id?: string | number;
  // 帧时间戳 (视频任务特有)
  frameTimestamp?: string;
  // 是否触发报警: "true" | "false" | "是" | "否"
  isAlarm: string;
  // 测量出的长度（单位：米）
  measuredLength: number;
  // 结果图的URL路径
  resultImageUrl: string;
}

/**
 * 预测任务 (主表数据)
 */
export interface PredictionTask {
  id: number;
  // 任务ID
  taskId: string;
  // 原始文件名
  originalFilename: string;
  // 预测时间
  creationTime: string;
  // 任务状态: "COMPLETED" | "PROCESSING" | "FAILED"
  taskStatus: string;
  // 总体预测结果: "正常" | "异常"
  predictionResult?: string;

  // --- 嵌套的事件列表 ---
  // 列表查询时该字段可能为空，点击详情查询时该字段会有数据
  events?: PredictionEvent[];
}

// --- 2. API 请求与响应结构 ---

/**
 * 分页查询参数
 */
export interface PredictionQueryParams {
  page: number;
  pageSize: number;
  taskId?: string; // 可选：按ID搜
  taskStatus?: string; // 可选：按状态搜
  startTime?: string; // 可选：时间范围
  endTime?: string;
}

// /**
//  * 通用 API 响应包装
//  */
// export interface ApiResponse<T> {
//   code: number;
//   msg: string;
//   data: T;
// }

/**
 * 分页数据结构
 */
export interface PageResult<T> {
  list: T[];
  total: number;
}
