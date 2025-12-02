import { http, HttpResponse } from "msw";

// 运营监控中心相关的模拟接口
export const dataAnalysisData = [
  // 1. 获取仪表盘顶部的四个关键实时指标
  http.get("/analytics/kpi", () => {
    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: {
        tasksToday: 1502,
        alarmsToday: 25,
        totalAlarms: 3450,
        pendingAlarms: 5,
      },
    });
  }),

  // 2. 获取过去 24 小时趋势数据
  http.get("/analytics/trends/24h", () => {
    const hours: string[] = [];
    const taskCounts: number[] = [];
    const alarmCounts: number[] = [];

    // 简单生成 24 个小时点和对应的 mock 数据
    for (let i = 0; i < 24; i++) {
      const label = `${String(i).padStart(2, "0")}:00`;
      hours.push(label);

      // 夜间任务略少一些，报警比例略高一点，体现“全天候监控”
      const isNight = i < 6 || i >= 22;
      const baseTasks = isNight ? 80 : 130;
      const baseAlarms = isNight ? 4 : 2;

      taskCounts.push(baseTasks + Math.round(Math.random() * 30));
      alarmCounts.push(baseAlarms + Math.round(Math.random() * 3));
    }

    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: {
        hours,
        taskCounts,
        alarmCounts,
      },
    });
  }),

  // 3. 获取报警处理效率统计
  http.get("/analytics/efficiency", () => {
    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: {
        totalAlarms: 3450,
        processedAlarms: 3445,
        pendingAlarms: 5,
        avgResolutionTimeMinutes: 15,
      },
    });
  }),

  // 4. 获取超规尺寸分布数据
  http.get("/analytics/size-distribution", () => {
    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: {
        sizeRanges: ["1.0-1.1m", "1.1-1.2m", "1.2-1.3m", "1.3-1.4m", "1.4-1.5m", "1.5m+"],
        counts: [250, 890, 1230, 760, 210, 110],
      },
    });
  }),

  // 5. 获取最新报警事件快照
  http.get("/analytics/latest-alarms", ({ request }) => {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 10;

    const all = Array.from({ length: 20 }).map((_, index) => ({
      alarmId: 3450 - index,
      imageUrl: `https://picsum.photos/seed/alarm-${index}/400/300`,
      measuredLength: Number((1.0 + Math.random() * 0.8).toFixed(2)),
      alarmTime: `2025-11-20 ${String(10 - Math.floor(index / 2)).padStart(2, "0")}:${String(
        (index * 3) % 60
      ).padStart(2, "0")}:00`,
    }));

    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: all.slice(0, limit),
    });
  }),
];



