import vue from '@vitejs/plugin-vue'

export default {
  // 解决打包路径问题
  base: './',
  plugins: [vue()],
  // 解决跨域
  // proxy: {
  //   '/movies': {
  //     target: 'http://localhost:3001', //设置调用的接口域名和端口
  //     changeOrigin: true, //是否跨域
  //     pathRewrite: {
  //       '^/movies': ''
  //     }
  //   }
  // }
}
