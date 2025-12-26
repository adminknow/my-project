import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 引入第三方的配置,强制预构建插件包
  optimizeDeps: {
    include: [],
  },
  // 打包配置
  build: {
    // target: "modules", // 设置最终构建的浏览器兼容目标。modules:支持原生 ES 模块的浏览器
    outDir: "dist", // 指定输出路径
    assetsDir: "assets", // 指定生成静态资源的存放路径
    sourcemap: false, // 构建后是否生成 source map 文件
    // 启用/禁用CSS代码拆分，如果禁用，整个项目的所有CSS将被提取到一个CSS文件中,默认true
    cssCodeSplit: true,
    minify: "terser", // 混淆器，terser构建后文件体积更小
    terserOptions: {
      /**
       * command 用来判断环境
       */
      compress: {
        drop_console: true,
        // 默认是true
        drop_debugger: true,
      },
    },
  },
  // 本地运行配置，及反向代理配置
  server: {
    host: "localhost", // 指定服务器主机名
    port: 3004, // 指定服务器端口
    open: false, // 在服务器启动时自动在浏览器中打开应用程序
    strictPort: false, // 设为 false 时，若端口已被占用则会尝试下一个可用端口,而不是直接退出
    https: false, // 是否开启 https
    cors: true, // 为开发服务器配置 CORS。默认启用并允许任何源
    proxy: {
      // 为开发服务器配置自定义代理规则
      // 字符串简写写法
      // 选项写法
      "/api": {
        target: "https://wxdemo.51zykj.com/toray-exam-api-e", //本地 dev
        // target: "https://wxdemo.51zykj.com/liniu-api-e", //新的 dev
        // target: "https://prd.liniu.cc/api-e/", //pro
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
