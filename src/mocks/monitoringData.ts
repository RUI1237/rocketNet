import { http, HttpResponse, delay } from "msw";

export const monitoringData = [
  // 上传图片并分析 - 返回 ApiResponse<string>，data 是图片 URL
  http.post("/detection/image", async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return HttpResponse.json(
        { code: 400, msg: "请上传有效的图片文件", data: null },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return HttpResponse.json(
        { code: 400, msg: "只支持图片格式文件", data: null },
        { status: 400 }
      );
    }

    // 模拟处理延迟
    await delay(1000);

    // 将上传的图片转为 base64 返回
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    const dataUrl = `data:${file.type};base64,${base64}`;

    return HttpResponse.json({
      code: 1,
      msg: "检测完成",
      data: dataUrl,
    });
  }),

  // 获取实时监控状态
  http.get("/monitoring/status", () => {
    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: {
        isOnline: true,
        lastHeartbeat: new Date().toISOString(),
        currentFps: 28.5,
        resolution: "1920x1080",
        cpuUsage: 45.2,
        gpuUsage: 62.8,
        modelVersion: "v2.3.1",
      },
    });
  }),

  // 获取监控设备列表
  http.get("/monitoring/devices", () => {
    const devices = [
      { id: 1, name: "1号输送带摄像头", location: "进料口", status: "online" },
      { id: 2, name: "1号输送带摄像头", location: "中段", status: "online" },
      { id: 3, name: "2号输送带摄像头", location: "进料口", status: "online" },
      { id: 4, name: "破碎机监控", location: "入口", status: "online" },
      { id: 5, name: "筛分机监控", location: "A区", status: "maintenance" },
    ];

    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: { devices, total: devices.length },
    });
  }),
];
