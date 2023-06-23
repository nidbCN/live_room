import axios from 'axios'

export const options = {
  serverAddress: "live.gaein.cn"
}

// create an axios instance
const service = axios.create({
  baseURL: `https://${options.serverAddress}:1985`,
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    return config
  },
  error => {
    // do something with request error
    console.log("[http]request error:" + error)

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
