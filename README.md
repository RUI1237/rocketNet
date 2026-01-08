# RockNet 监控管理系统

基于 React + TypeScript 的工业监控管理系统前端应用。

## 技术栈

| 类别        | 技术                          | 版本 |
| ----------- | ----------------------------- | ---- |
| 框架        | React                         | 18.3 |
| 语言        | TypeScript                    | 5.9  |
| 构建工具    | Vite (rolldown-vite)          | 7.1  |
| UI 组件库   | Ant Design                    | 5.27 |
| 路由        | React Router                  | 7.10 |
| 状态管理    | Zustand                       | 5.0  |
| HTTP 客户端 | Axios                         | 1.13 |
| 图表库      | ECharts                       | 6.0  |
| 样式        | SCSS + CSS Modules            | -    |
| Mock 服务   | MSW (Mock Service Worker)     | 2.12 |
| 代码规范    | ESLint + Prettier + Stylelint | -    |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint
```

## 项目文档

详细的项目说明请查看 [PROJECT.md](./PROJECT.md)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build
performances. To add it, see
[this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable
type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install
[eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)
and
[eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)
for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
