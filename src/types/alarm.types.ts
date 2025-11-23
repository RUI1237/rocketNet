export interface AlarmLogType {
  id: number;
  logId: string; // 格式化后的日志ID
  alarmTime: string; // 报警时间
  alarmType: string; // 报警类型
  status: string; // 报警状态: "未处理" | "已处理" (这里用中文或英文均可，代码中我假设后端返回中文或约定好的String)
  originalFilename: string; // 原始文件名
  measuredLength: number; // 测量出的长度（米）
  resultImageUrl: string; // 结果图 URL (E:/...)
  acknowledgedBy?: string; // 处理人
  acknowledgedTime?: string; // 处理时间
  notes?: string; // 处理备注
}
