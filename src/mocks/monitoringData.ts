import { http, HttpResponse, delay } from "msw";

export const monitoringData = [
  // ... 其他 handlers ...

  // ------------------------------------------------
  // 接口: 上传图片并分析 (直接把上传的图原样返回)
  // URL: POST /detection/image
  // ------------------------------------------------
  http.post("/detection/image", async ({ request }) => {
    // 1. 解析 FormData
    const formData = await request.formData();

    // ⚠️ 注意：这里的 "file" 必须和你前端 formData.append('file', ...) 里的 key 一致
    const file = formData.get("image");

    // 2. 校验是否有文件
    if (!file || !(file instanceof File)) {
      return HttpResponse.text("请上传有效的文件", { status: 400 });
    }

    console.log(`收到图片: ${file.name}, 类型: ${file.type}, 大小: ${file.size}`);

    // 3. 模拟一点网络延迟 (比如 1.5秒)，让 loading 效果能展示出来
    await delay(1000);

    // 4. 直接把文件对象返回！
    // File 对象本身就是一种特殊的 Blob，可以直接作为 HttpResponse 的 body
    return new HttpResponse(file, {
      headers: {
        // 动态设置 Content-Type，上传的是 png 就回 png，是 jpg 就回 jpg
        "Content-Type": file.type,

        // (可选) 如果你想模拟这是一个新生成的图，也可以强制写死 'image/jpeg'
        // "Content-Type": "image/jpeg",
      },
    });
  }),
];
