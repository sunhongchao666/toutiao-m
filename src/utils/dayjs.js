import dayjs from 'dayjs'
import Vue from 'vue'

// 加载dayjs中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 配置dayjs  全局可使用
dayjs.locale('zh-cn')

// 定义一个全局过滤器
// 过滤器第一个参数是过滤器名称，第二个参数是过滤器的处理函数
Vue.filter('relativeTime', value => {
  // 其中 dayjs() 是当前时间  (dayjs(value))传过来的时间
  return dayjs().to(dayjs(value))
})

console.log(dayjs().format('YYYY-MM-DD'))
