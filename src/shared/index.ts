// Shared module public API
// This file exports all shared components, services, utils, hooks, config, and types

// Services
export { default as apiClient, setAuthTokenGetter } from "./services/http";
export { logsService } from "./services/log.service";
export { imageService } from "./services/image.service";

// Utils
export { getErrorMessage } from "./utils/getErrorMessage";
export { base64ToFile } from "./utils/fileUtils";
export { lazyLoad } from "./utils/lazyLoad";

// Hooks
export { useMousePosition } from "./hooks/useMousePosition";

// Config
export { BASE_URL, TIME_OUT } from "./config/index";

// Types
export type { ApiResponse, QuaryLogs, ProcessPayload } from "./types";
