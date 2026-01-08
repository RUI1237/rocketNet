# ============================
# 阶段 1: 构建 (Builder)
# ============================
FROM node:18-alpine as builder

WORKDIR /app

# 1. 先只拷贝 package.json (利用 Docker 缓存机制)
COPY package.json pnpm-lock.yaml ./

# 2. 安装依赖 (推荐安装 pnpm)
RUN npm install -g pnpm && pnpm install

# 3. 拷贝源代码
COPY . .

# 4. 执行打包 (生成 dist 目录)
RUN pnpm build

# ============================
# 阶段 2: 运行 (Runner)
# ============================
FROM nginx:alpine

# 1. 把刚才 build 出来的 dist 文件夹，拷贝到 Nginx 的静态资源目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 2. 拷贝我们要用的 nginx.conf 替换默认配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. 暴露 80 端口
EXPOSE 80

# 4. 启动 Nginx (daemon off 是为了让 Docker 容器不自动退出)
CMD ["nginx", "-g", "daemon off;"]
