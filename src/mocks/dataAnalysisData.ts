import { http, HttpResponse } from "msw";
import { allAlarms } from "./alarmData";
import { allPredictions } from "./predictionData";
import type {
  DataAnalysisKpi,
  DataAnalysisTrends24h,
  DataAnalysisEfficiency,
  DataAnalysisSizeDistribution,
  DataAnalysisLatestAlarmSnapshot,
} from "@/features/data-analysis/types/dataAnalysis.types";

// ==========================================
// 基于静态数据计算的固定统计值
// ==========================================

// 计算 KPI 数据
const calculateKpi = (): DataAnalysisKpi => {
  const pendingAlarms = allAlarms.filter((a) => a.status === "未处理").length;
  const completedPredictions = allPredictions.filter((p) => p.taskStatus === "COMPLETED").length;

  return {
    tasksToday: completedPredictions,
    alarmsToday: allAlarms.length,
    totalAlarms: allAlarms.length,
    pendingAlarms,
  };
};

// 计算 24 小时趋势（基于报警时间分布）
const calculateTrends = (): DataAnalysisTrends24h => {
  const hours: string[] = [];
  const taskCounts: number[] = [];
  const alarmCounts: number[] = [];

  // 统计每小时的报警数量
  const hourlyAlarms = new Array(24).fill(0);
  allAlarms.forEach((alarm) => {
    const hour = parseInt(alarm.alarmTime.split(" ")[1].split(":")[0], 10);
    hourlyAlarms[hour]++;
  });

  // 统计每小时的预测任务数量
  const hourlyTasks = new Array(24).fill(0);
  allPredictions.forEach((pred) => {
    const hour = parseInt(pred.creationTime.split(" ")[1].split(":")[0], 10);
    hourlyTasks[hour]++;
  });

  for (let i = 0; i < 24; i++) {
    hours.push(`${String(i).padStart(2, "0")}:00`);
    alarmCounts.push(hourlyAlarms[i]);
    taskCounts.push(hourlyTasks[i]);
  }

  return { hours, taskCounts, alarmCounts };
};

// 计算处理效率
const calculateEfficiency = (): DataAnalysisEfficiency => {
  const processed = allAlarms.filter((a) => a.status === "已处理").length;
  const pending = allAlarms.filter((a) => a.status === "未处理").length;

  return {
    totalAlarms: allAlarms.length,
    processedAlarms: processed,
    pendingAlarms: pending,
    avgResolutionTimeMinutes: 35.2, // 固定值
  };
};

// 计算尺寸分布
const calculateSizeDistribution = (): DataAnalysisSizeDistribution => {
  const sizeRanges = ["1.0-1.1m", "1.1-1.2m", "1.2-1.3m", "1.3-1.4m", "1.4-1.5m"];
  const counts = [0, 0, 0, 0, 0];

  allAlarms.forEach((alarm) => {
    const len = alarm.measuredLength;
    if (len < 1.1) counts[0]++;
    else if (len < 1.2) counts[1]++;
    else if (len < 1.3) counts[2]++;
    else if (len < 1.4) counts[3]++;
    else counts[4]++;
  });

  return { sizeRanges, counts };
};

// 获取最新报警快照
const getLatestAlarms = (limit: number): DataAnalysisLatestAlarmSnapshot[] => {
  return allAlarms.slice(0, limit).map((alarm) => ({
    alarmId: alarm.id,
    imageUrl: alarm.resultImageUrl,
    measuredLength: alarm.measuredLength,
    alarmTime: alarm.alarmTime,
  }));
};

// ==========================================
// 预计算所有数据（固定值）
// ==========================================
const kpiData = calculateKpi();
const trendsData = calculateTrends();
const efficiencyData = calculateEfficiency();
const sizeDistributionData = calculateSizeDistribution();

// ==========================================
// Handlers
// ==========================================
export const dataAnalysisData = [
  // 获取关键指标 KPI
  http.get("/analytics/kpi", () => {
    return HttpResponse.json({ code: 1, msg: "success", data: kpiData });
  }),

  // 获取过去 24 小时趋势数据
  http.get("/analytics/trends/24h", () => {
    return HttpResponse.json({ code: 1, msg: "success", data: trendsData });
  }),

  // 获取处理效率统计
  http.get("/analytics/efficiency", () => {
    return HttpResponse.json({ code: 1, msg: "success", data: efficiencyData });
  }),

  // 获取超规尺寸分布
  http.get("/analytics/size-distribution", () => {
    return HttpResponse.json({ code: 1, msg: "success", data: sizeDistributionData });
  }),

  // 获取最新报警事件
  http.get("/analytics/latest-alarms", ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || 10;
    const latestAlarms = getLatestAlarms(limit);
    return HttpResponse.json({ code: 1, msg: "success", data: latestAlarms });
  }),
];
