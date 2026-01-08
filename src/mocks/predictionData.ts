import { http, HttpResponse } from "msw";
import type { PredictionLogType } from "@/features/prediction-log/types/prediction.types";
import predictionsJson from "./data/predictions.json";

// 静态预测数据（只读）
export const allPredictions: PredictionLogType[] = predictionsJson as PredictionLogType[];

export const predictionData = [
  // 分页查询
  http.get("/predictions/page", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const status = url.searchParams.get("status");
    const result = url.searchParams.get("result");

    let filteredData = [...allPredictions];
    if (status) filteredData = filteredData.filter((item) => item.taskStatus === status);
    if (result) filteredData = filteredData.filter((item) => item.predictionResult === result);

    const start = (page - 1) * pageSize;
    const sliceData = filteredData.slice(start, start + pageSize);

    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: {
        total: filteredData.length,
        records: sliceData.map((item) => ({
          id: item.id,
          originalFilename: item.originalFilename,
          creationTime: item.creationTime,
          taskStatus: item.taskStatus,
          predictionResult: item.predictionResult,
        })),
      },
    });
  }),

  // 查询详情
  http.get("/predictions/:id", ({ params }) => {
    const targetLog = allPredictions.find((item) => item.id === Number(params.id));
    if (!targetLog) {
      return HttpResponse.json({ code: 0, msg: "未找到记录", data: null }, { status: 404 });
    }
    return HttpResponse.json({ code: 1, msg: "success", data: targetLog });
  }),

  // 获取预测统计
  http.get("/predictions/statistics", () => {
    const completed = allPredictions.filter((p) => p.taskStatus === "COMPLETED").length;
    const processing = allPredictions.filter((p) => p.taskStatus === "PROCESSING").length;
    const failed = allPredictions.filter((p) => p.taskStatus === "FAILED").length;
    const alarmTriggered = allPredictions.filter((p) => p.predictionResult === "触发报警").length;

    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: {
        total: allPredictions.length,
        completed,
        processing,
        failed,
        alarmTriggered,
        normalCount: completed - alarmTriggered,
        successRate: ((completed / allPredictions.length) * 100).toFixed(1),
        alarmRate: completed > 0 ? ((alarmTriggered / completed) * 100).toFixed(1) : "0",
      },
    });
  }),
];
