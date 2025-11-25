export const base64ToFile = (dataurl: string, filename?: string): File => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";

  // 1. 如果没有传入文件名，我们自己生成一个
  let finalName = filename;

  if (!finalName) {
    // 简单的后缀映射逻辑
    const extension = mime.split("/")[1]; // image/png -> png
    finalName = `file_${Date.now()}.${extension}`;
  }

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], finalName, { type: mime });
};
