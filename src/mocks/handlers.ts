import type { ApiResponse, User } from "@/types";
import { delay, http, HttpResponse } from "msw";

// ==========================================
// 1. 模拟数据库 (Dynamic Storage)
// ==========================================
// 使用 Map 来存储所有用户，实现真正的动态增删改查
const userDatabase = new Map<string, User>();

// 初始化一个默认用户
const initialUser: User = {
  username: "test_user",
  token: "mock-jwt-token-123456",
  email: "test@example.com",
  phone: "13800138000",
  registrationDate: "2023-01-01",
  // 注意：数据库里暂时不存 avatar，我们在 get 时动态生成
};

userDatabase.set("test_user", initialUser);

// ==========================================
// 2. 辅助函数：生成图片 Blob (Base64格式)
// ==========================================
// JSON 只能传输字符串，所以我们将二进制 Blob 模拟为 Base64 Data URL
// 这是一个 1x1 像素的红色图片
// const getMockAvatarBlob = () => {
//   return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
// };

// ==========================================
// 3. Handlers 定义
// ==========================================
export const handlers = [
  // --- Login ---
  http.get("/user/login", ({ request }) => {
    // 实际场景可能需要验证密码，这里简化
    // 我们可以从 URL 获取参数来模拟不同用户登录
    // 默认返回 test_user 的 token
    const user = userDatabase.get("test_user");

    return HttpResponse.json<ApiResponse<string>>({
      code: 1,
      msg: "success",
      data: user?.token || "default-token",
    });
  }),

  // --- Register (动态添加用户) ---
  http.post("/user/register", async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      password?: string;
    };

    console.log("正在模拟注册用户:", body.username);
    await delay(1000);

    // 1. 检查用户是否已存在 (查 Map)
    if (userDatabase.has(body.username) || ["admin", "exist"].includes(body.username)) {
      return HttpResponse.json({
        code: 0,
        msg: `注册失败：用户 '${body.username}' 已存在`,
        data: null,
      });
    }

    // 2. 动态保存新用户到 "数据库"
    const newUser: User = {
      username: body.username,
      token: `mock-token-${Date.now()}`, // 生成新 token
      email: `${body.username}@example.com`, // 自动生成默认邮箱
      registrationDate: new Date().toISOString().split("T")[0],
    };
    userDatabase.set(body.username, newUser);

    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: "注册成功，请登录",
    });
  }),

  // --- Get Info (动态获取 + Avatar Blob) ---
  http.get("/user/information", ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    // 1. 从动态数据库中查找用户
    const user = userDatabase.get(username || "");

    if (user) {
      // 2. 构造返回数据：深拷贝用户对象，防止污染数据库
      const responseUser = { ...user };

      // 3. 【核心需求】将 avatar 改为 Blob (Base64) 返回
      // 无论数据库里存没存，这里都动态注入一个由 Base64 构成的“图片流”
      // responseUser.avatar = getMockAvatarBlob();
      // console.log(responseUser.avatar);
      // const file: File = responseUser.avatar!;
      // console.log(`发送图片: ${file.name}, 类型: ${file.type}, 大小: ${file.size}`);
      return HttpResponse.json<ApiResponse<User>>({
        code: 200,
        data: responseUser,
        msg: "success",
      });
    }

    return new HttpResponse(null, { status: 404, statusText: "User not found" });
  }),

  // --- Reset (动态更新) ---
  http.post("/user/reset", async ({ request }) => {
    const requestBody = (await request.json()) as User;
    console.log("收到重置请求:", requestBody);

    // 1. 校验用户是否存在
    if (!requestBody.username || !userDatabase.has(requestBody.username)) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. 校验 Token (简单模拟)
    if (!requestBody.token) {
      return new HttpResponse(null, { status: 401, statusText: "Unauthorized" });
    }

    // 3. 更新数据库
    const currentUser = userDatabase.get(requestBody.username)!;

    // 合并旧数据和新数据
    const updatedUser = {
      ...currentUser,
      ...requestBody,
      // 保持 token 和 username 不被意外覆盖（除非业务允许）
      username: currentUser.username,
      token: currentUser.token,
    };
    // const file: File = requestBody.avatar!;
    // console.log(`收到图片: ${file.name}, 类型: ${file.type}, 大小: ${file.size}`);

    userDatabase.set(requestBody.username, updatedUser);

    return HttpResponse.json<ApiResponse<string>>({
      code: 200,
      data: "Reset successful",
      msg: "OK",
    });
  }),
];
