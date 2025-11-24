import type { AlarmLogType } from "@/types";
import { http, HttpResponse } from "msw";
import { fakerZH_CN as faker } from "@faker-js/faker";

const allAlarms: AlarmLogType[] = Array.from({ length: 50 }).map((_, index) => {
  // 1. 随机决定状态
  const status = faker.helpers.arrayElement(["未处理", "已处理"] as const);
  const isHandled = status === "已处理";

  // 2. 构造数据
  return {
    // 为了方便测试，让 ID 有规律：LOG-001, LOG-002...
    id: index + 1,
    logId: `LOG-${String(index + 1).padStart(3, "0")}`,
    alarmTime: faker.date.recent({ days: 30 }).toLocaleString(),
    alarmType: faker.helpers.arrayElement(["超规石块", "皮带跑偏", "温度异常"]),
    status: status,

    // --- 详情字段 ---
    originalFilename: `capture_${faker.system.commonFileName("jpg")}`,
    measuredLength: Number(faker.number.float({ min: 0.5, max: 5.0, fractionDigits: 2 })),
    resultImageUrl: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),

    // --- 核心逻辑：根据状态决定是否有处理信息 ---
    acknowledgedBy: isHandled ? faker.person.fullName() : undefined,
    acknowledgedTime: isHandled ? faker.date.recent({ days: 7 }).toLocaleString() : undefined,
    notes: isHandled ? faker.lorem.sentence() : undefined,
  };
});

export const alarmData = [
  http.get("/alarms/page", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;

    // 1. 模拟分页逻辑：计算开始和结束索引
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    // 2. 从内存数组中切割数据
    const pageData = allAlarms.slice(start, end);

    // 3. 构造返回 (列表页通常不需要返回详情里的图片、备注等大字段，这里根据需要过滤，或者直接全返也可以)
    // 这里为了演示，我们只返回列表需要的字段
    const records = pageData.map((item) => ({
      id: item.id,
      logId: item.logId,
      alarmTime: item.alarmTime,
      alarmType: item.alarmType,
      status: item.status,
    }));

    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: {
        total: allAlarms.length,
        records: records,
      },
    });
  }),

  // ------------------------------------------------
  // 接口 B: 查询详情 (GET /alarms/:id)
  // ------------------------------------------------
  http.get("/alarms/:id", ({ params }) => {
    const { id } = params;

    // 1. 从内存数组中查找对应的记录
    const targetAlarm = allAlarms.find((item) => item.id === Number(id));
    // console.log(targetAlarm);

    // 2. 如果没找到，模拟 404 或业务错误
    if (!targetAlarm) {
      return HttpResponse.json(
        {
          code: 0,
          msg: "未找到该报警记录",
          data: null,
        },
        { status: 404 }
      );
    }

    // 3. 找到了，直接返回这个对象
    // 因为我们在初始化 allAlarms 时已经根据 status 处理过 acknowledgedBy 等字段了
    // 所以这里直接返回就是一致的！
    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: targetAlarm,
    });
  }),

  http.post("/alarms/:id/process", async ({ params, request }) => {
    // 1. 获取 URL 中的 ID (转换为数字)
    const targetId = Number(params.id);

    // 2. 获取 Request Body 中的参数 (notes)
    // 注意：request.json() 是异步的，需要 await
    const body = (await request.json()) as { notes: string };

    // 3. 在内存数据库中查找对应记录
    const targetAlarm = allAlarms.find((item) => item.id === targetId);

    // 4. 如果没找到，返回错误
    if (!targetAlarm) {
      return HttpResponse.json(
        {
          code: 0,
          msg: "操作失败，未找到该记录",
          data: false,
        },
        { status: 404 }
      );
    }

    // 5. ✅ 核心步骤：直接修改内存中的对象 (实现数据持久化)
    // 这样前端虽然是乐观更新，但万一刷新页面，重新请求回来的数据也是“已处理”的
    targetAlarm.status = "已处理";
    targetAlarm.notes = body.notes;

    // 模拟后端自动获取当前用户（Mock 环境下硬编码一个名字，或者你可以从 Header 读 token）
    targetAlarm.acknowledgedBy = "Admin(Mock)";
    targetAlarm.acknowledgedTime = new Date().toLocaleString();

    // 6. 返回成功响应
    return HttpResponse.json({
      code: 1,
      msg: "处理成功",
      data: true, // 对应你前端 Promise<ApiResponse<boolean>>
    });
  }),
];
