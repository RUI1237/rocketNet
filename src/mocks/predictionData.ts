import { http, HttpResponse } from "msw";
import { fakerZH_CN as faker } from "@faker-js/faker";
import type { PredictionEvent, PredictionLogType } from "@/types";

const allPredictions: PredictionLogType[] = Array.from({ length: 50 }).map((_, index) => {
  // 1. 随机生成状态
  const status = faker.helpers.arrayElement(["COMPLETED", "PROCESSING", "FAILED"]);
  const isCompleted = status === "COMPLETED";

  // 2. 如果任务完成，生成 1-5 个随机事件；否则为空
  const events: PredictionEvent[] = isCompleted
    ? Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map((__, i) => ({
        id: faker.string.uuid(),
        // 模拟时间戳：00:00:05, 00:00:10...
        frameTimestamp: `00:00:${String((i + 1) * 5).padStart(2, "0")}`,
        isAlarm: faker.datatype.boolean() ? "true" : "false",
        measuredLength: faker.number.float({ min: 0.1, max: 3.0, fractionDigits: 2 }),
        // 生成随机图片 URL
        resultImageUrl: faker.image.urlPicsumPhotos({ width: 300, height: 200 }),
      }))
    : [];

  return {
    id: index + 1, // ID 从 1 开始
    originalFilename: `monitor_video_${faker.string.numeric(4)}.mp4`,
    creationTime: faker.date.recent({ days: 7 }).toLocaleString(),
    taskStatus: status,
    // 只有完成的任务才有预测结果
    predictionResult: isCompleted ? faker.helpers.arrayElement(["正常", "异常"]) : undefined,
    events: events,
  };
});

export const predictionData = [
  http.get("/predictions/page", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;

    // 1. 分页切片
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const sliceData = allPredictions.slice(start, end);

    const listData = sliceData.map((item) => ({
      ...item,
      events: [], // 或者直接使用 delete item.events
    }));

    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: {
        total: allPredictions.length,
        records: listData,
      },
    });
  }),

  http.get("/predictions/:id", ({ params }) => {
    // 1. 转换 ID 类型 (确保安全转换)
    const targetId = Number(params.id);

    if (isNaN(targetId)) {
      return HttpResponse.json({ code: 0, msg: "ID格式错误", data: null }, { status: 400 });
    }

    // 2. 查找数据
    const targetLog = allPredictions.find((item) => item.id === targetId);

    if (!targetLog) {
      return HttpResponse.json({ code: 0, msg: "未找到记录", data: null }, { status: 404 });
    }

    // 3. 返回完整对象 (包含 events)
    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: targetLog,
    });
  }),
];
