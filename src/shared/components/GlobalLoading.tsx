import { useEffect } from "react";
import { useNavigation } from "react-router-dom";
import nprogress from "nprogress";
import "nprogress/nprogress.css"; // 别忘了引入样式

// 配置 NProgress (去掉右上角的转圈圈)
// nprogress.configure({ showSpinner: false });

export default function GlobalLoading() {
  const navigation = useNavigation();

  useEffect(() => {
    // idle: 空闲, loading: 加载中, submitting: 提交表单中
    if (navigation.state === "idle") {
      nprogress.done();
    } else {
      nprogress.start();
    }
  }, [navigation.state]);

  return null; // 这个组件不需要渲染任何 DOM
}
