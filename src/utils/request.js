import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: 'https://v4-us-ny.gaein.cn:1985',
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 120 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    return config
  },
  error => {
    // do something with request error
    console.log("[http]request error:" + error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log('[http]response error:' + error)

    return Promise.reject(error)
  }
)

export default service
