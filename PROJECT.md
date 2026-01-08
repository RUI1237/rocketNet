# RockNet 监控管理系统

## 项目概述

RockNet 是一个基于 React +
TypeScript 的工业监控管理系统前端应用。系统提供数据分析、画面监控、报警日志、预测日志等核心功能，采用深色科技风格 UI 设计，适用于工业监控场景。

## 技术栈

| 类别        | 技术                          |
| ----------- | ----------------------------- |
| 框架        | React 18                      |
| 语言        | TypeScript 5.9                |
| 构建工具    | Vite (rolldown-vite)          |
| UI 组件库   | Ant Design 5                  |
| 路由        | React Router 7                |
| 状态管理    | Zustand 5                     |
| HTTP 客户端 | Axios                         |
| 图表库      | ECharts 6                     |
| 样式        | SCSS + CSS Modules            |
| Mock 服务   | MSW (Mock Service Worker)     |
| 代码规范    | ESLint + Prettier + Stylelint |

## 项目结构

```
src/
├── app/                    # 应用层
│   ├── layout/            # 布局组件
│   │   ├── MainLayout.tsx
│   │   └── MainLayout.module.scss
│   └── router/            # 路由配置
│       ├── index.tsx      # 路由定义
│       └── guards.tsx     # 路由守卫
│
├── features/              # 功能模块 (按业务划分)
│   ├── auth/              # 认证模块
│   ├── monitoring/        # 画面监控
│   ├── alarm-log/         # 报警日志
│   ├── prediction-log/    # 预测日志
│   ├── data-analysis/     # 数据分析
│   └── user-profile/      # 用户中心
│
├── shared/                # 共享资源
│   ├── components/        # 公共组件
│   ├── config/            # 配置文件
│   ├── hooks/             # 自定义 Hooks
│   ├── services/          # 公共服务 (HTTP 客户端等)
│   ├── styles/            # 全局样式
│   ├── types/             # 公共类型定义
│   └── utils/             # 工具函数
│
├── mocks/                 # Mock 数据
│   ├── handlers.ts        # MSW 请求处理器
│   ├── browser.ts         # MSW 浏览器配置
│   └── *.ts               # 各模块 Mock 数据
│
├── App.tsx                # 应用入口组件
└── main.tsx               # 应用启动入口
```

## 功能模块

### 1. 认证模块 (auth)

- 用户登录/注册
- Token 管理
- 登录状态持久化 (Zustand persist)
- 路由守卫 (AuthGuard / GuestGuard)

**导出内容:**

- `LoginForm` / `RegistrationForm` - 表单组件
- `useAuthStore` - 认证状态管理
- `authService` - 认证 API 服务

### 2. 数据分析模块 (data-analysis)

- KPI 概览面板
- 24小时趋势图表
- 效率分析面板
- 尺寸分布统计
- 最新报警墙

**导出内容:**

- `KpiOverview` / `TrendsPanel` / `EfficiencyPanel` 等组件
- `dataAnalysisService` - 数据分析 API 服务
- `dataAnalysisLoader` - 路由数据加载器

### 3. 画面监控模块 (monitoring)

- 实时监控画面展示
- 监控数据服务

**导出内容:**

- `MonitoringModule` - 监控主组件
- `monitoringService` - 监控 API 服务

### 4. 报警日志模块 (alarm-log)

- 报警记录列表
- 报警详情查看
- 报警处理功能

**导出内容:**

- `AlarmDetail` / `ProcessModal` - 组件
- `alarmService` - 报警 API 服务
- `alarmLogLoader` - 路由数据加载器

### 5. 预测日志模块 (prediction-log)

- 预测记录列表
- 预测详情查看

**导出内容:**

- `PredictionDetail` - 预测详情组件
- `predictionService` - 预测 API 服务
- `predictionLogLoader` - 路由数据加载器

### 6. 用户中心模块 (user-profile)

- 基本信息编辑
- 安全设置 (密码修改)
- 头像上传
- 登录日志查看

**导出内容:**

- `BasicInfoForm` / `SecuritySettingsForm` / `UserInfoSidebar` 等组件
- `profileService` - 用户信息 API 服务

## 路由结构

| 路径          | 组件              | 说明                | 权限   |
| ------------- | ----------------- | ------------------- | ------ |
| `/login`      | AuthView          | 登录/注册页         | 游客   |
| `/analysis`   | DataAnalysisView  | 数据分析 (默认首页) | 需登录 |
| `/monitoring` | MonitoringModule  | 画面监控            | 需登录 |
| `/alarm`      | AlarmLogView      | 报警日志            | 需登录 |
| `/prediction` | PredictionLogView | 预测日志            | 需登录 |
| `/profile`    | ProfileView       | 个人中心            | 需登录 |

## 路径别名

项目配置了以下路径别名，简化导入路径：

```typescript
"@/*"        -> "./src/*"
"@features/*" -> "./src/features/*"
"@shared/*"   -> "./src/shared/*"
"@app/*"      -> "./src/app/*"
```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

## Mock 服务

项目使用 MSW (Mock Service Worker) 在开发环境模拟后端 API：

- 开发环境自动启用 Mock
- 生产环境自动禁用
- Mock 数据位于 `src/mocks/` 目录
- 支持用户认证、数据查询等完整 API 模拟

### 已实现的 Mock API

| 接口                    | 方法 | 说明         |
| ----------------------- | ---- | ------------ |
| `/user/login`           | GET  | 用户登录     |
| `/user/register`        | POST | 用户注册     |
| `/user/information`     | GET  | 获取用户信息 |
| `/user/reset`           | POST | 更新用户信息 |
| `/user/change-password` | POST | 修改密码     |
| `/user/avatar`          | POST | 上传头像     |
| `/user/login-logs`      | GET  | 登录日志     |
| `/user/logout`          | POST | 退出登录     |

## UI 主题

项目采用深色科技风格主题，基于 Ant Design 暗色算法定制：

```typescript
{
  colorPrimary: "#00ddff",      // 主色调 - 青色
  colorBgBase: "#0d0221",       // 背景基色 - 深紫
  colorBgContainer: "#1d103f",  // 容器背景
  colorBorder: "rgba(0, 221, 255, 0.2)"  // 边框色
}
```

## 模块开发规范

每个功能模块遵循统一的目录结构：

```
feature-name/
├── components/     # 模块内部组件
├── services/       # API 服务
├── stores/         # 状态管理 (可选)
├── styles/         # 模块样式
├── types/          # 类型定义
├── views/          # 页面视图
└── index.ts        # 模块公共 API 导出
```

**导出规范:** 所有对外暴露的内容必须通过 `index.ts` 统一导出，其他模块只能从 `index.ts` 导入。

## 环境配置

- `.env.local` - 本地环境变量
- 支持通过 `localStorage.DEBUG_PORT` 动态切换后端地址

## 部署

项目已配置 Vercel 部署，配置文件位于 `.vercel/` 目录。
