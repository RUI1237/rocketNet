// src/services/index.ts

export * from "./auth.service";
export * from "./log.service";
export * from "./image.service";

// // src/pages/SomePage.tsx (示例)

// import React, { useEffect, useState } from "react";
// import { message } from "antd";
// // 只需要从 '@/'services' 导入，非常干净！
// import { authService, logService } from "@/services";
// import type { User, Log } from "@/types";

// const SomePage: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [logs, setLogs] = useState<Log[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 并行获取用户资料和日志
//         const [userData, logData] = await Promise.all([
//           authService.getProfile(),
//           logService.getLogs({ page: 1, pageSize: 10 }),
//         ]);

//         setUser(userData);
//         setLogs(logData);
//       } catch (error) {
//         // 全局拦截器已经处理了通用错误提示
//         // 这里可以处理此页面特定的失败逻辑，比如显示一个错误状态
//         console.error("在页面中捕获到错误:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       {user && <h1>欢迎, {user.username}</h1>}
//       <h2>系统日志:</h2>
//       <ul>
//         {logs.map((log) => (
//           <li key={log.key}>{log.message}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SomePage;
