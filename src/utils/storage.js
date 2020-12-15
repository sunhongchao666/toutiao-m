// 封装本地存储数据

// 1、存储数据
export const setItem = (name, value) => {
  // 将数组或者对象转换为json格式进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

// 2、获取数据
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  // 将json格式转换为 js数据的对象或数组
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

// 3、删除数据
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
