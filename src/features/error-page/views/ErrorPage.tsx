import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "系统错误";
  let subTitle = "抱歉，发生了意外错误。";
  let status: any = "500";

  // 判断是否是路由层面的错误 (比如 404 Not Found, 401 Unauthorized)
  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = `${error.status}`;
    subTitle = error.statusText || error.data?.message || "页面找不到了";

    if (error.status === 404) {
      subTitle = "抱歉，您访问的页面不存在。";
    }
  } else {
    // 这是一个代码层面的错误 (比如 undefined.map)
    console.error("Application Error:", error);
    // 生产环境可以隐藏具体的 error.message
    subTitle = (error as Error)?.message || "未知错误";
  }

  return (
    <div
      style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <Button type="primary" onClick={() => navigate("/")}>
              回到首页
            </Button>
            <Button onClick={() => window.location.reload()}>刷新重试</Button>
          </div>
        }
      />
    </div>
  );
};
