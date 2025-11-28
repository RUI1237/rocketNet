export interface PredictionLogType {
  id: number;
  // 任务ID
  // taskId: string;
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

export interface PredictionEvent {
  // 假设事件也有唯一ID，如果没有可忽略
  // id?: string | number;
  // 帧时间戳 (视频任务特有)
  frameTimestamp?: string;
  // 是否触发报警: "true" | "false" | "是" | "否"
  isAlarm: string;
  // 测量出的长度（单位：米）
  measuredLength: number;
  // 结果图的URL路径
  resultImageUrl: string;
}
