import type { ApiResponse } from "@/shared/types";
import type { User } from "@/features/auth/types/auth.types";
import { delay, http, HttpResponse } from "msw";
import usersJson from "./data/users.json";

// ==========================================
// 用户数据类型
// ==========================================
interface StoredUser extends User {
  password: string;
  role?: string;
}

// ==========================================
// 用户数据库（从 JSON 初始化，运行时可修改）
// ==========================================
const userDatabase = new Map<string, StoredUser>();

// 从 JSON 初始化用户数据
(usersJson as StoredUser[]).forEach((user) => userDatabase.set(user.username, user));

// 登录日志
const loginLogs: Array<{
  username: string;
  loginTime: string;
  ip: string;
  device: string;
  status: string;
}> = [];

// 生成随机 IP
const randomIp = () =>
  `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

// 生成随机设备
const randomDevice = () => {
  const devices = [
    "Chrome/Windows",
    "Firefox/MacOS",
    "Safari/iOS",
    "Edge/Windows",
    "Chrome/Android",
  ];
  return devices[Math.floor(Math.random() * devices.length)];
};

// ==========================================
// Handlers 定义
// ==========================================
export const handlers = [
  // --- 登录 ---
  http.get("/user/login", async ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    const password = url.searchParams.get("password");

    await delay(800);

    if (!username) {
      return HttpResponse.json({ code: 0, msg: "用户名不能为空", data: null });
    }

    if (!password) {
      return HttpResponse.json({ code: 0, msg: "密码不能为空", data: null });
    }

    const user = userDatabase.get(username);

    if (!user) {
      return HttpResponse.json({ code: 0, msg: "用户不存在", data: null });
    }

    if (user.password !== password) {
      return HttpResponse.json({ code: 0, msg: "密码错误", data: null });
    }

    // 记录登录日志
    loginLogs.push({
      username,
      loginTime: new Date().toLocaleString("zh-CN"),
      ip: randomIp(),
      device: randomDevice(),
      status: "成功",
    });

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user;
    return HttpResponse.json({ code: 1, msg: "登录成功", data: { ...userInfo } });
  }),

  // --- 注册 ---
  http.post("/user/register", async ({ request }) => {
    const body = (await request.json()) as { username: string; password: string; email?: string };
    await delay(800);

    if (!body.username || body.username.length < 3) {
      return HttpResponse.json({ code: 0, msg: "用户名长度至少3个字符", data: null });
    }

    if (!body.password || body.password.length < 6) {
      return HttpResponse.json({ code: 0, msg: "密码长度至少6个字符", data: null });
    }

    if (userDatabase.has(body.username)) {
      return HttpResponse.json({ code: 0, msg: `用户 '${body.username}' 已存在`, data: null });
    }

    const newUser: StoredUser = {
      username: body.username,
      password: body.password,
      token: `mock-token-${Date.now()}`,
      email: body.email || `${body.username}@example.com`,
      registrationDate: new Date().toISOString().split("T")[0],
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.username}`,
      role: "user",
    };
    userDatabase.set(body.username, newUser);

    return HttpResponse.json({ code: 1, msg: "注册成功", data: "注册成功" });
  }),

  // --- 获取用户信息 ---
  http.get("/user/information", async ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    await delay(300);

    if (!username) {
      return HttpResponse.json({ code: 0, msg: "用户名不能为空", data: null });
    }

    const user = userDatabase.get(username);

    if (!user) {
      return HttpResponse.json({ code: 0, msg: "用户不存在", data: null });
    }

    const { password: _, ...userInfo } = user;
    return HttpResponse.json({ code: 1, msg: "success", data: { ...userInfo } });
  }),

  // --- 更新用户信息 ---
  http.post("/user/reset", async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const token = formData.get("token") as string;
    const email = formData.get("email") as string | null;
    const avatar = formData.get("avatar") as File | null;
    await delay(500);

    if (!username || !userDatabase.has(username)) {
      return HttpResponse.json({ code: 404, message: "用户不存在", data: null }, { status: 404 });
    }

    if (!token) {
      return HttpResponse.json({ code: 401, message: "未授权", data: null }, { status: 401 });
    }

    const currentUser = userDatabase.get(username)!;

    if (email) {
      currentUser.email = email;
    }

    if (avatar && avatar instanceof File) {
      const arrayBuffer = await avatar.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      currentUser.avatarUrl = `data:${avatar.type};base64,${base64}`;
    }

    userDatabase.set(username, currentUser);

    return HttpResponse.json<ApiResponse<string>>({ code: 200, data: "更新成功", msg: "OK" });
  }),

  // --- 修改密码 ---
  http.post("/user/change-password", async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      oldPassword: string;
      newPassword: string;
    };
    await delay(600);

    if (!body.username || !userDatabase.has(body.username)) {
      return HttpResponse.json({ code: 404, msg: "用户不存在", data: null });
    }

    const user = userDatabase.get(body.username)!;

    if (user.password !== body.oldPassword) {
      return HttpResponse.json({ code: 400, msg: "原密码错误", data: null });
    }

    if (!body.newPassword || body.newPassword.length < 6) {
      return HttpResponse.json({ code: 400, msg: "新密码长度至少6个字符", data: null });
    }

    user.password = body.newPassword;
    userDatabase.set(body.username, user);

    return HttpResponse.json({ code: 1, msg: "密码修改成功", data: true });
  }),

  // --- 获取登录日志 ---
  http.get("/user/login-logs", async ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    await delay(300);

    let filteredLogs = [...loginLogs];
    if (username) {
      filteredLogs = filteredLogs.filter((log) => log.username === username);
    }
    filteredLogs.sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());

    const start = (page - 1) * pageSize;
    return HttpResponse.json({
      code: 1,
      msg: "success",
      data: { total: filteredLogs.length, records: filteredLogs.slice(start, start + pageSize) },
    });
  }),

  // --- 上传头像 ---
  http.post("/user/avatar", async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("avatar");
    const username = formData.get("username") as string;
    await delay(800);

    if (!file || !(file instanceof File)) {
      return HttpResponse.json({ code: 400, msg: "请上传有效的图片文件", data: null });
    }

    if (!username || !userDatabase.has(username)) {
      return HttpResponse.json({ code: 404, msg: "用户不存在", data: null });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    const newAvatarUrl = `data:${file.type};base64,${base64}`;

    const user = userDatabase.get(username)!;
    user.avatarUrl = newAvatarUrl;
    userDatabase.set(username, user);

    return HttpResponse.json({ code: 1, msg: "头像上传成功", data: { avatarUrl: newAvatarUrl } });
  }),

  // --- 退出登录 ---
  http.post("/user/logout", async () => {
    await delay(200);
    return HttpResponse.json({ code: 1, msg: "退出成功", data: true });
  }),

  // --- 获取所有用户列表 ---
  http.get("/user/list", async () => {
    await delay(300);
    const users = Array.from(userDatabase.values()).map((u) => ({
      username: u.username,
      email: u.email,
      registrationDate: u.registrationDate,
      avatarUrl: u.avatarUrl,
      role: u.role,
    }));
    return HttpResponse.json({ code: 1, msg: "success", data: users });
  }),

  // --- 删除用户 ---
  http.delete("/user/:username", async ({ params }) => {
    const { username } = params;
    await delay(500);

    if (username === "admin") {
      return HttpResponse.json({ code: 403, msg: "不能删除管理员账户", data: null });
    }

    if (!userDatabase.has(username as string)) {
      return HttpResponse.json({ code: 404, msg: "用户不存在", data: null });
    }

    userDatabase.delete(username as string);
    return HttpResponse.json({ code: 1, msg: "删除成功", data: true });
  }),
];
