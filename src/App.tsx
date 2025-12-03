import { BrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { router } from "@/router"; // 1. 引入我们新的路由组件
import "antd/dist/reset.css";

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#00ddff",
          colorInfo: "#00ddff",
          colorBgBase: "#0d0221",
          colorBgContainer: "#1d103f",
          colorBorder: "rgba(0, 221, 255, 0.2)",
          colorText: "rgba(255, 255, 255, 0.85)",
          colorTextSecondary: "rgba(255, 255, 255, 0.65)",
        },
        components: {
          Table: { headerBg: "#150c30" },
          Modal: { headerBg: "#1d103f" },
          // Message: {
          //   colorBgElevated: "rgb(0, 0, 0)", // 这才是悬浮容器的背景色
          //   colorText: "#5c0011",
          // },
        },
      }}
    >
      {/* BrowserRouter 需要在 AppRouter 的外部 */}
      {/* <BrowserRouter> */}
      {/* 2. 在这里渲染 AppRouter，并传入所需的状态和函数 */}
      <RouterProvider router={router} />
      {/* </BrowserRouter> */}
    </ConfigProvider>
  );
}

export default App;
