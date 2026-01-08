import type { AlarmLogType } from "@/features/alarm-log/types/alarm.types";
import { http, HttpResponse } from "msw";
import alarmsJson from "./data/alarms.json";

// 报警数据（可修改，用于处理报警状态更新）
export const allAlarms: AlarmLogType[] = [...(alarmsJson as AlarmLogType[])];

// 报警类型列表
const alarmTypes = ["超规石块", "皮带跑偏", "温度异常", "设备故障", "异物入侵"];

export const alarmData = [
  // 分页查询
  http.get("/alarms/page", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const status = url.searchParams.get("status");
    const alarmType = url.searchParams.get("alarmType");

    let filteredData = [...allAlarms];
    if (status) filteredData = filteredData.filter((item) => item.status === status);
    if (alarmType) filteredData = filteredData.filter((item) => item.alarmType === alarmType);

    const start = (page - 1) * pageSize;
    const pageData = filteredData.slice(start, start + pageSize);

    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: {
        total: filteredData.length,
        records: pageData.map((item) => ({
          id: item.id,
          logId: item.logId,
          alarmTime: item.alarmTime,
          alarmType: item.alarmType,
          status: item.status,
        })),
      },
    });
  }),

  // 查询详情
  http.get("/alarms/:id", ({ params }) => {
    const targetAlarm = allAlarms.find((item) => item.id === Number(params.id));
    if (!targetAlarm) {
      return HttpResponse.json({ code: 0, msg: "未找到记录", data: null }, { status: 404 });
    }
    return HttpResponse.json({ code: 1, msg: "success", data: targetAlarm });
  }),

  // 获取报警类型列表
  http.get("/alarms/types", () => {
    return HttpResponse.json({ code: 1, msg: "success", data: alarmTypes });
  }),

  // 获取报警统计
  http.get("/alarms/statistics", () => {
    const pending = allAlarms.filter((a) => a.status === "未处理").length;
    const processed = allAlarms.filter((a) => a.status === "已处理").length;

    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: {
        total: allAlarms.length,
        pending,
        processed,
        processingRate: ((processed / allAlarms.length) * 100).toFixed(1),
        typeDistribution: alarmTypes.map((type) => ({
          type,
          count: allAlarms.filter((a) => a.alarmType === type).length,
        })),
      },
    });
  }),

  // 处理报警
  http.post("/alarms/:id/process", async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { id: number; notes: string };

    const targetAlarm = allAlarms.find((item) => item.id === id);
    if (!targetAlarm) {
      return HttpResponse.json({ code: 0, msg: "未找到记录", data: null }, { status: 404 });
    }

    if (targetAlarm.status === "已处理") {
      return HttpResponse.json({ code: 0, msg: "该报警已处理", data: false });
    }

    // 更新报警状态
    targetAlarm.status = "已处理";
    targetAlarm.acknowledgedTime = new Date().toLocaleString("zh-CN");
    targetAlarm.notes = body.notes;

    return HttpResponse.json({ code: 1, msg: "处理成功", data: true });
  }),
];
