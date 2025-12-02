export interface DataAnalysisKpi {
  /** 今日已处理任务 */
  tasksToday: number;
  /** 今日新增报警 */
  alarmsToday: number;
  /** 累计拦截超规石块 */
  totalAlarms: number;
  /** 待处理报警 */
  pendingAlarms: number;
}

export interface DataAnalysisTrends24h {
  /** X 轴的标签，代表过去 24 小时的每个小时点 */
  hours: string[];
  /** 每小时的任务数 */
  taskCounts: number[];
  /** 每小时的报警数 */
  alarmCounts: number[];
}

export interface DataAnalysisEfficiency {
  totalAlarms: number;
  processedAlarms: number;
  pendingAlarms: number;
  /** 平均处理时长（分钟） */
  avgResolutionTimeMinutes: number;
}

export interface DataAnalysisSizeDistribution {
  /** 尺寸范围标签 */
  sizeRanges: string[];
  /** 每个尺寸范围内的报警次数 */
  counts: number[];
}

export interface DataAnalysisLatestAlarmSnapshot {
  alarmId: number;
  /** 结果图的 URL */
  imageUrl: string;
  measuredLength: number;
  alarmTime: string;
}
