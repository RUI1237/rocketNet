/**
 * stores/index.ts
 *
 * 这是所有 Zustand stores 的统一出口文件。
 * 当需要创建一个新的 store 时，只需在这里重新导出即可。
 *
 * 示例用法:
 * import { useAuthStore, useSettingsStore } from '@/stores';
 */

export * from "./authStore";
// 当你未来有新的 store 时，在这里继续添加
// export * from './settingsStore';
// export * from './themeStore';
