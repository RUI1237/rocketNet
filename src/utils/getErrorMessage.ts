export const getErrorMessage = (err: unknown): string => {
  // 1. 如果是 Axios 或后端返回的自定义对象 (e.g., Promise.reject({ msg: '用户已存在' }))
  if (err && typeof err === "object" && "msg" in err) {
    return (err as { msg: string }).msg;
  }

  // 2. 如果拦截器直接 reject 了一个字符串 (e.g., Promise.reject('注册失败'))
  if (typeof err === "string") {
    return err;
  }

  // 3. 如果是标准的 JS Error 对象 (e.g., new Error('网络错误'))
  if (err instanceof Error) {
    return err.message;
  }

  // 4. 兜底
  return "发生了未知错误，请重试";
};
