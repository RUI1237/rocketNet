import React, { Suspense } from "react";
import { Spin } from "antd"; // 或者是其他的 Loading 组件

// 这个就是 lazyLoad 函数的内部逻辑
export const lazyLoad = (importFunc: () => Promise<any>) => {
  // 1. 使用 React.lazy 动态导入组件
  const LazyComponent = React.lazy(importFunc);

  // 2. 返回一个组件，外层包裹 Suspense
  return (
    // fallback 是在 JS 文件还没下载完时显示的内容（比如转圈圈）
    <Suspense
      fallback={
        <Spin
          size="large"
          style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
        />
      }
    >
      <LazyComponent />
    </Suspense>
  );
};
