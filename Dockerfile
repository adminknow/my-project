# 构建阶段
FROM node:25-alpine AS build-stage

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖（使用国内镜像加速，可选）
RUN npm install --registry=https://registry.npmmirror.com

# 复制源码
COPY . .

# 构建项目
RUN npm run test

# 运行阶段：使用 Nginx 托管静态资源
FROM nginx:1.25.3-alpine

# 清空默认网页
RUN rm -rf /usr/share/nginx/html/*

# 从构建阶段复制打包好的文件
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 可选：自定义 Nginx 配置（支持 Vue Router history 模式）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# docker build -t my-vue-app .
# docker run -d -p 8080:80 --name vue-app my-vue-app