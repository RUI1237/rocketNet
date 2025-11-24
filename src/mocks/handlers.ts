import type { ApiResponse } from "@/types";
import { delay, http, HttpResponse } from "msw";

// ==========================================
// 3. Handlers 定义
// ==========================================

export const handlers = [
  http.get("/user/login", () => {
    return HttpResponse.json<ApiResponse<string>>({
      code: 1,
      msg: "success",
      data: "shdfahjsfdfashd",
    });
  }),
  http.post("/user/register", async ({ request }) => {
    // 1. 获取前端提交的注册信息
    // 这里的类型定义是为了代码提示，你可以根据实际表单字段修改
    const body = (await request.json()) as {
      username: string;
      password?: string;
    };

    console.log("正在模拟注册用户:", body.username);

    // 2. 模拟网络延迟 (1秒)，方便观察前端 Loading 状态
    await delay(1000);

    // 3. 模拟业务逻辑：失败场景
    // 假设：如果用户名为 "admin" 或 "exist"，提示用户已存在
    if (["admin", "exist"].includes(body.username)) {
      return HttpResponse.json({
        code: 0, // 假设 0 代表业务失败
        msg: `注册失败：用户 '${body.username}' 已存在`,
        data: null,
      });
    }

    // 4. 模拟业务逻辑：成功场景
    // 返回 ApiResponse<string>，data 通常是一个提示或者是新用户的 ID
    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: "注册成功，请登录", // 对应泛型 <string>
    });
  }),
];
